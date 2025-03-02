// app/(app)/dashboard/components/render/createSpaceship.ts
import * as THREE from "three";

export function createSpaceshipMesh(): THREE.Object3D {
  // Create a spaceship group
  const shipGroup = new THREE.Group();

  // Ship body - rectangular prism
  const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x222222,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  shipGroup.add(body);

  // Ship cockpit - half sphere
  const cockpitGeometry = new THREE.SphereGeometry(
    0.8,
    8,
    8,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  const cockpitMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.7,
    metalness: 0.2,
    roughness: 0.3,
  });
  const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
  cockpit.position.set(0.5, 0.5, 0);
  cockpit.rotation.x = Math.PI;
  shipGroup.add(cockpit);

  // Ship wings
  const wingGeometry = new THREE.BoxGeometry(1.5, 0.1, 4);
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0xcc5500,
    metalness: 0.5,
    roughness: 0.5,
  });
  const wings = new THREE.Mesh(wingGeometry, wingMaterial);
  wings.position.set(-1, -0.2, 0);
  shipGroup.add(wings);

  // Ship engine glow
  const engineGeometry = new THREE.CylinderGeometry(0.4, 0.6, 0.6, 8);
  const engineMaterial = new THREE.MeshStandardMaterial({
    color: 0x66aaff,
    emissive: 0x3366ff,
    emissiveIntensity: 2,
    transparent: true,
    opacity: 0.8,
  });
  const engine = new THREE.Mesh(engineGeometry, engineMaterial);
  engine.position.set(-2.2, 0, 0);
  engine.rotation.z = Math.PI / 2;
  shipGroup.add(engine);

  // Return the ship group as an Object3D (correct type)
  return shipGroup;
}

export function createSimpleSpaceshipMesh(): THREE.Object3D {
  // Create a simple spaceship shape for better performance
  const shipGroup = new THREE.Group();

  // Ship body - simple rectangular prism
  const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    emissive: 0x222222,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  shipGroup.add(body);

  // Ship wings
  const wingGeometry = new THREE.BoxGeometry(1.5, 0.1, 4);
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0xcc5500,
  });
  const wings = new THREE.Mesh(wingGeometry, wingMaterial);
  wings.position.set(-1, -0.2, 0);
  shipGroup.add(wings);

  // Return the ship group as an Object3D (correct type)
  return shipGroup;
}
