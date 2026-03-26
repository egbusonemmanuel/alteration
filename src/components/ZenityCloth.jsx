import React, { useRef, Suspense } from 'react';
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
      {/* Decimated polycount from 64x64 to 32x32 for ultra-legacy mobile GPU optimization like Galaxy S8 */}
      <Sphere ref={meshRef} args={[1.2, 32, 32]}>
        <MeshDistortMaterial
          color="#FF3CAC"
          attach="material"
          distort={0.6}
          speed={1.2}
          roughness={0.05}
          metalness={0.8}
          emissive="#C850C0"
          emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  );
};

const ZenityCloth = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-80 mix-blend-screen">
      {/* dpr limits pixel ratio preventing iPhones from rendering 3x resolution */}
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4] }} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} color="#C850C0" />
          <directionalLight position={[5, 10, 5]} intensity={1.8} color="#FF3CAC" />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#784BA0" />
          <Environment preset="studio" />
          <FloatingFabric />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ZenityCloth;
