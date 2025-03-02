// app/(app)/dashboard/components/graph/utils/createMaterials.ts
import * as THREE from "three";
import { SharedMaterials } from "../types/graphTypes";

/**
 * Creates shared materials for node highlighting
 * Avoids creating new materials for each node
 */
export function createSharedMaterials(): SharedMaterials {
  return {
    hoverRing: new THREE.MeshBasicMaterial({
      color: "red",
      side: THREE.DoubleSide,
    }),
    selectedRing: new THREE.MeshBasicMaterial({
      color: "orange",
      side: THREE.DoubleSide,
    }),
  };
}

import { GeometryCache } from "../types/graphTypes";

/**
 * Create a geometry cache to avoid recreating geometries
 */
export function createGeometryCache(): GeometryCache {
  const cache = new Map<string, THREE.BufferGeometry>();

  return {
    get: (key: string) => cache.get(key),
    set: (key: string, geometry: THREE.BufferGeometry) =>
      cache.set(key, geometry),
    has: (key: string) => cache.has(key),
    clear: () => cache.clear(),
    forEach: (
      callback: (value: THREE.BufferGeometry, key: string) => void
    ) => cache.forEach(callback),
  };
}

/**
 * Get or create a ring geometry (cached)
 */
export function getRingGeometry(
  cache: Map<string, THREE.BufferGeometry> | GeometryCache,
  innerRadius: number,
  outerRadius: number,
  segments: number = 32
) {
  const key = `ring-${innerRadius.toFixed(2)}-${outerRadius.toFixed(
    2
  )}-${segments}`;

  if (!cache.has(key)) {
    cache.set(
      key,
      new THREE.RingGeometry(innerRadius, outerRadius, segments)
    );
  }

  return cache.get(key)!;
}
