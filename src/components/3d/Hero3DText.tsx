import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Environment } from '@react-three/drei';
import { Mesh, Group } from 'three';

interface Hero3DTextProps {
  position?: [number, number, number];
  scale?: number;
}

// Glass Letter Component
interface GlassLetterProps {
  char: string;
  position: [number, number, number];
  index: number;
  color: string;
}

const GlassLetter = ({ char, position, index, color }: GlassLetterProps) => {
  const letterRef = useRef<Group>(null);

  useFrame((state) => {
    if (!letterRef.current) return;

    const time = state.clock.elapsedTime;
    const offset = index * 0.1;

    // Individual floating animation for each letter
    letterRef.current.position.y = position[1] + Math.sin(time * 0.8 + offset) * 0.3;
    letterRef.current.position.x = position[0] + Math.sin(time * 0.6 + offset) * 0.1;
    letterRef.current.position.z = position[2] + Math.sin(time * 0.4 + offset) * 0.2;

    // Individual rotation for each letter
    letterRef.current.rotation.x = Math.sin(time * 0.5 + offset) * 0.1;
    letterRef.current.rotation.y = Math.sin(time * 0.3 + offset) * 0.15;
    letterRef.current.rotation.z = Math.sin(time * 0.7 + offset) * 0.08;
  });

  if (char === ' ') return null; // Skip spaces

  return (
    <group ref={letterRef}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={1.2}
        height={0.3}
        curveSegments={16}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.03}
        bevelOffset={0}
        bevelSegments={8}
      >
        {char}
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.85}
          transmission={0.9}
          thickness={0.5}
          ior={1.4}
          roughness={0.05}
          metalness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
          reflectivity={0.8}
        />
      </Text3D>
      
      {/* Subtle glow behind each letter */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[0.8, 1.0, 0.1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={2}
        />
      </mesh>
    </group>
  );
};

export const Hero3DText = ({ position = [0, 0, 0], scale = 1.5 }: Hero3DTextProps) => {
  const groupRef = useRef<Group>(null);

  // Split text into words and characters with positions
  const textData = useMemo(() => {
    const lines = [
      { text: "Discover Your", color: "#8B5CF6", y: 2 },
      { text: "Digital Footprint", color: "#FFFFFF", y: 0 },
      { text: "& Privacy Risk", color: "#10B981", y: -2 }
    ];

    const letters: Array<{ char: string; position: [number, number, number]; index: number; color: string }> = [];
    let globalIndex = 0;

    lines.forEach((line) => {
      const words = line.text.split(' ');
      let lineX = -(line.text.length * 0.6) / 2; // Center the line

      words.forEach((word, wordIndex) => {
        if (wordIndex > 0) {
          // Add space between words
          lineX += 0.8;
        }

        [...word].forEach((char) => {
          letters.push({
            char,
            position: [lineX, line.y, 0],
            index: globalIndex,
            color: line.color
          });
          lineX += 0.8; // Letter spacing
          globalIndex++;
        });
      });
    });

    return letters;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Gentle group movement
    groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.03;
    groupRef.current.position.y = position[1] + Math.sin(time * 0.3) * 0.1;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Center>
        <group>
          {textData.map((letter, index) => (
            <GlassLetter
              key={`${letter.char}-${index}`}
              char={letter.char}
              position={letter.position}
              index={letter.index}
              color={letter.color}
            />
          ))}
        </group>
      </Center>

      {/* Enhanced lighting for glass effect */}
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.0}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#8B5CF6" />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#10B981" />
      <pointLight position={[0, -5, 5]} intensity={0.6} color="#60A5FA" />
      
      {/* Rim lighting */}
      <spotLight
        position={[0, 0, -10]}
        angle={0.4}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
      />
    </group>
  );
};