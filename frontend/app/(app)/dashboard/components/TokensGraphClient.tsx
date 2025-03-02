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
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

// Hooks
import { useDimensions } from "./graph/hooks/useDimensions";
import { useOrbitAnimation } from "./graph/hooks/useOrbitAnimation";
import { useWalletOrbit } from "./graph/hooks/useWalletOrbit";
import { useBloomPass } from "./graph/hooks/useBloomPass";

// Types & Constants
import {
  GraphNode,
  TokenDataNode,
  TokensGraphProps,
  LoadingStates,
} from "./graph/types/graphTypes";

// Components
import { createPolarGrid } from "./render/createPolarGrid";
import { renderNodeLabel } from "./render/renderNodeLabel";

// Utils
import {
  createSharedMaterials,
  createGeometryCache,
} from "./graph/utils/createMaterials";
import { createLightweightStarfield } from "./graph/utils/createStarfield";
import { createNodeObject } from "./graph/utils/nodeRendering";
import {
  constructNodes,
  calculateCameraPosition,
  calculateNodeResolution,
  cleanupResources,
} from "./graph/utils/graphHelpers";

// Context
import { useSelectedToken } from "@/contexts/SelectedTokenContext";

// External Dependencies
import _ from "lodash";
import {
  createSimpleSpaceshipMesh,
  createSpaceshipMesh,
} from "./render/createSpaceship";

const TokensGraphClient: React.FC<TokensGraphProps> = memo(
  ({ tokens, sunMarketData }) => {
    // Core references
    const fgRef = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useDimensions(containerRef);

    // Loading state
    const [loadingStage, setLoadingStage] = useState<LoadingStates>(
      LoadingStates.INITIAL
    );

    // Caches
    const nodeLabelCache = useRef<Map<string, HTMLDivElement>>(new Map());
    const geometryCacheRef = useRef(createGeometryCache());

    // Shared materials
    const sharedMaterials = useMemo(() => createSharedMaterials(), []);

    // Spaceship references
    const spaceshipMeshRef = useRef<THREE.Object3D | null>(null);
    const simpleSpaceshipMeshRef = useRef<THREE.Object3D | null>(null);

    // Context
    const { selectedToken, setSelectedToken, walletAddress = "", walletData } =
          useSelectedToken();

    // UI state
    const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(
      null
    );
    const [shouldOrbit, setShouldOrbit] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Orbit animation control
    const orbitTimeoutRef = useRef<number | null>(null);

    // CSS2DRenderer for labels
    const labelRenderer = useMemo(() => new CSS2DRenderer(), []);

    // Progressive loading effect
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

    // Generate nodes
    const nodes: GraphNode[] = useMemo(
      () =>
        constructNodes(tokens, sunMarketData, walletAddress || "", walletData),
      [tokens, sunMarketData, walletAddress, walletData]
    );

    // Empty links array (no connections in this visualization)
    const links = useMemo(() => [], []);

    // Graph data object
    const graphData = useMemo(() => ({ nodes, links }), [nodes, links]);

    // Setup orbit animations
    const { cleanup: cleanupOrbitAnimation } = useOrbitAnimation({
      fgRef,
      selectedNode,
      shouldOrbit,
    });

    const { cleanup: cleanupWalletOrbit } = useWalletOrbit({
      fgRef,
      nodes,
      selectedNode,
      shouldOrbit,
    });

    // Set initial camera position
    useEffect(() => {
      if (fgRef.current && tokens && tokens.length > 0) {
        fgRef.current.cameraPosition(
          { x: -1300, y: 1300, z: 500 },
          { x: 0, y: 0, z: 0 },
          0
        );
      }
    }, [tokens]);

    // Add polar grid to the scene
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
                orbitGap: 30,
                offset: 3,
                circles: tokens.length,
                radialLines: 6,
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
        }, 150);

        return () => clearTimeout(timer);
      }
    }, [tokens, loadingStage]);

    // Setup bloom pass
    useBloomPass(fgRef);

    // Initialize spaceship meshes
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

    // Add starfield to the scene
    useEffect(() => {
      if (
        fgRef.current &&
        typeof fgRef.current.scene === "function" &&
        loadingStage === LoadingStates.COMPLETE
      ) {
        const scene = fgRef.current.scene();
        if (scene && !scene.getObjectByName("starfield")) {
          const starfield = createLightweightStarfield();
          starfield.name = "starfield";
          starfield.renderOrder = -100;
          starfield.frustumCulled = true;
          scene.add(starfield);
        }
      }
    }, [loadingStage]);

    // Focus on wallet node when added
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

    // Node click handler
    const handleNodeClick = useCallback(
      (node: GraphNode) => {
        // Cancel any pending orbit actions
        setShouldOrbit(false);
        setIsAnimating(true);

        if (orbitTimeoutRef.current) {
          clearTimeout(orbitTimeoutRef.current);
          orbitTimeoutRef.current = null;
        }

        setSelectedNode(node);

        // Handle node type-specific actions
        if ("socials" in node) {
          // It's a token node
          setSelectedToken(node as TokenDataNode);
        } else {
          // Sun or wallet node
          setSelectedToken(null);
        }

        // Calculate target camera position
        const targetPosition = calculateCameraPosition(node);

        // Camera transition
        fgRef.current.cameraPosition(targetPosition, node, 3000);

        // After camera transition completes
        orbitTimeoutRef.current = window.setTimeout(() => {
          setShouldOrbit(true);
          setIsAnimating(false);
        }, 3000);
      },
      [setSelectedToken]
    );

    // Stop orbiting on user interaction
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleUserInput = () => {
        setShouldOrbit(false);

        if (orbitTimeoutRef.current) {
          clearTimeout(orbitTimeoutRef.current);
          orbitTimeoutRef.current = null;
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

    // Create node three.js objects
    const nodeThreeObject = useCallback(
      (node: GraphNode) => {
        return createNodeObject({
          node,
          loadingStage,
          hoverNode,
          selectedNode,
          sharedMaterials,
          geometryCache: geometryCacheRef.current,
          nodeLabelCache: nodeLabelCache.current,
          spaceshipMesh: spaceshipMeshRef.current,
          simpleSpaceshipMesh: simpleSpaceshipMeshRef.current,
        });
      },
      [loadingStage, hoverNode, selectedNode, sharedMaterials]
    );

    // Node resolution based on loading state
    const nodeResolution = useMemo(
      () => calculateNodeResolution(loadingStage, isAnimating),
      [loadingStage, isAnimating]
    );

    // Cleanup resources on unmount
    useEffect(() => {
      return () => {
        // Clean up animation timeouts and frames
        cleanupOrbitAnimation();
        cleanupWalletOrbit();

        if (orbitTimeoutRef.current) {
          clearTimeout(orbitTimeoutRef.current);
          orbitTimeoutRef.current = null;
        }

        // Clean up resources
        cleanupResources(
          nodeLabelCache.current,
          geometryCacheRef.current,
          spaceshipMeshRef.current,
          simpleSpaceshipMeshRef.current
        );

        spaceshipMeshRef.current = null;
        simpleSpaceshipMeshRef.current = null;
      };
    }, [cleanupOrbitAnimation, cleanupWalletOrbit]);

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
            nodeThreeObjectExtend={false}
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
