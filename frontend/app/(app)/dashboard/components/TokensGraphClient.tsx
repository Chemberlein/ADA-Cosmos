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

const MAX_NODE_SIZE = 30;
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

type GraphNode = TokenDataNode | SunNode;

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
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

const TokensGraphClient: React.FC<CardanoTokensGraphClientProps> = memo(
	({ tokens, sunMarketData }) => {
		const fgRef = useRef<any>();
		const containerRef = useRef<HTMLDivElement>(null);
		const { width, height } = useDimensions(containerRef);
		const [loadingStage, setLoadingStage] = useState(LoadingStates.INITIAL);

		// Cache for node elements to avoid recreating DOM
		const nodeLabelCache = useRef<Map<string, HTMLDivElement>>(new Map());

		// Shared materials
		const sharedMaterials = useMemo(() => createSharedMaterials(), []);

		// Cache for geometries
		const geometryCache = useRef<Map<string, THREE.BufferGeometry>>(
			new Map()
		);

		// Selected token context for our sidebar
		const { setSelectedToken } = useSelectedToken();

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
					val: 500,
					x: 0,
					y: 0,
					z: 0,
					fx: 0,
					fy: 0,
					fz: 0,
				} as SunNode);
			}

			return computedNodes;
		}, [tokens, sunMarketData]);

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
					if (
						fgRef.current &&
						typeof fgRef.current.scene === "function"
					) {
						const scene = fgRef.current.scene();
						if (scene && !scene.getObjectByName("polar-grid")) {
							const polarGrid = createPolarGrid({
								orbitGap,
								offset,
								circles: tokens.length,
								radialLines:
									loadingStage === LoadingStates.COMPLETE
										? 16
										: 8, // Lower detail initially
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

				// If the node has socials, it's a token node; update context
				if ("socials" in node) {
					setSelectedToken(node);
				} else {
					setSelectedToken(null);
				}

				// Camera transition logic
				const distance = 150;
				let targetX, targetY, targetZ;

				if (Math.hypot(node.x, node.y, node.z) === 0) {
					targetX = 200;
					targetY = 400;
					targetZ = 0;
				} else {
					const distRatio =
						1 + distance / Math.hypot(node.x, node.y, node.z);
					targetX = node.x * distRatio;
					targetY = node.y * distRatio + 100;
					targetZ = node.z * distRatio;
				}

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
						orbitRadiusRef.current *
							Math.cos(orbitAngleRef.current);
					const newZ =
						selectedNode.z +
						orbitRadiusRef.current *
							Math.sin(orbitAngleRef.current);

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
				const key = `ring-${innerRadius.toFixed(
					2
				)}-${outerRadius.toFixed(2)}-${segments}`;

				if (!geometryCache.current.has(key)) {
					geometryCache.current.set(
						key,
						new THREE.RingGeometry(
							innerRadius,
							outerRadius,
							segments
						)
					);
				}

				return geometryCache.current.get(key)!;
			},
			[]
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

				// Cancel any pending animations
				if (orbitAnimationRef.current) {
					cancelAnimationFrame(orbitAnimationRef.current);
				}

				// Clear timeouts
				if (orbitTimeoutRef.current) {
					clearTimeout(orbitTimeoutRef.current);
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

		// Optimized node object creation function
		const createNodeObject = useCallback(
			(node: GraphNode) => {
				// For initial loading, just return minimal elements
				if (
					loadingStage === LoadingStates.INITIAL &&
					node.id !== "sun"
				) {
					return new THREE.Group();
				}

				const group = new THREE.Group();

				// Only add labels in complete stage or for important nodes
				if (
					loadingStage === LoadingStates.COMPLETE ||
					node.id === "sun"
				) {
					// Get or create the label element
					let nodeEl = nodeLabelCache.current.get(node.id);

					if (!nodeEl) {
						nodeEl = document.createElement("div");
						nodeEl.className = "node-label";
						nodeEl.textContent =
							"ticker" in node ? node.ticker : "ADA";
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

		return (
			<div
				ref={containerRef}
				className="overflow-hidden graph-container"
				style={{ width: "100%", height: "100%", position: "relative" }}
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
						nodeThreeObjectExtend={true}
						nodeThreeObject={createNodeObject}
					/>
				)}
			</div>
		);
	}
);

export default TokensGraphClient;
