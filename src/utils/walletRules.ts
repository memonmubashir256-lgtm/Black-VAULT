export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

export function canAffordPurchase(balance: number, total: number): boolean {
  return balance >= total && total > 0;
}

export function processDeposit(
  currentBalance: number,
  depositAmount: number
): { newBalance: number; txHash: string; status: 'Confirmed' } {
  const validAmount = Math.max(0, depositAmount);
  const newBalance = Math.round((currentBalance + validAmount) * 100) / 100;
  return {
    newBalance,
    txHash: generateTxHash(),
    status: 'Confirmed',
  };
}

export function processWithdrawal(
  currentBalance: number,
  withdrawAmount: number
): {
  success: boolean;
  newBalance: number;
  txHash?: string;
  error?: string;
} {
  if (withdrawAmount <= 0) {
    return {
      success: false,
      newBalance: currentBalance,
      error: 'Withdrawal amount must be greater than zero.',
    };
  }

  if (withdrawAmount > currentBalance) {
    return {
      success: false,
      newBalance: currentBalance,
      error: 'Insufficient fictional wallet balance.',
    };
  }

  const newBalance = Math.round((currentBalance - withdrawAmount) * 100) / 100;
  return {
    success: true,
    newBalance,
    txHash: generateTxHash(),
  };
}
