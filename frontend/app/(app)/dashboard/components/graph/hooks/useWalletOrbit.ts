// app/(app)/dashboard/components/graph/hooks/useWalletOrbit.ts
import { useRef, useEffect } from 'react';
import { GraphNode, WalletNode } from '../types/graphTypes';

interface WalletOrbitProps {
  fgRef: React.RefObject<any>;
  nodes: GraphNode[];
  selectedNode: GraphNode | null;
  shouldOrbit: boolean;
}

/**
 * Hook to handle wallet node orbit animation
 */
export function useWalletOrbit({ 
  fgRef, 
  nodes, 
  selectedNode, 
  shouldOrbit 
}: WalletOrbitProps) {
  const walletOrbitAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    // Find the wallet node
    const walletNode = nodes.find((node) =>
      node.id.startsWith("wallet-")
    ) as WalletNode | undefined;

    if (!walletNode || selectedNode || !shouldOrbit) {
      // Cancel animation if there's no wallet node or we're focused on something else
      if (walletOrbitAnimationRef.current) {
        cancelAnimationFrame(walletOrbitAnimationRef.current);
        walletOrbitAnimationRef.current = null;
      }
      return;
    }

    // Animate the wallet node orbiting
    const animateWalletOrbit = () => {
      if (fgRef.current && walletNode) {
        // Update the angle
        walletNode.angle += walletNode.orbitSpeed;

        // Calculate new position
        const newX = walletNode.orbitRadius * Math.cos(walletNode.angle);
        const newZ = walletNode.orbitRadius * Math.sin(walletNode.angle);

        // Update node position
        walletNode.x = newX;
        walletNode.z = newZ;

        // Request next frame
        walletOrbitAnimationRef.current =
          requestAnimationFrame(animateWalletOrbit);
      }
    };

    // Start animation
    walletOrbitAnimationRef.current =
      requestAnimationFrame(animateWalletOrbit);

    // Cleanup on unmount
    return () => {
      if (walletOrbitAnimationRef.current) {
        cancelAnimationFrame(walletOrbitAnimationRef.current);
        walletOrbitAnimationRef.current = null;
      }
    };
  }, [nodes, selectedNode, shouldOrbit, fgRef]);

  // Return cleanup function for component unmount
  const cleanup = () => {
    if (walletOrbitAnimationRef.current) {
      cancelAnimationFrame(walletOrbitAnimationRef.current);
      walletOrbitAnimationRef.current = null;
    }
  };

  return { cleanup };
}