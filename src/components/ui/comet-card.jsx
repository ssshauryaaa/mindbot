import React, { useRef } from 'react';
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useMotionTemplate,
} from 'framer-motion';

/* Small inline class-joiner so this file has no dependency on a
   shadcn-style "@/lib/utils" alias — swap in your own `cn` if you
   already have one (e.g. `import { cn } from '../../lib/utils'`). */
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export const CometCard = ({
    rotateDepth = 12,
    translateDepth = 8,
    className,
    children,
}) => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

    const rotateX = useTransform(
        mouseYSpring,
        [-0.5, 0.5],
        [`-${rotateDepth}deg`, `${rotateDepth}deg`],
    );
    const rotateY = useTransform(
        mouseXSpring,
        [-0.5, 0.5],
        [`${rotateDepth}deg`, `-${rotateDepth}deg`],
    );

    const translateX = useTransform(
        mouseXSpring,
        [-0.5, 0.5],
        [`-${translateDepth}px`, `${translateDepth}px`],
    );
    const translateY = useTransform(
        mouseYSpring,
        [-0.5, 0.5],
        [`${translateDepth}px`, `-${translateDepth}px`],
    );

    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

    // Monochrome glare — pure white highlight, no tinted color.
    const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.35) 10%, rgba(255, 255, 255, 0.12) 30%, rgba(255, 255, 255, 0) 80%)`;

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            className={cn('[perspective:1200px] [transform-style:preserve-3d]', className)}
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    translateX,
                    translateY,
                }}
                initial={{ scale: 1, z: 0 }}
                whileHover={{
                    scale: 1.03,
                    z: 30,
                    transition: { duration: 0.2 },
                }}
                className="relative rounded-3xl"
            >
                {children}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-3xl mix-blend-overlay"
                    style={{ background: glareBackground }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </div>
    );
};