// app/(app)/dashboard/components/graph/utils/createStarfield.ts
import * as THREE from "three";

/**
 * Creates a lightweight starfield background
 * Optimized for performance with shader materials
 */
export function createLightweightStarfield() {
  const starCount = 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    const radius = 20000;
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Custom shader material for better performance
  const material = new THREE.ShaderMaterial({
    uniforms: {
      pixelRatio: { value: window.devicePixelRatio },
    },
    vertexShader: `
    uniform float pixelRatio;
    
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = 1.5 * pixelRatio;
      gl_Position = projectionMatrix * mvPosition;
    }
    `,
    fragmentShader: `
    void main() {
      // Simple white dot with soft edge
      float distance = length(gl_PointCoord - vec2(0.5, 0.5));
      if (distance > 0.5) discard;
      
      float opacity = 1.0 - (distance * 2.0);
      gl_FragColor = vec4(1.0, 1.0, 1.0, opacity);
    }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(geometry, material);
  stars.frustumCulled = true;

  return stars;
}
