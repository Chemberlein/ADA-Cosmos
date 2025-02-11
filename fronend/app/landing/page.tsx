'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, useTexture } from '@react-three/drei';
import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'] });

function SpinningLogo() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-0.5, -0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
    </group>
  );
}

function AnimatedBox({
  initialPosition,
}: {
  initialPosition: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(...initialPosition)
  );
  const currentPosition = useRef(new THREE.Vector3(...initialPosition));

  // Load the original logo texture (ensure '/cardano-ada-logo.png' exists in your public folder)
  const originalLogoTexture = useTexture('/ada-logo.png');
  originalLogoTexture.anisotropy = 16;

  // Create a new texture that draws a white background then your logo on top.
  // This makes the non-logo parts white instead of transparent.
  const logoCanvasTexture = useMemo(() => {
    // Wait until the image is loaded.
    if (!originalLogoTexture.image) return originalLogoTexture;
    const { width, height } = originalLogoTexture.image;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fill the canvas with white.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      // Draw the original logo image on top.
      ctx.drawImage(originalLogoTexture.image, 0, 0, width, height);
    }
    const newTexture = new THREE.CanvasTexture(canvas);
    newTexture.anisotropy = 16;
    return newTexture;
  }, [originalLogoTexture]);

  // Create an array of six materials using the new texture.
  // Notice we no longer set "transparent: true" so that the material is fully opaque.
  const materials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({
        map: logoCanvasTexture,
        color: '#ffffff',
      }),
      new THREE.MeshBasicMaterial({
        map: logoCanvasTexture,
        color: '#ffffff',
      }),
      new THREE.MeshBasicMaterial({
        map: logoCanvasTexture,
        color: '#ffffff',
      }),
      new THREE.MeshBasicMaterial({
        map: logoCanvasTexture,
        color: '#ffffff',
      }),
      new THREE.MeshBasicMaterial({
        map: logoCanvasTexture,
        color: '#ffffff',
      }),
      new THREE.MeshBasicMaterial({
        map: logoCanvasTexture,
        color: '#ffffff',
      }),
    ],
    [logoCanvasTexture]
  );

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current);
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x));
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z));
      setTargetPosition(newPosition);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1);
      meshRef.current.position.copy(currentPosition.current);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition} material={materials}>
      <boxGeometry args={[1, 1, 1]} />
      {/* Optional: keep the outline for a crisp edge */}
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(1, 1, 1)]}
        />
        <lineBasicMaterial attach="material" color="#ffffff" linewidth={2} />
      </lineSegments>
    </mesh>
  );
}

function Scene() {
  const initialPositions: [number, number, number][] = [
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
    [10, 0.5, 10],
    [12, 0.5, 12],
  ];

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  );
}

export default function LandingPage() {
  return (
    <div
      className={`relative w-full h-screen bg-black text-white overflow-hidden ${manrope.className}`}
    >
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-20 h-20">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SpinningLogo />
              </Canvas>
            </div>
            <span className="text-2xl font-bold">ADA Ecosystem Mapper</span>
          </div>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        {/* New wrapper div with a semitransparent background */}
        <div className="bg-black/75 p-6 rounded-md">
          <h1 className="text-6xl font-bold mb-8 max-w-4xl mx-auto">
            Uncover Hidden Structures in{' '}
            <span className="text-[#0033AD]">Cardano</span>
          </h1>

          <h2 className="text-xl mb-10">
            Reveal dynamic interconnections with real-time blockchain data and topological analysis.
          </h2>
          <button className="bg-white text-black font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition duration-300">
            Join waitlist
          </button>
        </div>
      </div>
      <Canvas
        shadows
        camera={{ position: [30, 30, 30], fov: 50 }}
        className="absolute inset-0"
      >
        <Scene />
      </Canvas>
    </div>
  );
}
