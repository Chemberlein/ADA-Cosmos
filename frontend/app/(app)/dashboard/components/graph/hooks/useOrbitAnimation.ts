// app/(app)/dashboard/components/graph/hooks/useOrbitAnimation.ts
import { useRef, useEffect } from 'react';
import { GraphNode } from '../types/graphTypes';

interface OrbitAnimationProps {
  fgRef: React.RefObject<any>;
  selectedNode: GraphNode | null;
  shouldOrbit: boolean;
}

/**
 * Hook to handle camera orbit animation around a selected node
 */
export function useOrbitAnimation({ fgRef, selectedNode, shouldOrbit }: OrbitAnimationProps) {
  const orbitAnimationRef = useRef<number | null>(null);
  const orbitAngleRef = useRef(0);
  const orbitRadiusRef = useRef(0);

  useEffect(() => {
    if (!selectedNode || !shouldOrbit || !fgRef.current) {
      if (orbitAnimationRef.current) {
        cancelAnimationFrame(orbitAnimationRef.current);
        orbitAnimationRef.current = null;
      }
      return;
    }

    // Calculate initial orbit parameters
    const currentCamPos = fgRef.current.camera().position;
    const dx = currentCamPos.x - selectedNode.x;
    const dz = currentCamPos.z - selectedNode.z;

    orbitRadiusRef.current = Math.sqrt(dx * dx + dz * dz);
    orbitAngleRef.current = Math.atan2(dz, dx);

    // Lower transition duration for smoother animation
    const transitionDuration = 50;
    const orbitSpeed = 0.00002;

    let lastTime = 0;
    const frameInterval = 50; // ms between updates (lower = smoother but more CPU intensive)

    const animateOrbit = (timestamp: number) => {
      if (timestamp - lastTime > frameInterval) {
        lastTime = timestamp;

        orbitAngleRef.current += orbitSpeed * frameInterval;

        const newX =
          selectedNode.x +
          orbitRadiusRef.current * Math.cos(orbitAngleRef.current);
        const newZ =
          selectedNode.z +
          orbitRadiusRef.current * Math.sin(orbitAngleRef.current);

        // Maintain current Y level
        const newY = currentCamPos.y;

        fgRef.current.cameraPosition(
          { x: newX, y: newY, z: newZ },
          selectedNode,
          transitionDuration
        );
      }

      orbitAnimationRef.current = requestAnimationFrame(animateOrbit);
    };

    orbitAnimationRef.current = requestAnimationFrame(animateOrbit);

    return () => {
      if (orbitAnimationRef.current) {
        cancelAnimationFrame(orbitAnimationRef.current);
        orbitAnimationRef.current = null;
      }
    };
  }, [selectedNode, shouldOrbit, fgRef]);

  // Return cleanup function for component unmount
  const cleanup = () => {
    if (orbitAnimationRef.current) {
      cancelAnimationFrame(orbitAnimationRef.current);
      orbitAnimationRef.current = null;
    }
  };

  return { cleanup };
}