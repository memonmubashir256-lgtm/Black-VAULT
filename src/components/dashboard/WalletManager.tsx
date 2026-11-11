import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { UserProfile, WalletTransaction } from '../../types';
import { processDeposit, processWithdrawal } from '../../utils/walletRules';
import { formatCredits, maskHash, formatTimestamp } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface WalletManagerProps {
  currentUser: UserProfile;
  transactions: WalletTransaction[];
  onUpdateBalance: (newBalance: number, newTx?: WalletTransaction) => void;
}

export const WalletManager: React.FC<WalletManagerProps> = ({
  currentUser,
  transactions,
  onUpdateBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw'>('overview');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(250);
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null);

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('100');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('0x71C...49A2 [Simulated Address]');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

  // Copied address indicator
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleDeposit = (amount: number) => {
    soundFx.playSuccess();
    const result = processDeposit(currentUser.walletBalance, amount);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amount: amount,
      description: 'Simulated Network Deposit',
      timestamp: new Date().toISOString(),
      txHash: result.txHash,
      status: 'Confirmed',
    };
    onUpdateBalance(result.newBalance, newTx);
    setDepositSuccess(`Successfully credited ${formatCredits(amount)} to your simulated wallet.`);
    setTimeout(() => setDepositSuccess(null), 4000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    const result = processWithdrawal(currentUser.walletBalance, amountNum);

    if (!result.success) {
      soundFx.playGlitch();
      setWithdrawError(result.error || 'Withdrawal rejected.');
      setWithdrawSuccess(null);
    } else {
      soundFx.playSuccess();
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'withdrawal',
        amount: amountNum,
        description: `Simulated Transfer to ${maskHash(withdrawAddress, 6, 4)}`,
        timestamp: new Date().toISOString(),
        txHash: result.txHash!,
        status: 'Confirmed',
      };
      onUpdateBalance(result.newBalance, newTx);
      setWithdrawError(null);
      setWithdrawSuccess(
        `Sent ${formatCredits(amountNum)} to mock address. TX Hash: ${maskHash(result.txHash!, 6, 4)}`
      );
      setWithdrawAmount('50');
      setTimeout(() => setWithdrawSuccess(null), 5000);
    }
  };

  const copySimAddress = () => {
    soundFx.playTerminalBeep(1200, 0.04);
    if (navigator?.clipboard) {
      navigator.clipboard.writeText('0x9a84B3c90Fa1137c89140026eE1a980753049b21');
    }
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Warning Banner */}
      <div className="p-3 rounded-xl bg-[#003B27]/40 border border-[#00FF88]/30 flex items-center justify-between text-xs text-[#00FF88]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#00FF88]" />
          <span>
            <strong>DEMO MODE:</strong> All balances are fictional credits. Deposits and withdrawals are simulated in memory.
          </span>
        </div>
        <span className="text-[10px] text-[#728078] hidden sm:inline">NO REAL MONEY</span>
      </div>

      {/* Hero Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Main Available Balance */}
        <div className="bg-[#050607] p-5 rounded-2xl border border-[#00FF88]/40 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-[#728078] uppercase block">
                AVAILABLE DEMO BALANCE
              </span>
              <span className="text-2xl sm:text-3xl font-cyber font-bold text-[#00FF88] mt-1 block">
                {formatCredits(currentUser.walletBalance)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#003B27] border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-[#728078] mt-3">
            Simulated Liquid BVT tokens for asset purchases
          </p>
        </div>

        {/* Escrow Balance */}
        <div className="bg-[#050607] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-[#728078] uppercase block">
                HELD IN ESCROW [DEMO]
              </span>
              <span className="text-2xl sm:text-3xl font-cyber font-bold text-white mt-1 block">
                {formatCredits(currentUser.escrowBalance)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0B1010] border border-[#00FF88]/20 flex items-center justify-center text-[#00FF88]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-[#728078] mt-3">
            Released automatically upon simulated download verification
          </p>
        </div>

        {/* Fictional Address Box */}
        <div className="bg-[#050607] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-[#728078] uppercase block">
              MOCK TESTNET ADDRESS
            </span>
            <div className="flex items-center justify-between text-xs text-[#E5F5EC] mt-1 break-all">
              <span>0x9a84...9b21</span>
              <button
                type="button"
                onClick={copySimAddress}
                className="text-[#00FF88] hover:underline p-1 flex items-center gap-1 cursor-pointer text-[11px]"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-[#00FF88] mt-2">
            ECDSA P-256 Mock Key Active
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#00FF88]/20 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40'
              : 'text-[#728078] hover:text-white'
          }`}
        >
          TRANSACTIONS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('deposit')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'deposit'
              ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40'
              : 'text-[#728078] hover:text-white'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <span>DEPOSIT DEMO FUNDS</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('withdraw')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'withdraw'
              ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40'
              : 'text-[#728078] hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>WITHDRAW SIMULATED</span>
        </button>
      </div>

      {/* Tab: Overview (Transactions) */}
      {activeTab === 'overview' && (
        <div className="bg-[#050607] border border-[#00FF88]/20 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#00FF88]/15 flex items-center justify-between">
            <h3 className="font-cyber text-sm font-bold text-white">
              SIMULATED TRANSACTION LEDGER
            </h3>
            <span className="text-[10px] text-[#728078]">
              {transactions.length} RECORDED BLOCKS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1010] text-[#728078] border-b border-[#00FF88]/15 text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">TYPE</th>
                  <th className="py-2.5 px-4">DESCRIPTION</th>
                  <th className="py-2.5 px-4">AMOUNT</th>
                  <th className="py-2.5 px-4">HASH</th>
                  <th className="py-2.5 px-4">TIME</th>
                  <th className="py-2.5 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00FF88]/10">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#0B1010]/50 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.type === 'deposit'
                            ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30'
                            : tx.type === 'withdrawal'
                            ? 'bg-[#FF304F]/20 text-[#FF304F] border border-[#FF304F]/30'
                            : 'bg-neutral-800 text-[#E5F5EC]'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#E5F5EC] max-w-[200px] truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#E5F5EC]">
                      <span
                        className={
                          tx.type === 'deposit'
                            ? 'text-[#00FF88]'
                            : tx.type === 'withdrawal' || tx.type === 'purchase'
                            ? 'text-[#FF304F]'
                            : 'text-[#E5F5EC]'
                        }
                      >
                        {tx.type === 'deposit' ? '+' : '-'}
                        {formatCredits(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#728078] text-[10px]">
                      {maskHash(tx.txHash, 6, 4)}
                    </td>
                    <td className="py-3 px-4 text-[#728078] text-[10px]">
                      {formatTimestamp(tx.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-[#00FF88] text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Deposit */}
      {activeTab === 'deposit' && (
        <div className="bg-[#050607] border border-[#00FF88]/20 rounded-2xl p-6 space-y-5 max-w-xl">
          <div>
            <h3 className="font-cyber font-bold text-white text-base">
              SIMULATE DEMO CREDIT DEPOSIT
            </h3>
            <p className="text-xs text-[#728078] mt-1">
              Inject fictional BVT test credits into your simulation wallet. No real credit card, bank, or crypto is requested.
            </p>
          </div>

          {depositSuccess && (
            <div className="p-3 rounded-lg bg-[#003B27] border border-[#00FF88] text-xs text-[#00FF88] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{depositSuccess}</span>
            </div>
          )}

          <div>
            <label className="text-xs text-[#728078] block mb-2 font-bold uppercase">
              SELECT PRESET TOP-UP AMOUNT:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleDeposit(amt)}
                  className="py-3 px-4 rounded-xl bg-[#0B1010] border border-[#00FF88]/30 hover:border-[#00FF88] hover:neon-glow-green text-center text-xs font-bold text-[#00FF88] transition-all cursor-pointer"
                >
                  +{amt} BVT
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Withdraw */}
      {activeTab === 'withdraw' && (
        <form
          onSubmit={handleWithdraw}
          className="bg-[#050607] border border-[#00FF88]/20 rounded-2xl p-6 space-y-5 max-w-xl"
        >
          <div>
            <h3 className="font-cyber font-bold text-white text-base">
              SIMULATE WITHDRAWAL
            </h3>
            <p className="text-xs text-[#728078] mt-1">
              Simulate transferring BVT credits out of the network to an external mock testnet address.
            </p>
          </div>

          {withdrawError && (
            <div className="p-3 rounded-lg bg-[#FF304F]/20 border border-[#FF304F] text-xs text-[#FF304F] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{withdrawError}</span>
            </div>
          )}

          {withdrawSuccess && (
            <div className="p-3 rounded-lg bg-[#003B27] border border-[#00FF88] text-xs text-[#00FF88] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{withdrawSuccess}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#728078] block mb-1">WITHDRAWAL AMOUNT (BVT):</label>
              <input
                type="number"
                min="1"
                max={currentUser.walletBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-[#0B1010] border border-[#00FF88]/30 rounded-xl p-3 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
              <span className="text-[10px] text-[#728078] mt-1 block">
                Max available: {formatCredits(currentUser.walletBalance)}
              </span>
            </div>

            <div>
              <label className="text-xs text-[#728078] block mb-1">
                DESTINATION SIMULATED TEST ADDRESS:
              </label>
              <input
                type="text"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="w-full bg-[#0B1010] border border-[#00FF88]/30 rounded-xl p-3 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.2)]"
          >
            CONFIRM SIMULATED WITHDRAWAL
          </button>
        </form>
      )}
    </div>
  );
};
