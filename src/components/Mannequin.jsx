import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const SHOW_HOOD_MESH = true;
const STATIC_ROTATION_Y = -0.5;
const DRIFT_SPEED = 0.18;
const DRIFT_AMOUNT = 0.035;
const CURSOR_MAX_Y = 0.12;
const CURSOR_MAX_X = 0.05;
const CURSOR_INFLUENCE_EASE = 0.06;
const BURST_DURATION = 0.9;
const BURST_SPIN = -0.5;
const BURST_SCALE = 0.05;
const BURST_GLOW = 2.2;

// Lerp helper
function lerp(a, b, t) { return a + (b - a) * t; }

export default function Mannequin({ pointer, isAnimating = false, onAnimationComplete, ...props }) {
    const outerGroup = useRef();
    const innerGroup = useRef();
    const burstProgress = useRef(1);
    const cursorInfluence = useRef(0);
    // Tracks the prop position for smooth lerping
    const currentPos = useRef({ x: props.position?.[0] ?? 2, y: props.position?.[1] ?? -5.65, z: 0 });
    const animProgress = useRef(0); // 0 = start of exit anim, 1 = done

    const { scene } = useGLTF('/model.glb');
    const materials = useRef([]);

    const { offset, scale } = useMemo(() => {
        materials.current = [];
        scene.traverse((obj) => {
            if (obj.isMesh) {
                if (obj.name === 'Hood' || obj.parent?.name === 'Hood') {
                    obj.visible = SHOW_HOOD_MESH;
                }
                const mat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#040a1c'),
                    metalness: 0.82,
                    roughness: 0.14,
                    envMapIntensity: 1.4,
                    emissive: new THREE.Color('#4da8ff'),
                    emissiveIntensity: 0,
                });
                obj.material = mat;
                obj.castShadow = true;
                obj.receiveShadow = true;
                materials.current.push(mat);
            }
        });

        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const s = 12 / maxDim;

        return { offset: center, scale: s };
    }, [scene]);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        burstProgress.current = 0;
    }, []);

    const handlePointerOver = useCallback(() => {
        document.body.style.cursor = 'none';
    }, []);
    const handlePointerOut = useCallback(() => {
        document.body.style.cursor = 'none';
    }, []);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        if (isAnimating) {
            // Smooth, cinematic exit zoom progress (~2.2s duration)
            animProgress.current = Math.min(animProgress.current + delta * 0.45, 1);
            const p = animProgress.current;

            // Ultra-smooth cubic ease-in-out curve for perfectly linear trajectory
            const ease = p < 0.5
                ? 4 * p * p * p
                : 1 - Math.pow(-2 * p + 2, 3) / 2;

            // Interactive subtle cursor sway fading out as model centers
            const userP = pointer?.current ?? { x: 0, y: 0 };
            const interactiveTiltX = -userP.y * 0.04 * (1 - ease);
            const interactiveTiltY = userP.x * 0.05 * (1 - ease);

            // Start position from props
            const startX = props.position?.[0] ?? 2;
            const startY = props.position?.[1] ?? -5.65;

            // Unified scale & position lerping — targeting exact chest/core at screen center (0, -0.05, 0.5)
            const targetScale = lerp(1, 4.8, ease);
            const targetX = lerp(startX, 0, ease);
            const targetY = lerp(startY, -5.3, ease);
            const targetZ = lerp(0, 0.5, ease);

            if (outerGroup.current) {
                outerGroup.current.position.set(targetX, targetY, targetZ);

                // Smoothly align rotation to face straight ahead
                const targetRotY = lerp(STATIC_ROTATION_Y, 0, ease) + interactiveTiltY;
                const targetRotX = interactiveTiltX;

                outerGroup.current.rotation.y = targetRotY;
                outerGroup.current.rotation.x = targetRotX;
                outerGroup.current.scale.setScalar(targetScale);
            }

            // Pulsing emissive hyper-glow during zoom
            if (materials.current.length) {
                const pulse = Math.sin(p * Math.PI * 2) * 0.5 + 0.5;
                const glow = (ease * 7.5) + (pulse * 1.2 * (1 - ease));
                materials.current.forEach((m) => { m.emissiveIntensity = glow; });
            }

            if (animProgress.current >= 1 && onAnimationComplete) {
                onAnimationComplete();
            }
            return;
        }

        // — Normal idle behaviour —
        animProgress.current = 0; // reset in case state flips back

        const driftY = Math.sin(t * DRIFT_SPEED) * DRIFT_AMOUNT;
        const driftX = Math.sin(t * DRIFT_SPEED * 0.7) * DRIFT_AMOUNT * 0.4;

        const p = pointer?.current ?? { x: 0, y: 0 };
        const targetInfluence = p.y < 0 ? 1 : 0;
        cursorInfluence.current +=
            (targetInfluence - cursorInfluence.current) * CURSOR_INFLUENCE_EASE;

        const cursorY = p.x * CURSOR_MAX_Y * cursorInfluence.current;
        const cursorX = -p.y * CURSOR_MAX_X * cursorInfluence.current;

        burstProgress.current = Math.min(burstProgress.current + delta / BURST_DURATION, 1);
        const envelope = (1 - Math.cos(Math.PI * 2 * burstProgress.current)) / 2;

        if (outerGroup.current) {
            outerGroup.current.rotation.y =
                STATIC_ROTATION_Y + driftY + cursorY + envelope * BURST_SPIN;
            outerGroup.current.rotation.x = driftX + cursorX;
            outerGroup.current.scale.setScalar(1 + envelope * BURST_SCALE);
            // Track current pos for when animation starts
            currentPos.current.x = props.position?.[0] ?? 2;
            currentPos.current.y = props.position?.[1] ?? -5.65;
        }

        if (materials.current.length) {
            const glow = envelope * BURST_GLOW;
            materials.current.forEach((m) => { m.emissiveIntensity = glow; });
        }
    });

    return (
        <group
            ref={outerGroup}
            rotation={[0, STATIC_ROTATION_Y, 0]}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            {...props}
        >
            <group
                ref={innerGroup}
                scale={scale}
                position={[-offset.x * scale, -offset.y * scale, -offset.z * scale]}
            >
                <primitive object={scene} />
            </group>
        </group>
    );
}

useGLTF.preload('/model.glb');