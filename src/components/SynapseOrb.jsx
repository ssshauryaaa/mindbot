import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SynapseParticles({ count = 250, isMobile = false }) {
  const groupRef = useRef(null);
  const linesRef = useRef(null);
  const cyanPointsRef = useRef(null);
  const violetPointsRef = useRef(null);

  // Pointer tracking for parallax
  const pointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      pointerPos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.6,
        y: (e.clientY / window.innerHeight - 0.5) * 0.6,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate cyan (AI) and violet (Human) particle positions
  const { cyanPositions, violetPositions, linePositions, lineColors } = useMemo(() => {
    const pCount = isMobile ? Math.floor(count * 0.4) : count;
    const cyan = new Float32Array(pCount * 3);
    const violet = new Float32Array(pCount * 3);

    const radius = 2.4;

    // Cyan cloud (AI - slightly tighter core + outer shell)
    for (let i = 0; i < pCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * (0.6 + 0.4 * Math.random());

      cyan[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      cyan[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      cyan[i * 3 + 2] = r * Math.cos(phi);
    }

    // Violet cloud (Human - slightly interleaved outer shell)
    for (let i = 0; i < pCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * (0.7 + 0.4 * Math.random());

      violet[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      violet[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      violet[i * 3 + 2] = r * Math.cos(phi);
    }

    // Inter-cloud distance graph lines
    const lineCoords = [];
    const lineCols = [];
    const threshold = 1.6;

    for (let i = 0; i < pCount; i += 2) {
      const x1 = cyan[i * 3];
      const y1 = cyan[i * 3 + 1];
      const z1 = cyan[i * 3 + 2];

      for (let j = 0; j < pCount; j += 2) {
        const x2 = violet[j * 3];
        const y2 = violet[j * 3 + 1];
        const z2 = violet[j * 3 + 2];

        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        if (dist < threshold) {
          lineCoords.push(x1, y1, z1, x2, y2, z2);
          // Synapse bridge color (indigo-purple mix)
          lineCols.push(0.48, 0.36, 1.0, 0.48, 0.36, 1.0);
        }
      }
    }

    return {
      cyanPositions: cyan,
      violetPositions: violet,
      linePositions: new Float32Array(lineCoords),
      lineColors: new Float32Array(lineCols),
    };
  }, [count, isMobile]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Slow continuous rotation
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += delta * 0.05;

    // Smooth lerp mouse parallax tilt
    if (!isMobile) {
      groupRef.current.rotation.y += (pointerPos.current.x - groupRef.current.rotation.y * 0.2) * 0.05;
      groupRef.current.rotation.x += (-pointerPos.current.y - groupRef.current.rotation.x * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cyan Point Cloud (Artificial Mind) */}
      <points ref={cyanPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cyanPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.06 : 0.08}
          color="#00D4FF"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Violet Point Cloud (Human Mind) */}
      <points ref={violetPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[violetPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.06 : 0.08}
          color="#B24BF3"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Neural Synapse Connection Lines */}
      {linePositions.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[lineColors, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {/* Core Energy Glow Sphere */}
      <mesh>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial
          color="#7C5CFF"
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Mobile SVG/Canvas animated fallback component
function MobileSvgFallback() {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ai-500/20 via-synapse-500/30 to-human-500/20 blur-2xl animate-pulse" />
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
        <circle cx="100" cy="100" r="70" stroke="url(#fallback-grad)" strokeWidth="1.5" fill="none" opacity="0.5" strokeDasharray="6 6">
          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="50" stroke="#7C5CFF" strokeWidth="1" fill="none" opacity="0.4">
          <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="15s" repeatCount="indefinite" />
        </circle>
        <defs>
          <linearGradient id="fallback-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#B24BF3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function SynapseOrbCanvas() {
  const [isLowPerf, setIsLowPerf] = React.useState(false);

  useEffect(() => {
    const isMobileDevice = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobileDevice || prefersReducedMotion) {
      setIsLowPerf(true);
    }
  }, []);

  if (isLowPerf) {
    return <MobileSvgFallback />;
  }

  return (
    <div className="w-full h-[380px] sm:h-[450px] md:h-[550px] relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <SynapseParticles count={240} />
      </Canvas>
    </div>
  );
}
