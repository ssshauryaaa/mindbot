import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Toggle off if the "Hood" mesh turns out to be an unwanted leftover
// piece from the source rig.
const SHOW_HOOD_MESH = true;

// Base pose, in radians. Flip the sign to face the other way.
const STATIC_ROTATION_Y = -0.5;

// Idle drift — small, slow sway so the pose doesn't look frozen
const DRIFT_SPEED = 0.18;      // sway cycle speed
const DRIFT_AMOUNT = 0.035;    // sway distance, in radians

// Cursor follow — only active in the TOP HALF of the screen, and kept
// small on purpose: too much rotation and the crop starts cutting the
// model off. Fades in/out smoothly at the midline instead of snapping.
const CURSOR_MAX_Y = 0.12;         // max left/right lean, in radians
const CURSOR_MAX_X = 0.05;         // max up/down tilt, in radians
const CURSOR_INFLUENCE_EASE = 0.06; // how fast the fade catches up

// Click burst — a single smooth swing out and back, synced with a glow
const BURST_DURATION = 0.9;    // seconds for the full rise-and-fall
const BURST_SPIN = -0.5;       // negative = swings left; flip the sign
// if this goes the wrong way for you
const BURST_SCALE = 0.05;      // how much it puffs up at the peak
const BURST_GLOW = 2.2;        // peak flash brightness

export default function Mannequin({ pointer, ...props }) {
    const outerGroup = useRef();
    const innerGroup = useRef();
    const burstProgress = useRef(1); // 0 = just clicked, 1 = settled
    const cursorInfluence = useRef(0); // 0 = no effect, 1 = full effect

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
        burstProgress.current = 0; // restart the swing from the beginning
    }, []);

    const handlePointerOver = useCallback(() => {
        document.body.style.cursor = 'pointer';
    }, []);
    const handlePointerOut = useCallback(() => {
        document.body.style.cursor = 'auto';
    }, []);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        const driftY = Math.sin(t * DRIFT_SPEED) * DRIFT_AMOUNT;
        const driftX = Math.sin(t * DRIFT_SPEED * 0.7) * DRIFT_AMOUNT * 0.4;

        // Only lean toward the cursor when it's in the top half of the
        // screen (y < 0 in this coordinate system). Ease the influence
        // toward its target each frame so crossing the midline fades
        // in/out smoothly instead of the model snapping on contact.
        const p = pointer?.current ?? { x: 0, y: 0 };
        const targetInfluence = p.y < 0 ? 1 : 0;
        cursorInfluence.current +=
            (targetInfluence - cursorInfluence.current) * CURSOR_INFLUENCE_EASE;

        const cursorY = p.x * CURSOR_MAX_Y * cursorInfluence.current;
        const cursorX = -p.y * CURSOR_MAX_X * cursorInfluence.current;

        // Ease-in/ease-out envelope: zero slope at both the start and the
        // end, so it ramps up and down gradually instead of jumping —
        // a plain sine curve rises too fast right after the click and
        // reads as a pop rather than a fade.
        burstProgress.current = Math.min(
            burstProgress.current + delta / BURST_DURATION,
            1
        );
        const envelope = (1 - Math.cos(Math.PI * 2 * burstProgress.current)) / 2;

        if (outerGroup.current) {
            outerGroup.current.rotation.y =
                STATIC_ROTATION_Y + driftY + cursorY + envelope * BURST_SPIN;
            outerGroup.current.rotation.x = driftX + cursorX;
            outerGroup.current.scale.setScalar(1 + envelope * BURST_SCALE);
        }

        if (materials.current.length) {
            const glow = envelope * BURST_GLOW;
            materials.current.forEach((m) => {
                m.emissiveIntensity = glow;
            });
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