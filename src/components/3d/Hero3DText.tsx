import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import { Mesh } from 'three';

interface Hero3DTextProps {
  position?: [number, number, number];
  scale?: number;
}

export const Hero3DText = ({ position = [0, 0, 0], scale = 1 }: Hero3DTextProps) => {
  const groupRef = useRef<any>();
  const text1Ref = useRef<Mesh>(null);
  const text2Ref = useRef<Mesh>(null);
  const text3Ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Individual text animations
    if (text1Ref.current) {
      text1Ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
    }
    if (text2Ref.current) {
      text2Ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.02;
    }
    if (text3Ref.current) {
      text3Ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 + 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Center>
        <group>
          {/* "Discover Your" - Purple/Violet */}
          <Text3D
            ref={text1Ref}
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.8}
            height={0.15}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            position={[0, 1, 0]}
          >
            Discover Your
            <meshStandardMaterial
              color="#8B5CF6"
              metalness={0.3}
              roughness={0.2}
              emissive="#8B5CF6"
              emissiveIntensity={0.1}
            />
          </Text3D>

          {/* "Digital Footprint" - White */}
          <Text3D
            ref={text2Ref}
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.8}
            height={0.15}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            position={[0, 0, 0]}
          >
            Digital Footprint
            <meshStandardMaterial
              color="#FFFFFF"
              metalness={0.2}
              roughness={0.3}
              emissive="#FFFFFF"
              emissiveIntensity={0.05}
            />
          </Text3D>

          {/* "& Privacy Risk" - Green/Teal */}
          <Text3D
            ref={text3Ref}
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.8}
            height={0.15}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            position={[0, -1, 0]}
          >
            & Privacy Risk
            <meshStandardMaterial
              color="#10B981"
              metalness={0.3}
              roughness={0.2}
              emissive="#10B981"
              emissiveIntensity={0.1}
            />
          </Text3D>
        </group>
      </Center>

      {/* Ambient lighting for the text */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[-10, -10, 10]} intensity={0.3} color="#10B981" />
      <spotLight
        position={[0, 0, 10]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
        color="#FFFFFF"
      />
    </group>
  );
};