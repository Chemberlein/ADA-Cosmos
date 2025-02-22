import * as THREE from 'three';

interface CreatePolarGridProps {
  orbitGap: number;
  offset: number;
  circles: number;
  radialLines?: number;
}

export function createPolarGrid({
  orbitGap,
  offset,
  circles,
  radialLines = 12,
}: CreatePolarGridProps) {
  const gridGroup = new THREE.Group();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xaaaaaa,
    opacity: 0.5,
    transparent: true,
    depthTest: false,
  });
  const segments = 64;
  for (let i = 0; i < circles; i++) {
    const circleRadius = (offset + i) * orbitGap;
    const circlePoints: THREE.Vector3[] = [];
    for (let j = 0; j <= segments; j++) {
      const theta = (j / segments) * 2 * Math.PI;
      circlePoints.push(
        new THREE.Vector3(
          circleRadius * Math.cos(theta),
          circleRadius * Math.sin(theta),
          0
        )
      );
    }
    const circleGeometry = new THREE.BufferGeometry().setFromPoints(
      circlePoints
    );
    const circle = new THREE.LineLoop(circleGeometry, lineMaterial);
    gridGroup.add(circle);
  }
  gridGroup.rotation.x = -Math.PI / 2;
  return gridGroup;
}
