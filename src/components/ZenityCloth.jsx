import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sphere } from '@react-three/drei';

const FloatingFabric = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1.2, 128, 128]}>
        <MeshDistortMaterial
          color="#d4af37"
          attach="material"
          distort={0.6}
          speed={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
};

const ZenityCloth = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-80 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.3} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#d4af37" />
        <Environment preset="studio" />
        <FloatingFabric />
      </Canvas>
    </div>
  );
};

export default ZenityCloth;
