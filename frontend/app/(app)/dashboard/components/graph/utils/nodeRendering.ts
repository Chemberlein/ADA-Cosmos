// app/(app)/dashboard/components/graph/utils/nodeRendering.ts
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  GraphNode,
  LoadingStates,
  SharedMaterials,
} from "../types/graphTypes";
import { getRingGeometry } from "./createMaterials";

interface NodeRenderingProps {
  node: GraphNode;
  loadingStage: LoadingStates;
  hoverNode: GraphNode | null;
  selectedNode: GraphNode | null;
  sharedMaterials: SharedMaterials;
  geometryCache: Map<string, THREE.BufferGeometry> | any;
  nodeLabelCache: Map<string, HTMLDivElement>;
  spaceshipMesh: THREE.Object3D | null;
  simpleSpaceshipMesh: THREE.Object3D | null;
}

/**
 * Creates a THREE.Object3D for a wallet node
 */
export function createWalletNodeObject({
  node,
  loadingStage,
  spaceshipMesh,
  simpleSpaceshipMesh,
  nodeLabelCache,
}: Pick<
  NodeRenderingProps,
  | "node"
  | "loadingStage"
  | "spaceshipMesh"
  | "simpleSpaceshipMesh"
  | "nodeLabelCache"
>) {
  // Create a group to hold the spaceship and any labels
  const group = new THREE.Group();

  // Use the appropriate spaceship mesh based on loading stage
  const spaceship =
    loadingStage === LoadingStates.COMPLETE
      ? spaceshipMesh?.clone()
      : simpleSpaceshipMesh?.clone();

  if (spaceship) {
    // Scale the spaceship appropriately - INCREASE SIZE FOR BETTER VISIBILITY
    spaceship.scale.set(1.5, 1.5, 1.5); // Increased from 0.3 to 1.5

    // Rotate to face direction of travel
    spaceship.rotation.y = Math.PI / 2;

    // Dynamic rotation based on orbit angle if available
    if ("angle" in node) {
      // Add π/2 to make ship face tangent to orbit
      spaceship.rotation.y = node.angle + Math.PI / 2;
    }

    // Add thruster lights for completed loading state with INCREASED INTENSITY
    if (loadingStage === LoadingStates.COMPLETE) {
      const thrusterLight = new THREE.PointLight(0x3366ff, 3, 20); // Increased intensity and range
      thrusterLight.position.set(-1.5, 0, 0);
      spaceship.add(thrusterLight);

      // Add a glow material to make the spaceship more visible
      spaceship.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          // Make materials emissive to improve visibility
          if (mesh.material) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (material.color) {
              material.emissive = new THREE.Color(0x222266);
              material.emissiveIntensity = 0.5;
            }
          }
        }
      });
    }

    group.add(spaceship);
  } else {
    // Fallback if spaceship mesh is not available - add a visible placeholder
    const geometry = new THREE.SphereGeometry(5, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x3366ff });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);
  }

  // Add label if needed
  if (loadingStage === LoadingStates.COMPLETE) {
    let nodeEl = nodeLabelCache.get(node.id);

    if (!nodeEl) {
      nodeEl = document.createElement("div");
      nodeEl.className = "node-label wallet-label";
      nodeEl.textContent = "Wallet";
      nodeEl.style.color = "#ffffff";
      nodeEl.style.fontSize = "12px";
      nodeEl.style.fontWeight = "bold";
      nodeEl.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // More opaque background
      nodeEl.style.borderRadius = "6px";
      nodeEl.style.padding = "2px 6px"; // Increased padding

      // Store for reuse
      nodeLabelCache.set(node.id, nodeEl);
    }

    const labelObj = new CSS2DObject(nodeEl);
    labelObj.position.set(0, 6, 0); // Position label higher above the spaceship
    group.add(labelObj);
  }

  return group;
}

/**
 * Creates a THREE.Object3D for the sun node
 */
export function createSunNodeObject({
  node,
  loadingStage,
  nodeLabelCache,
}: Pick<NodeRenderingProps, "node" | "loadingStage" | "nodeLabelCache">) {
  // Special handling for sun
  const sunGeometry = new THREE.SphereGeometry(
    Math.cbrt(node.val),
    32,
    32
  );
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    emissive: 0xff8800,
    emissiveIntensity: 0.5,
  });
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

  // Add sun label
  if (loadingStage === LoadingStates.COMPLETE) {
    let nodeEl = nodeLabelCache.get(node.id);

    if (!nodeEl) {
      nodeEl = document.createElement("div");
      nodeEl.className = "node-label";
      nodeEl.textContent = "ADA";
      nodeEl.style.color = "#ffffff";
      nodeEl.style.fontSize = "12px";
      nodeEl.style.fontWeight = "bold";
      nodeEl.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
      nodeEl.style.borderRadius = "6px";
      nodeEl.style.padding = "1px 2px";

      // Store for reuse
      nodeLabelCache.set(node.id, nodeEl);
    }

    const labelObj = new CSS2DObject(nodeEl);
    const group = new THREE.Group();
    group.add(sunMesh);
    group.add(labelObj);

    return group;
  }

  return sunMesh;
}

/**
 * Creates a THREE.Object3D for a token node
 */
export function createTokenNodeObject({
  node,
  loadingStage,
  hoverNode,
  selectedNode,
  sharedMaterials,
  geometryCache,
  nodeLabelCache,
}: Pick<
  NodeRenderingProps,
  | "node"
  | "loadingStage"
  | "hoverNode"
  | "selectedNode"
  | "sharedMaterials"
  | "geometryCache"
  | "nodeLabelCache"
>) {
  const group = new THREE.Group();

  // Create a sphere for the token
  const tokenGeometry = new THREE.SphereGeometry(
    Math.cbrt(node.val),
    loadingStage === LoadingStates.COMPLETE ? 16 : 8,
    loadingStage === LoadingStates.COMPLETE ? 16 : 8
  );

  // Get color based on node id for consistency
  const color = new THREE.Color(0xffffff);
  color.setHSL((parseInt(node.id, 36) % 100) / 100, 0.7, 0.5);

  const tokenMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.7,
  });

  const tokenMesh = new THREE.Mesh(tokenGeometry, tokenMaterial);
  group.add(tokenMesh);

  // Add label for completed loading state
  if (loadingStage === LoadingStates.COMPLETE) {
    let nodeEl = nodeLabelCache.get(node.id);

    if (!nodeEl && "ticker" in node) {
      nodeEl = document.createElement("div");
      nodeEl.className = "node-label";
      nodeEl.textContent = node.ticker;
      nodeEl.style.color = "#ffffff";
      nodeEl.style.fontSize = "12px";
      nodeEl.style.fontWeight = "bold";
      nodeEl.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
      nodeEl.style.borderRadius = "6px";
      nodeEl.style.padding = "1px 2px";

      // Store for reuse
      nodeLabelCache.set(node.id, nodeEl);
    }

    if (nodeEl) {
      const labelObj = new CSS2DObject(nodeEl);
      group.add(labelObj);
    }
  }

  // Add highlight effect
  if (
    (node === hoverNode || node === selectedNode) &&
    loadingStage !== LoadingStates.INITIAL
  ) {
    const nodeRadius = Math.cbrt(node.val);
    const innerRadius = nodeRadius * 1.2;
    const ringThickness = 0.3;
    const outerRadius = innerRadius + ringThickness;

    // Use cached geometry with appropriate detail level
    const segments = loadingStage === LoadingStates.COMPLETE ? 32 : 16;

    const ringGeometry = getRingGeometry(
      geometryCache,
      innerRadius,
      outerRadius,
      segments
    );

    // Use shared materials
    const ringMaterial =
      node === hoverNode
        ? sharedMaterials.hoverRing
        : sharedMaterials.selectedRing;

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  return group;
}

/**
 * Creates a THREE.Object3D for any graph node
 * Handles different node types appropriately
 */
export function createNodeObject({
  node,
  loadingStage,
  hoverNode,
  selectedNode,
  sharedMaterials,
  geometryCache,
  nodeLabelCache,
  spaceshipMesh,
  simpleSpaceshipMesh,
}: NodeRenderingProps): THREE.Object3D {
  // For initial loading, just return minimal elements
  if (loadingStage === LoadingStates.INITIAL && node.id !== "sun") {
    return new THREE.Group();
  }

  // Handle different node types
  if (node.id.startsWith("wallet-")) {
    return createWalletNodeObject({
      node,
      loadingStage,
      spaceshipMesh,
      simpleSpaceshipMesh,
      nodeLabelCache,
    });
  } else if (node.id === "sun") {
    return createSunNodeObject({
      node,
      loadingStage,
      nodeLabelCache,
    });
  } else {
    return createTokenNodeObject({
      node,
      loadingStage,
      hoverNode,
      selectedNode,
      sharedMaterials,
      geometryCache,
      nodeLabelCache,
    });
  }
}
