// app/(app)/dashboard/components/graph/utils/graphHelpers.ts
import {
  GraphNode,
  TokenDataNode,
  WalletNode,
  SunNode,
  MAX_NODE_SIZE,
  ORBIT_GAP,
  OFFSET,
  GeometryCache,
} from "../types/graphTypes";
import * as THREE from "three";
import { TokenData, SunMarketData } from "../../data/getTokensData";

/**
 * Constructs nodes for the graph from token data and market data
 */
export function constructNodes(
  tokens: TokenData[],
  sunMarketData: SunMarketData,
  walletAddress?: string,
  walletData?: any
): GraphNode[] {
  if (!tokens || tokens.length === 0) {
    return [];
  }

  const maxMcap = Math.max(...tokens.map((t) => t.mcap));

  const computedNodes: GraphNode[] = tokens.map((token, i) => {
    const orbitRadius = (OFFSET + i) * ORBIT_GAP;
    const angle = Math.random() * 2 * Math.PI;
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * Math.sin(angle);

    return {
      id: token.unit,
      ticker: token.ticker,
      mcap: token.mcap,
      val: (token.mcap / maxMcap) * MAX_NODE_SIZE,
      x,
      y: 0,
      z,
      fx: x,
      fy: 0,
      fz: z,
      orbitRadius,
      angle,
      socials: token.socials,
      holders: token.holders,
      ohlcv: token.ohlcv,
      tradingStats: token.tradingStats,
    } as TokenDataNode;
  });

  // Add sun node at the center
  if (sunMarketData) {
    computedNodes.push({
      id: "sun",
      marketData: sunMarketData,
      val: 28000,
      x: 0,
      y: 0,
      z: 0,
      fx: 0,
      fy: 0,
      fz: 0,
    } as SunNode);
  }

  // Add wallet node if wallet data is available
  if (walletAddress && walletData) {
    // Place wallet node at a specific orbit (between the first and second token)
    const walletOrbitRadius = 2;
    const walletAngle = Math.random() * 2 * Math.PI;
    const walletX = walletOrbitRadius * Math.cos(walletAngle);
    const walletZ = walletOrbitRadius * Math.sin(walletAngle);

    computedNodes.push({
      id: `wallet-${walletAddress}`,
      type: "wallet",
      address: walletAddress,
      walletData: walletData,
      val: 200, // Fixed size for wallet node
      x: walletX,
      y: 0,
      z: walletZ,
      fy: 0, // Fixed Y position
      orbitRadius: walletOrbitRadius,
      angle: walletAngle,
      orbitSpeed: 0.05, // Orbit speed
    } as WalletNode);
  }

  return computedNodes;
}

/**
 * Calculate camera position for node focus
 */
export function calculateCameraPosition(node: GraphNode) {
  const distance = 150;
  let targetX, targetY, targetZ;

  if (Math.hypot(node.x, node.y, node.z) === 0) {
    // Sun node - special camera position
    targetX = 200;
    targetY = 400;
    targetZ = 0;
  } else if (node.id.startsWith("wallet-")) {
    // Wallet node - get a close view of the spaceship
    const distRatio = 1 + 30 / Math.hypot(node.x, node.y, node.z);
    targetX = node.x * distRatio;
    targetY = node.y * distRatio + 10; // Lower camera height for wallet
    targetZ = node.z * distRatio;
  } else {
    // Regular token node
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    targetX = node.x * distRatio;
    targetY = node.y * distRatio + 100;
    targetZ = node.z * distRatio;
  }

  return { x: targetX, y: targetY, z: targetZ };
}

/**
 * Calculate node resolution based on performance state
 */
export function calculateNodeResolution(
  loadingStage: string,
  isAnimating: boolean
): number {
  if (loadingStage === "initial") return 8;
  if (loadingStage === "basic") return 12;
  if (isAnimating) return 12;
  return 16;
}

/**
 * Clean up resources for graph components
 */
export function cleanupResources(
    nodeLabelCache: Map<string, HTMLDivElement>,
    geometryCache: GeometryCache, // Changed from Map<string, THREE.BufferGeometry>
    spaceshipMesh: THREE.Object3D | null,
    simpleSpaceshipMesh: THREE.Object3D | null
  ) {
    // Clean up all cached DOM elements
    nodeLabelCache.clear();
  
    // Clean up all cached geometries
    geometryCache.forEach((geometry) => {
      geometry.dispose();
    });
    geometryCache.clear();
  
    // Dispose spaceship meshes
    if (spaceshipMesh) {
      // Dispose all materials and geometries
      spaceshipMesh.traverse((child) => {
        if ((child as any).geometry) (child as any).geometry.dispose();
        if ((child as any).material) {
          if (Array.isArray((child as any).material)) {
            (child as any).material.forEach((material: any) =>
              material.dispose()
            );
          } else {
            (child as any).material.dispose();
          }
        }
      });
    }
  
    if (simpleSpaceshipMesh) {
      simpleSpaceshipMesh.traverse((child) => {
        if ((child as any).geometry) (child as any).geometry.dispose();
        if ((child as any).material) {
          if (Array.isArray((child as any).material)) {
            (child as any).material.forEach((material: any) =>
              material.dispose()
            );
          } else {
            (child as any).material.dispose();
          }
        }
      });
    }
  }
