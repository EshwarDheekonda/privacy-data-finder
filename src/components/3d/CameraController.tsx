import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  phase: 'intro' | 'shield-reveal' | 'text-appear' | 'complete';
}

export const CameraController = ({ phase }: CameraControllerProps) => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Phase-based camera movements optimized for shield positioning
    switch (phase) {
      case 'intro':
        // Start from left side looking at right-positioned shield
        targetPosition.current.set(-1, 0, 8 - Math.min(time * 2, 3));
        targetLookAt.current.set(2, 0, 0);
        break;

      case 'shield-reveal':
        // Position camera to frame both shield and text area
        const radius = 6;
        targetPosition.current.set(
          0.5 + Math.sin(time * 0.2) * 0.3,
          Math.cos(time * 0.15) * 0.2,
          radius
        );
        targetLookAt.current.set(1.5, -0.2, 0);
        break;

      case 'text-appear':
        // Pull back and center for optimal text/shield viewing
        targetPosition.current.set(0.3, 0.3, 7);
        targetLookAt.current.set(1, -0.1, 0);
        break;

      case 'complete':
        // Balanced view of text and shield with subtle movement
        targetPosition.current.set(
          0.2 + Math.sin(time * 0.1) * 0.15,
          0.2 + Math.cos(time * 0.08) * 0.1,
          6.5
        );
        targetLookAt.current.set(1.2, -0.2, 0);
        break;
    }

    // Smooth camera interpolation
    camera.position.lerp(targetPosition.current, 0.05);
    camera.lookAt(targetLookAt.current.x, targetLookAt.current.y, targetLookAt.current.z);

    // Add subtle camera shake for immersion
    if (phase === 'shield-reveal' || phase === 'text-appear') {
      camera.position.x += (Math.random() - 0.5) * 0.001;
      camera.position.y += (Math.random() - 0.5) * 0.001;
    }
  });

  return null;
};