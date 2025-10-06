'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { useModelLoader } from '../hooks/useModelLoader';
import { ProgressLoader } from '../ui/ProgressLoader';

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const { model, error } = useModelLoader(url);
  const meshRef = useRef<THREE.Group>(null);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  if (!model) return null;

  return (
    <group ref={meshRef}>
      <primitive object={model} scale={[2, 2, 2]} />
    </group>
  );
};

const Scene: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Environment for reflections */}
      <Environment preset="studio" />

      {/* Contact shadows for ground plane */}
      <ContactShadows 
        position={[0, -1.4, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={1.5} 
        far={4.5} 
      />

      {/* 3D Model */}
      <Suspense fallback={null}>
        <PresentationControls
          global
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Model url={modelUrl} />
        </PresentationControls>
      </Suspense>
    </>
  );
};

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelUrl, 
  className = "w-full h-screen" 
}) => {
  const { progress, isLoading } = useModelLoader(modelUrl);

  return (
    <div className={`relative ${className}`}>
      {/* Progress Loader */}
      <ProgressLoader progress={progress} isVisible={isLoading} />
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 50 }}
        className="bg-gradient-to-b from-gray-900 to-black"
      >
        <Scene modelUrl={modelUrl} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};
