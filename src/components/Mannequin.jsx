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
                const mat = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color('#040a1c'),
                    metalness: 0.72,
                    roughness: 0.08,
                    clearcoat: 1,
                    clearcoatRoughness: 0.05,
                    envMapIntensity: 1.6,
                    iridescence: 1,
                    iridescenceIOR: 1.9,
                    iridescenceThicknessRange: [200, 700],
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
            // Ease animProgress toward 1
            animProgress.current = Math.min(animProgress.current + delta * 0.85, 1);
            const ease = 1 - Math.pow(1 - animProgress.current, 3); // cubic ease-out

            // Target: center screen, model rises up to show torso
            const targetX = 0;
            const targetY = -3.2;

            currentPos.current.x = lerp(currentPos.current.x, targetX, 0.045);
            currentPos.current.y = lerp(currentPos.current.y, targetY, 0.045);

            if (outerGroup.current) {
                outerGroup.current.position.x = currentPos.current.x;
                outerGroup.current.position.y = currentPos.current.y;
                // Face forward smoothly
                outerGroup.current.rotation.y = lerp(outerGroup.current.rotation.y, 0, 0.06);
                outerGroup.current.rotation.x = lerp(outerGroup.current.rotation.x, 0, 0.06);
                // Scale up slightly
                const targetScale = 1 + ease * 0.22;
                outerGroup.current.scale.setScalar(lerp(outerGroup.current.scale.x, targetScale, 0.06));
            }

            // Emissive glow builds up as model centers
            if (materials.current.length) {
                const glow = ease * 3.5;
                materials.current.forEach((m) => { m.emissiveIntensity = glow; });
            }

            // Call completion callback when fully animated
            if (animProgress.current >= 1 && onAnimationComplete) {
                onAnimationComplete();
            }
            return; // skip normal idle when animating
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