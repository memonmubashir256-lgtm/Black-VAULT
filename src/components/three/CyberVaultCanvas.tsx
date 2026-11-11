import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CyberVaultCanvasProps {
  interactive?: boolean;
}

export const CyberVaultCanvas: React.FC<CyberVaultCanvasProps> = ({ interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<'neon-green' | 'neon-red' | 'electric-cyan'>('neon-green');
  const [isRotating, setIsRotating] = useState(true);
  const [pulseActive, setPulseActive] = useState(false);

  // Use refs for animation loop access without tearing down Three.js canvas
  const themeRef = useRef(activeTheme);
  themeRef.current = activeTheme;

  const rotatingRef = useRef(isRotating);
  rotatingRef.current = isRotating;

  const triggerScanRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL renderer per Three.js guidelines
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050607, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x003B27, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00FF88, 3, 10);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    const pointLightRed = new THREE.PointLight(0xFF304F, 1.5, 8);
    pointLightRed.position.set(-2, -1, -2);
    scene.add(pointLightRed);

    // 3. Procedural Cyber Vault Group (3-12 parts)
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // Part A: Inner Faceted Core Cube (Data Shard)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x051a10,
      emissive: 0x00ff88,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: false,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    vaultGroup.add(coreMesh);

    // Part B: Outer Wireframe Security Cage
    const cageGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const cageWireGeo = new THREE.WireframeGeometry(cageGeo);
    const cageMat = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const cageLine = new THREE.LineSegments(cageWireGeo, cageMat);
    vaultGroup.add(cageLine);

    // Part C: Holographic Gimbal Ring 1 (Yaw)
    const ring1Geo = new THREE.TorusGeometry(1.25, 0.015, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    vaultGroup.add(ring1);

    // Part D: Holographic Gimbal Ring 2 (Pitch)
    const ring2Geo = new THREE.TorusGeometry(1.4, 0.012, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    vaultGroup.add(ring2);

    // Part E: Holographic Gimbal Ring 3 (Roll)
    const ring3Geo = new THREE.TorusGeometry(1.55, 0.01, 16, 64);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xff304f,
      transparent: true,
      opacity: 0.4,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    vaultGroup.add(ring3);

    // Part F: Floating Corner Node Crystals
    const cornerNodesGroup = new THREE.Group();
    const cornerGeo = new THREE.OctahedronGeometry(0.08);
    const cornerMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const cornerOffsets = [
      [-0.75, -0.75, -0.75], [0.75, -0.75, -0.75],
      [-0.75, 0.75, -0.75],  [0.75, 0.75, -0.75],
      [-0.75, -0.75, 0.75],  [0.75, -0.75, 0.75],
      [-0.75, 0.75, 0.75],   [0.75, 0.75, 0.75],
    ];
    cornerOffsets.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(cornerGeo, cornerMat);
      node.position.set(x, y, z);
      cornerNodesGroup.add(node);
    });
    vaultGroup.add(cornerNodesGroup);

    // 4. Cyberpunk Ground Grid
    const gridHelper = new THREE.GridHelper(24, 32, 0x00ff88, 0x002617);
    gridHelper.position.y = -1.6;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.5;
    scene.add(gridHelper);

    // 5. Ambient Particle Swarm
    const particleCount = isSoftwareGl ? 120 : 350;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i] = 0.2 + Math.random() * 0.8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Scan Pulse Ring (Triggerable)
    const pulseRingGeo = new THREE.RingGeometry(0.2, 0.25, 32);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.rotation.x = -Math.PI / 2;
    vaultGroup.add(pulseRing);

    let pulseScale = 0;
    let isPulsing = false;

    triggerScanRef.current = () => {
      isPulsing = true;
      pulseScale = 0.5;
      pulseRingMat.opacity = 0.9;
    };

    // 6. Mouse Interaction & Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.4;
      mouseY = y * 0.3;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 7. Paced Render Loop (Software-WebGL compatible)
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Color Theme Updates
      const theme = themeRef.current;
      let primaryHex = 0x00ff88;
      let secondaryHex = 0x00e5ff;
      if (theme === 'neon-red') {
        primaryHex = 0xff304f;
        secondaryHex = 0xff8800;
      } else if (theme === 'electric-cyan') {
        primaryHex = 0x00f0ff;
        secondaryHex = 0x7000ff;
      }

      coreMat.emissive.setHex(primaryHex);
      cageMat.color.setHex(primaryHex);
      ring1Mat.color.setHex(primaryHex);
      ring2Mat.color.setHex(secondaryHex);
      pointLight.color.setHex(primaryHex);
      cornerMat.color.setHex(primaryHex);
      particleMat.color.setHex(primaryHex);

      // Core Vault Motion
      if (rotatingRef.current) {
        vaultGroup.rotation.y += delta * 0.45;
        vaultGroup.position.y = Math.sin(time * 1.5) * 0.12 + 0.1;
      }

      // Smooth Mouse Tilt
      targetRotationX = mouseY;
      targetRotationY = mouseX;
      vaultGroup.rotation.x = THREE.MathUtils.damp(vaultGroup.rotation.x, targetRotationX, 4, delta);
      vaultGroup.rotation.z = THREE.MathUtils.damp(vaultGroup.rotation.z, -targetRotationY * 0.5, 4, delta);

      // Gimbal Rings relative counter-rotations
      ring1.rotation.z += delta * 0.6;
      ring2.rotation.x += delta * 0.4;
      ring3.rotation.y -= delta * 0.5;

      // Particle Animation
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] += speeds[i] * delta * 0.3;
        if (array[i * 3 + 1] > 3) {
          array[i * 3 + 1] = -2;
        }
      }
      posAttr.needsUpdate = true;

      // Scan Pulse Ring Animation
      if (isPulsing) {
        pulseScale += delta * 2.8;
        pulseRing.scale.set(pulseScale, pulseScale, pulseScale);
        pulseRingMat.opacity = Math.max(0, 1 - pulseScale / 3.5);
        if (pulseScale >= 3.5) {
          isPulsing = false;
          pulseRingMat.opacity = 0;
        }
      }

      // Ground Grid subtle scroll
      gridHelper.position.z = (time * 0.2) % 1;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pulseRingGeo.dispose();
      pulseRingMat.dispose();
    };
  }, [interactive]);

  const triggerScan = () => {
    setPulseActive(true);
    if (triggerScanRef.current) {
      triggerScanRef.current();
    }
    setTimeout(() => setPulseActive(false), 1200);
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] flex items-center justify-center overflow-hidden rounded-2xl border border-[#00FF88]/20 bg-[#050607]/80">
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        data-testid="cyber-vault-canvas"
      />

      {/* Cyber Corner Accents */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <div className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse" />
        <span className="font-mono text-[11px] text-[#00FF88] tracking-widest uppercase">
          SECURE_VAULT_CORE // SIMULATED 3D NODE
        </span>
      </div>

      <div className="absolute top-3 right-3 hidden sm:flex items-center gap-2 pointer-events-none font-mono text-[10px] text-[#728078]">
        <span>GL_HASH: 0x9AF8...2C1B</span>
        <span className="text-[#00FF88]">[ENCRYPTED]</span>
      </div>

      {/* Collapsible Bottom Control Dock (Follows 3D Skill Directives) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-lg bg-[#0B1010]/90 border border-[#00FF88]/30 shadow-lg text-xs z-10">
        {/* Rotation toggle */}
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`px-2.5 py-1 rounded font-mono text-[11px] transition-all ${
            isRotating
              ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40'
              : 'text-[#728078] hover:text-[#E5F5EC]'
          }`}
          aria-label={isRotating ? 'Pause 3D rotation' : 'Resume 3D rotation'}
        >
          {isRotating ? 'ROTATE: ON' : 'ROTATE: OFF'}
        </button>

        {/* Scan pulse button */}
        <button
          type="button"
          onClick={triggerScan}
          className={`px-2.5 py-1 rounded font-mono text-[11px] transition-all ${
            pulseActive
              ? 'bg-[#00FF88] text-black font-bold'
              : 'bg-[#003B27]/60 text-[#00FF88] hover:bg-[#003B27]'
          }`}
          aria-label="Scan vault core with radar wave"
        >
          {pulseActive ? 'SCANNING...' : 'SCAN VAULT'}
        </button>

        {/* Color theme swatches */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-[#00FF88]/20">
          <button
            type="button"
            onClick={() => setActiveTheme('neon-green')}
            className={`w-4 h-4 rounded-full bg-[#00FF88] transition-transform ${
              activeTheme === 'neon-green' ? 'scale-125 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'
            }`}
            title="Matrix Green"
            aria-label="Set 3D theme to Matrix Green"
          />
          <button
            type="button"
            onClick={() => setActiveTheme('neon-red')}
            className={`w-4 h-4 rounded-full bg-[#FF304F] transition-transform ${
              activeTheme === 'neon-red' ? 'scale-125 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'
            }`}
            title="Cyber Red"
            aria-label="Set 3D theme to Cyber Red"
          />
          <button
            type="button"
            onClick={() => setActiveTheme('electric-cyan')}
            className={`w-4 h-4 rounded-full bg-[#00F0FF] transition-transform ${
              activeTheme === 'electric-cyan' ? 'scale-125 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'
            }`}
            title="Electric Cyan"
            aria-label="Set 3D theme to Electric Cyan"
          />
        </div>
      </div>
    </div>
  );
};
