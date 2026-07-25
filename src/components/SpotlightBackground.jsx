import React, { useMemo } from 'react';

// Ambient hero background: a starfield + a converging fan of light rays
// (the "pyramid") + a bright vertical beam, centered over where the CTA
// button sits. Pure CSS/SVG — no canvas cost, sits behind the 3D model.

const STAR_COUNT = 90;

export default function SpotlightBackground() {
    // Generate once, not on every render — random star positions/sizes/timing
    const stars = useMemo(
        () =>
            Array.from({ length: STAR_COUNT }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() < 0.85 ? 1 : 2, // mostly tiny, a few bigger
                delay: Math.random() * 6,
                duration: 3 + Math.random() * 4,
                baseOpacity: 0.25 + Math.random() * 0.5,
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style>{`
        @keyframes spotlight-twinkle {
          0%, 100% { opacity: var(--star-base, 0.4); }
          50% { opacity: 0.05; }
        }
        @keyframes spotlight-shimmer {
          0% { opacity: 0.35; }
          50% { opacity: 0.55; }
          100% { opacity: 0.35; }
        }
        @media (prefers-reduced-motion: reduce) {
          .spotlight-star, .spotlight-rays { animation: none !important; }
        }
      `}</style>

            {/* Soft ambient vignette so the corners fall darker than the center */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 60% at 50% 15%, rgba(255,255,255,0.05), transparent 65%)',
                }}
            />

            {/* Starfield */}
            {stars.map((s) => (
                <div
                    key={s.id}
                    className="spotlight-star absolute rounded-full bg-white"
                    style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: s.size,
                        height: s.size,
                        '--star-base': s.baseOpacity,
                        opacity: s.baseOpacity,
                        animation: `spotlight-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                        boxShadow: s.size > 1 ? '0 0 4px rgba(255,255,255,0.8)' : 'none',
                    }}
                />
            ))}

            {/* Converging fan of rays — the "pyramid" shape, apex at the top,
          spreading down toward where the button sits */}
            <div
                className="spotlight-rays absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                    width: 640,
                    height: 560,
                    clipPath: 'polygon(50% 0%, 6% 100%, 94% 100%)',
                    background:
                        'repeating-conic-gradient(from 255deg at 50% 0%, rgba(255,255,255,0.16) 0deg 0.9deg, transparent 0.9deg 3.4deg)',
                    filter: 'blur(0.5px)',
                    animation: 'spotlight-shimmer 5s ease-in-out infinite',
                }}
            />

            {/* Bright vertical core beam at the center of the fan */}
            <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                    width: 120,
                    height: 420,
                    background:
                        'linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0) 80%)',
                    filter: 'blur(28px)',
                    opacity: 0.8,
                }}
            />

            {/* Tighter, brighter inner core for contrast */}
            <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                    width: 40,
                    height: 320,
                    background:
                        'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0) 75%)',
                    filter: 'blur(10px)',
                }}
            />
        </div>
    );
}