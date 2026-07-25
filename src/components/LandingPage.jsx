import React, { useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import Mannequin from './Mannequin';
import { Signature } from './Signature';
import { LiquidMetalButton } from './ui/liquid-metal-button';

export default function LandingPage() {
  const navigate = useNavigate();

  // Plain ref, not state — useFrame reads this directly every tick,
  // no need to trigger React re-renders on mouse movement.
  const pointer = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    // y: -1 at the top of the screen, 1 at the bottom
    pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  return (
    <div
      className="w-screen h-screen bg-black text-white relative overflow-hidden"
      onPointerMove={handlePointerMove}
    >

      <Canvas shadows camera={{ position: [0, 0.15, 5], fov: 32 }}>
        <ambientLight intensity={0.15} />

        {/* Tight, close-range lights aimed at the face — this is what
            produces the diagonal magenta -> cyan streak, kept close so
            it doesn't wash color over the whole body */}
        <pointLight position={[2.7, 0.7, 1.6]} intensity={16} color="#ff4d8d" distance={2.6} />
        <pointLight position={[1.9, 0.1, 1.4]} intensity={12} color="#38c9ff" distance={2.6} />

        {/* Cool blue-white key light — gives the body its glossy specular
            highlights (shoulders, collarbone) without tinting it pink/cyan */}
        <pointLight position={[1, 2.5, 3]} intensity={18} color="#dce8ff" distance={10} />

        {/* Cool rim light along the silhouette edge, like the reference */}
        <pointLight position={[3.6, 0.2, -1.5]} intensity={14} color="#3a6bff" distance={9} />
        <directionalLight position={[0, 4, 4]} intensity={0.25} />

        {/* Studio HDRI gives the material real reflections to catch
            the lights above instead of looking flat matte black. */}
        <Environment preset="studio" />

        {/* x pushes it toward the right side of the frame, y pushes it
            down so only the face/upper neck stays on screen */}
        <Suspense fallback={null}>
          <Mannequin pointer={pointer} position={[1.5, -5.5, 0]} />
        </Suspense>

        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.45}
          blur={2.6}
          far={3}
        />
      </Canvas>

      {/* Overlay layer sits above the canvas. pointer-events-none on the
          wrapper so it never blocks clicks reaching the 3D model behind
          it — only the button itself opts back in to being clickable. */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="max-w-lg px-8 sm:px-12 md:px-20">
          <p className="text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-white/50 mb-5">
            Synaptica — Duality of Mind
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.15] tracking-tight mb-6">
            Where human intelligence meets its artificial counterpart
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-md">
            Design and develop an AI-powered chatbot built around the
            theme of duality — human and artificial intelligence working
            in genuine collaboration. It assists, educates, solves
            real-world problems, and enhances how people interact with
            intelligent systems.
          </p>
        </div>
      </div>

      {/* Centered primary CTA — the only button on this screen, per
          the one-primary-action-per-page rule */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-8">
        {/* Main Header above the button */}
        <div className="pointer-events-auto flex justify-center items-center w-full">
          <Signature
            text="Mindbot"
            fontSize={120}
            color="#ffffff"
            duration={2.5}
            fontUrl="/LastoriaBoldRegular.otf"
            className="drop-shadow-2xl opacity-90 mx-auto"
          />
        </div>
        <div className="pointer-events-auto">
          <LiquidMetalButton label="Start for Free" onClick={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
}