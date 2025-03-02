"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { SunMarketData, TokenData } from "./data/getTokensData";
import { createPolarGrid } from "./render/createPolarGrid";
import { renderNodeLabel } from "./render/renderNodeLabel";
import { useSelectedToken } from "@/contexts/SelectedTokenContext";
import _ from "lodash";
import { useBloomPass } from "./render/useBloomPass";
import {
  createSimpleSpaceshipMesh,
  createSpaceshipMesh,
} from "./render/createSpaceship";

const MAX_NODE_SIZE = 1000;
const orbitGap = 30;
const offset = 3;

export interface TokenDataNode extends TokenData {
  id: string;
  val: number;
  x: number;
  y: number;
  z: number;
  fx: number;
  fy: number;
  fz: number;
  orbitRadius: number;
  angle: number;
}

interface SunNode {
  id: "sun";
  marketData: SunMarketData;
  val: number;
  x: number;
  y: number;
  z: number;
  fx: number;
  fy: number;
  fz: number;
}

// Modified WalletNode interface
interface WalletNode {
  id: string;
  type: "wallet";
  address: string;
  walletData: any;
  val: number;
  x: number;
  y: number;
  z: number;
  fx?: number;
  fy?: number;
  fz?: number;
  orbitRadius: number;
  angle: number;
  orbitSpeed: number;
}

type GraphNode = TokenDataNode | SunNode | WalletNode;

interface CardanoTokensGraphClientProps {
  tokens: TokenData[];
  sunMarketData: SunMarketData;
}

// Loading states enum
const LoadingStates = {
  INITIAL: "initial",
  BASIC: "basic",
  COMPLETE: "complete",
};

// Optimize dimension hook with throttled updates
function useDimensions(ref: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const updateDimensions = useCallback(
    _.throttle(() => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    }, 100),
    [ref]
  );

  useEffect(() => {
    if (!ref.current) return;
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(ref.current);
    window.addEventListener("resize", updateDimensions);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [ref, updateDimensions]);

  return dimensions;
}

// Create shared materials - avoids creating new materials for each node
const createSharedMaterials = () => {
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
};

function createLightweightStarfield() {
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

const TokensGraphClient: React.FC<CardanoTokensGraphClientProps> = memo(
  ({ tokens, sunMarketData }) => {
    const fgRef = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useDimensions(containerRef);
    const [loadingStage, setLoadingStage] = useState(
      LoadingStates.INITIAL
    );

    // Cache for node elements to avoid recreating DOM
    const nodeLabelCache = useRef<Map<string, HTMLDivElement>>(new Map());

    // Shared materials
    const sharedMaterials = useMemo(() => createSharedMaterials(), []);

    // Cache for geometries
    const geometryCache = useRef<Map<string, THREE.BufferGeometry>>(
      new Map()
    );

    // Cache for spaceships
    const spaceshipMeshRef = useRef<THREE.Object3D | null>(null);
    const simpleSpaceshipMeshRef = useRef<THREE.Object3D | null>(null);

    // Selected token context for our sidebar
    const { selectedToken, setSelectedToken, walletAddress, walletData } =
      useSelectedToken();

    // For hover/selection state
    const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(
      null
    );

    // Flag to trigger orbiting after camera transition
    const [shouldOrbit, setShouldOrbit] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Refs to manage orbiting animation and delay timeout
    const orbitAnimationRef = useRef<number | null>(null);
    const orbitTimeoutRef = useRef<number | null>(null);
    const orbitAngleRef = useRef(0);
    const orbitRadiusRef = useRef(0);

    // Reference to track animation frame for wallet node orbiting
    const walletOrbitAnimationRef = useRef<number | null>(null);

    // Create CSS2DRenderer instance for labels
    const labelRenderer = useMemo(() => new CSS2DRenderer(), []);

    // Progressive loading
    useEffect(() => {
      setLoadingStage(LoadingStates.INITIAL);

      // Show basic structure quickly
      const basicTimer = setTimeout(() => {
        setLoadingStage(LoadingStates.BASIC);
      }, 50);

      // Add details after initial render
      const completeTimer = setTimeout(() => {
        setLoadingStage(LoadingStates.COMPLETE);
      }, 500);

      return () => {
        clearTimeout(basicTimer);
        clearTimeout(completeTimer);
      };
    }, []);

    // Memoize nodes with less frequent updates
    const nodes: GraphNode[] = useMemo(() => {
      if (!tokens || tokens.length === 0) {
        return [];
      }

      const maxMcap = Math.max(...tokens.map((t) => t.mcap));

      const computedNodes: GraphNode[] = tokens.map((token, i) => {
        const orbitRadius = (offset + i) * orbitGap;
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
          // fx: null, // Remove this line or change to undefined
          fy: 0, // Fixed Y position
          // fz: null, // Remove this line or change to undefined
          orbitRadius: walletOrbitRadius,
          angle: walletAngle,
          orbitSpeed: 0.05, // Orbit speed
        } as WalletNode);
      }

      return computedNodes;
    }, [tokens, sunMarketData, walletAddress, walletData]);

    const links = useMemo(() => [], []);

    // Set initial camera position on mount
    useEffect(() => {
      if (fgRef.current && tokens && tokens.length > 0) {
        fgRef.current.cameraPosition(
          { x: -1300, y: 1300, z: 500 },
          { x: 0, y: 0, z: 0 },
          0
        );
      }
    }, [tokens]);

    // Add polar grid to the scene - optimized with delays
    useEffect(() => {
      if (
        tokens &&
        tokens.length > 0 &&
        loadingStage === LoadingStates.BASIC
      ) {
        const timer = setTimeout(() => {
          if (fgRef.current && typeof fgRef.current.scene === "function") {
            const scene = fgRef.current.scene();
            if (scene && !scene.getObjectByName("polar-grid")) {
              const polarGrid = createPolarGrid({
                orbitGap,
                offset,
                circles: tokens.length,
                radialLines:
                  loadingStage === LoadingStates.COMPLETE ? 16 : 8, // Lower detail initially
              });
              polarGrid.name = "polar-grid";

              // Enable frustum culling
              polarGrid.traverse((object) => {
                if (object.isObject3D) {
                  object.frustumCulled = true;
                }
              });

              scene.add(polarGrid);
            }
          }
        }, 150); // Slight delay to prioritize node rendering

        return () => clearTimeout(timer);
      }
    }, [tokens, loadingStage]);

    // Setup bloom pass
    useBloomPass(fgRef);

    // Initialize spaceship meshes when needed
    useEffect(() => {
      if (
        !spaceshipMeshRef.current &&
        loadingStage === LoadingStates.COMPLETE
      ) {
        spaceshipMeshRef.current = createSpaceshipMesh();
      }

      if (
        !simpleSpaceshipMeshRef.current &&
        loadingStage === LoadingStates.BASIC
      ) {
        simpleSpaceshipMeshRef.current = createSimpleSpaceshipMesh();
      }
    }, [loadingStage]);

    // Handle wallet node animation
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
    }, [nodes, selectedNode, shouldOrbit]);

    // Focus on wallet node when it's first added
    useEffect(() => {
      const walletNode = nodes.find((node) =>
        node.id.startsWith("wallet-")
      );

      if (walletNode && walletAddress && walletData) {
        // Small delay to ensure the node is properly positioned
        setTimeout(() => {
          handleNodeClick(walletNode);
        }, 200);
      }
    }, [walletAddress, walletData]);

    // Throttled node hover handler
    const handleNodeHover = useCallback(
      _.throttle((node: GraphNode | null) => {
        setHoverNode(node);
      }, 50),
      []
    );

    const handleNodeClick = useCallback(
      (node: GraphNode) => {
        // Cancel any pending orbit actions
        setShouldOrbit(false);
        setIsAnimating(true);

        if (orbitTimeoutRef.current) {
          clearTimeout(orbitTimeoutRef.current);
          orbitTimeoutRef.current = null;
        }

        if (orbitAnimationRef.current) {
          cancelAnimationFrame(orbitAnimationRef.current);
          orbitAnimationRef.current = null;
        }

        setSelectedNode(node);

        // Handle node type-specific actions
        if ("socials" in node) {
          // It's a token node
          setSelectedToken(node);
        } else if (node.id.startsWith("wallet-")) {
          // It's a wallet node
          setSelectedToken(null);
        } else {
          // Sun or other node
          setSelectedToken(null);
        }

        // Camera transition logic
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
          const distRatio =
            1 + distance / Math.hypot(node.x, node.y, node.z);
          targetX = node.x * distRatio;
          targetY = node.y * distRatio + 100;
          targetZ = node.z * distRatio;
        }

        // Camera transition
        fgRef.current.cameraPosition(
          { x: targetX, y: targetY, z: targetZ },
          node,
          3000
        );

        // After camera transition completes
        orbitTimeoutRef.current = window.setTimeout(() => {
          setShouldOrbit(true);
          setIsAnimating(false);
        }, 3000);
      },
      [setSelectedToken]
    );

    // Stop orbiting if the user interacts with the graph
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleUserInput = () => {
        setShouldOrbit(false);

        if (orbitTimeoutRef.current) {
          clearTimeout(orbitTimeoutRef.current);
          orbitTimeoutRef.current = null;
        }

        if (orbitAnimationRef.current) {
          cancelAnimationFrame(orbitAnimationRef.current);
          orbitAnimationRef.current = null;
        }
      };

      container.addEventListener("mousedown", handleUserInput);
      container.addEventListener("touchstart", handleUserInput);
      container.addEventListener("wheel", handleUserInput);

      return () => {
        container.removeEventListener("mousedown", handleUserInput);
        container.removeEventListener("touchstart", handleUserInput);
        container.removeEventListener("wheel", handleUserInput);
      };
    }, []);

    // Optimized orbit animation effect
    useEffect(() => {
      if (!selectedNode || !shouldOrbit) {
        if (orbitAnimationRef.current) {
          cancelAnimationFrame(orbitAnimationRef.current);
          orbitAnimationRef.current = null;
        }
        return;
      }

      // More efficient camera orbiting with less frequent updates
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
    }, [selectedNode, shouldOrbit]);

    // Get or create a ring geometry (cached)
    const getRingGeometry = useCallback(
      (
        innerRadius: number,
        outerRadius: number,
        segments: number = 32
      ) => {
        const key = `ring-${innerRadius.toFixed(2)}-${outerRadius.toFixed(
          2
        )}-${segments}`;

        if (!geometryCache.current.has(key)) {
          geometryCache.current.set(
            key,
            new THREE.RingGeometry(innerRadius, outerRadius, segments)
          );
        }

        return geometryCache.current.get(key)!;
      },
      []
    );

    useEffect(() => {
      if (
        fgRef.current &&
        typeof fgRef.current.scene === "function" &&
        loadingStage === LoadingStates.COMPLETE // Only add stars after initial loading
      ) {
        const scene = fgRef.current.scene();
        if (scene && !scene.getObjectByName("starfield")) {
          const starfield = createLightweightStarfield();
          starfield.name = "starfield";
          starfield.renderOrder = -100; // Render behind everything else

          // Frustum culling optimization
          starfield.frustumCulled = true;

          scene.add(starfield);
        }
      }
    }, [fgRef.current, loadingStage]);

    // Optimized node object creation function
    const createNodeObject = useCallback(
      (node: GraphNode) => {
        // For initial loading, just return minimal elements
        if (loadingStage === LoadingStates.INITIAL && node.id !== "sun") {
          return new THREE.Group();
        }

        const group = new THREE.Group();

        // Handle wallet node specifically - render a spaceship
        if (node.id.startsWith("wallet-")) {
          // Use the appropriate spaceship mesh based on loading stage
          const spaceship =
            loadingStage === LoadingStates.COMPLETE
              ? spaceshipMeshRef.current
              : simpleSpaceshipMeshRef.current;

          if (spaceship) {
            // Clone the mesh to avoid shared material modifications
            const shipInstance = spaceship.clone();

            // Scale the spaceship appropriately
            shipInstance.scale.set(0.3, 0.3, 0.3);

            // Add thruster lights for completed loading state
            if (loadingStage === LoadingStates.COMPLETE) {
              const thrusterLight = new THREE.PointLight(0x3366ff, 1, 10);
              thrusterLight.position.set(-1.5, 0, 0);
              shipInstance.add(thrusterLight);
            }

            // Rotate to face direction of travel
            shipInstance.rotation.y = Math.PI / 2;

            // Dynamic rotation based on orbit angle
            if ("angle" in node) {
              // Add π/2 to make ship face tangent to orbit
              shipInstance.rotation.y = node.angle + Math.PI / 2;
            }

            group.add(shipInstance);
          }

          // Add a label for the wallet
          if (loadingStage === LoadingStates.COMPLETE) {
            let nodeEl = nodeLabelCache.current.get(node.id);

            if (!nodeEl) {
              nodeEl = document.createElement("div");
              nodeEl.className = "node-label wallet-label";
              nodeEl.textContent = "Wallet";
              nodeEl.style.color = "#ffffff";
              nodeEl.style.fontSize = "12px";
              nodeEl.style.fontWeight = "bold";
              nodeEl.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
              nodeEl.style.borderRadius = "6px";
              nodeEl.style.padding = "1px 4px";

              // Store for reuse
              nodeLabelCache.current.set(node.id, nodeEl);
            }

            const labelObj = new CSS2DObject(nodeEl);
            labelObj.position.set(0, 2, 0);
            group.add(labelObj);
          }

          return group;
        }

        // Regular token nodes - original handling
        // Only add labels in complete stage or for important nodes
        if (loadingStage === LoadingStates.COMPLETE || node.id === "sun") {
          // Get or create the label element
          let nodeEl = nodeLabelCache.current.get(node.id);

          if (!nodeEl) {
            nodeEl = document.createElement("div");
            nodeEl.className = "node-label";
            nodeEl.textContent = "ticker" in node ? node.ticker : "ADA";
            nodeEl.style.color = "#ffffff";
            nodeEl.style.fontSize = "12px";
            nodeEl.style.fontWeight = "bold";
            nodeEl.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
            nodeEl.style.borderRadius = "6px";
            nodeEl.style.padding = "1px 2px";

            // Store for reuse
            nodeLabelCache.current.set(node.id, nodeEl);
          }

          const labelObj = new CSS2DObject(nodeEl);
          group.add(labelObj);
        }

        // Add highlight effect
        if (
          (node === hoverNode || node === selectedNode) &&
          loadingStage !== LoadingStates.INITIAL
        ) {
          const ringColor = node === hoverNode ? "red" : "orange";
          const nodeRadius = Math.cbrt(node.val);
          const innerRadius = nodeRadius * 6;
          const ringThickness = 1;
          const outerRadius = innerRadius + ringThickness;

          // Use cached geometry with appropriate detail level
          const segments =
            loadingStage === LoadingStates.COMPLETE ? 32 : 16;
          const ringGeometry = getRingGeometry(
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
      },
      [
        loadingStage,
        hoverNode,
        selectedNode,
        sharedMaterials,
        getRingGeometry,
      ]
    );

    // Clean up resources on unmount
    useEffect(() => {
      return () => {
        // Clean up all cached DOM elements
        nodeLabelCache.current.clear();

        // Clean up all cached geometries
        geometryCache.current.forEach((geometry) => {
          geometry.dispose();
        });
        geometryCache.current.clear();

        // Dispose spaceship meshes
        if (spaceshipMeshRef.current) {
          // Dispose all materials and geometries
          spaceshipMeshRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((material) => material.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
          spaceshipMeshRef.current = null;
        }

        if (simpleSpaceshipMeshRef.current) {
          simpleSpaceshipMeshRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((material) => material.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
          simpleSpaceshipMeshRef.current = null;
        }

        // Cancel any pending animations
        if (orbitAnimationRef.current) {
          cancelAnimationFrame(orbitAnimationRef.current);
          orbitAnimationRef.current = null;
        }

        if (walletOrbitAnimationRef.current) {
          cancelAnimationFrame(walletOrbitAnimationRef.current);
          walletOrbitAnimationRef.current = null;
        }

        // Clear timeouts
        if (orbitTimeoutRef.current) {
          clearTimeout(orbitTimeoutRef.current);
          orbitTimeoutRef.current = null;
        }
      };
    }, []);

    // Memoize graph data to prevent unnecessary updates
    const graphData = useMemo(() => ({ nodes, links }), [nodes, links]);

    // Node resolution based on performance state
    const nodeResolution = useMemo(() => {
      if (loadingStage === LoadingStates.INITIAL) return 8;
      if (loadingStage === LoadingStates.BASIC) return 12;
      if (isAnimating) return 12;
      return 16;
    }, [loadingStage, isAnimating]);

    // Customize node particle rendering based on node type
    // Modify your nodeThreeObject function to ensure the spaceships are correctly rendered

    // Fix for the nodeThreeObject function to ensure it always returns a THREE.Object3D
    const nodeThreeObject = useCallback(
      (node: GraphNode) => {
        // Check if it's a wallet node
        if (node.id.startsWith("wallet-")) {
          // Create a group to hold the spaceship and any labels
          const group = new THREE.Group();

          // Get spaceship based on loading stage
          const spaceship =
            loadingStage === LoadingStates.COMPLETE
              ? spaceshipMeshRef.current?.clone()
              : simpleSpaceshipMeshRef.current?.clone();

          if (spaceship) {
            // Scale the spaceship appropriately
            spaceship.scale.set(0.3, 0.3, 0.3);

            // Rotate to face direction of travel
            spaceship.rotation.y = Math.PI / 2;

            // Dynamic rotation based on orbit angle if available
            if ("angle" in node) {
              // Add π/2 to make ship face tangent to orbit
              spaceship.rotation.y = node.angle + Math.PI / 2;
            }

            // Add thruster lights for completed loading state
            if (loadingStage === LoadingStates.COMPLETE) {
              const thrusterLight = new THREE.PointLight(0x3366ff, 1, 10);
              thrusterLight.position.set(-1.5, 0, 0);
              spaceship.add(thrusterLight);
            }

            group.add(spaceship);
          }

          // Add label if needed (even if spaceship is null, we'll at least return the group with label)
          if (loadingStage === LoadingStates.COMPLETE) {
            let nodeEl = nodeLabelCache.current.get(node.id);

            if (!nodeEl) {
              nodeEl = document.createElement("div");
              nodeEl.className = "node-label wallet-label";
              nodeEl.textContent = "Wallet";
              nodeEl.style.color = "#ffffff";
              nodeEl.style.fontSize = "12px";
              nodeEl.style.fontWeight = "bold";
              nodeEl.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
              nodeEl.style.borderRadius = "6px";
              nodeEl.style.padding = "1px 4px";

              // Store for reuse
              nodeLabelCache.current.set(node.id, nodeEl);
            }

            const labelObj = new CSS2DObject(nodeEl);
            labelObj.position.set(0, 2, 0);
            group.add(labelObj);
          }

          return group;
        } else if (node.id === "sun") {
          // Special handling for sun - you might want a distinctive sphere here
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
            let nodeEl = nodeLabelCache.current.get(node.id);

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
              nodeLabelCache.current.set(node.id, nodeEl);
            }

            const labelObj = new CSS2DObject(nodeEl);
            const group = new THREE.Group();
            group.add(sunMesh);
            group.add(labelObj);

            return group;
          }

          return sunMesh;
        } else {
          // Regular token nodes - Use standard spheres with labels
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
            let nodeEl = nodeLabelCache.current.get(node.id);

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
              nodeLabelCache.current.set(node.id, nodeEl);
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
            const ringColor = node === hoverNode ? "red" : "orange";
            const nodeRadius = Math.cbrt(node.val);
            const innerRadius = nodeRadius * 1.2;
            const ringThickness = 0.3;
            const outerRadius = innerRadius + ringThickness;

            // Use cached geometry with appropriate detail level
            const segments =
              loadingStage === LoadingStates.COMPLETE ? 32 : 16;
            const ringGeometry = getRingGeometry(
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
      },
      [
        loadingStage,
        hoverNode,
        selectedNode,
        sharedMaterials,
        getRingGeometry,
      ]
    );

    return (
      <div
        ref={containerRef}
        className="overflow-hidden graph-container starry-background"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {width > 0 && height > 0 && (
          <ForceGraph3D
            ref={fgRef}
            width={width}
            height={height}
            backgroundColor="#000000"
            graphData={graphData}
            nodeLabel={
              loadingStage === LoadingStates.COMPLETE
                ? renderNodeLabel
                : undefined
            }
            nodeAutoColorBy="ticker"
            enableNodeDrag={false}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            nodeResolution={nodeResolution}
            extraRenderers={[labelRenderer]}
            nodeThreeObjectExtend={false} // Change this to false to replace default spheres
            nodeThreeObject={nodeThreeObject}
            onNodeRightClick={(node) => {
              // Reset focus
              if (node.id.startsWith("wallet-")) {
                // Focus back on sun
                const sunNode = nodes.find((n) => n.id === "sun");
                if (sunNode) {
                  handleNodeClick(sunNode);
                }
              }
            }}
          />
        )}
      </div>
    );
  }
);

export default TokensGraphClient;
