"use client";

import React, {
	useEffect,
	useRef,
	useState,
	useLayoutEffect,
	useCallback,
} from "react";
import ForceGraph3D from "react-force-graph-3d";
import rawGraphData from "./utils/graphV2";
import { Controls } from "./components/Controls";
import { GraphData, GraphNode } from "./types";
import { GRAPH_CONSTANTS } from "./constants";
import { removeDuplicateLinks, getNodeColor } from "./utils/graphHelpers";
import { renderNodeLabel } from "./utils/renderNodeLabel";
import { useSelectedToken } from "@/contexts/SelectedTokenContext";

const CorrelationGraph = () => {
	const fgRef = useRef<any>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const { setSelectedToken } = useSelectedToken();

	// State for node selection and orbiting
	const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
	const [shouldOrbit, setShouldOrbit] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	// Refs to manage orbiting animation
	const orbitAnimationRef = useRef<number | null>(null);
	const orbitTimeoutRef = useRef<number | null>(null);
	const orbitAngleRef = useRef(0);
	const orbitRadiusRef = useRef(0);

	// Update dimensions when container size changes
	useLayoutEffect(() => {
		if (!containerRef.current) return;

		const updateSize = () => {
			const rect = containerRef.current?.getBoundingClientRect();
			if (rect) {
				setDimensions({
					width: rect.width,
					height: rect.height,
				});
			}
		};

		updateSize();
		const observer = new ResizeObserver(updateSize);
		observer.observe(containerRef.current);

		return () => observer.disconnect();
	}, []);

	const [correlationThreshold, setCorrelationThreshold] = useState<number>(
		GRAPH_CONSTANTS.INITIAL_CORRELATION_THRESHOLD
	);
	const [minMeasurements, setMinMeasurements] = useState<number>(
		GRAPH_CONSTANTS.INITIAL_MIN_MEASUREMENTS
	);

	const data: GraphData = {
		nodes: rawGraphData.nodes,
		links: removeDuplicateLinks(rawGraphData.links)
			.map((link) => ({
				...link,
				averageCorrelation: link.avarageCorilation ?? 0,
			}))
			.filter(
				(link) =>
					Math.abs(link.averageCorrelation!) > correlationThreshold &&
					link.nbOfMesurments! >= minMeasurements
			),
	};

	// Adapter function to convert GraphNode to TokenDataNode format
	const adaptNodeForContext = useCallback((node: GraphNode) => {
		if (!node) return null;

		// Create a simplified version that matches expected TokenDataNode format
		return {
			id: node.id,
			ticker: node.name, // Use name as ticker if no ticker property
			unit: node.id, // Use id as unit
			val: 10, // Default value
			x: node.x || 0,
			y: node.y || 0,
			z: node.z || 0,
			fx: node.x || 0,
			fy: node.y || 0,
			fz: node.z || 0,
			price: node.price || 0,
			liquidity: node.liquidity || 0,
			mcap: node.liquidity || 0, // Use liquidity as mcap if no direct mcap property
			// Minimal required structure for TokenDataNode
			socials: {
				description: null,
				discord: null,
				email: null,
				facebook: null,
				github: null,
				instagram: null,
				medium: null,
				reddit: null,
				telegram: null,
				twitter: null,
				website: null,
				youtube: null,
			},
			holders: 0,
			ohlcv: [],
			tradingStats: [],
			orbitRadius: 0,
			angle: 0,
		};
	}, []);

	// Handle node click for selection and camera focus
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

			// Update the selected token in context using the adapter
			setSelectedToken(adaptNodeForContext(node));

			// Camera transition logic
			const distance = 1500;
			let targetX, targetY, targetZ;

			if (
				!node.x ||
				!node.y ||
				!node.z ||
				Math.hypot(node.x, node.y, node.z) === 0
			) {
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

	// Configure force simulation
	useEffect(() => {
		if (fgRef.current) {
			fgRef.current
				.d3Force("link")
				.strength((link: { averageCorrelation: any }) =>
					link.averageCorrelation > 0 ? link.averageCorrelation : 0
				)
				.distance(() => GRAPH_CONSTANTS.FORCE.LINK_DISTANCE);

			fgRef.current
				.d3Force("charge")
				.strength(GRAPH_CONSTANTS.FORCE.CHARGE_STRENGTH);
			fgRef.current
				.d3Force("center")
				.strength(GRAPH_CONSTANTS.FORCE.CENTER_STRENGTH);
		}
	}, [data]);

	// Initial zoom to fit
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (fgRef.current) {
				fgRef.current.zoomToFit(
					GRAPH_CONSTANTS.ANIMATION.ZOOM_DURATION
				);
			}
		}, GRAPH_CONSTANTS.ANIMATION.INITIAL_TIMEOUT);

		return () => clearTimeout(timeoutId);
	}, []);

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

	// Orbit animation effect
	useEffect(() => {
		if (!selectedNode || !shouldOrbit || !fgRef.current) {
			if (orbitAnimationRef.current) {
				cancelAnimationFrame(orbitAnimationRef.current);
				orbitAnimationRef.current = null;
			}
			return;
		}

		// Calculate orbit parameters
		const currentCamPos = fgRef.current.camera().position;
		const nodePos = fgRef.current.graph2ScreenCoords(
			selectedNode.x || 0,
			selectedNode.y || 0,
			selectedNode.z || 0
		);

		const dx = currentCamPos.x - (selectedNode.x || 0);
		const dz = currentCamPos.z - (selectedNode.z || 0);

		orbitRadiusRef.current = Math.sqrt(dx * dx + dz * dz);
		orbitAngleRef.current = Math.atan2(dz, dx);

		// Animation parameters
		const transitionDuration = 50;
		const orbitSpeed = 0.00002;

		let lastTime = 0;
		const frameInterval = 50; // ms between updates

		const animateOrbit = (timestamp: number) => {
			if (timestamp - lastTime > frameInterval) {
				lastTime = timestamp;

				orbitAngleRef.current += orbitSpeed * frameInterval;

				const newX =
					(selectedNode.x || 0) +
					orbitRadiusRef.current * Math.cos(orbitAngleRef.current);
				const newZ =
					(selectedNode.z || 0) +
					orbitRadiusRef.current * Math.sin(orbitAngleRef.current);

				// Maintain current Y level
				const newY = currentCamPos.y;

				fgRef.current.cameraPosition(
					{ x: newX, y: newY, z: newZ },
					{
						x: selectedNode.x || 0,
						y: selectedNode.y || 0,
						z: selectedNode.z || 0,
					},
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

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (orbitAnimationRef.current) {
				cancelAnimationFrame(orbitAnimationRef.current);
			}
			if (orbitTimeoutRef.current) {
				clearTimeout(orbitTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div ref={containerRef} className="relative w-full h-full">
			<Controls
				correlationThreshold={correlationThreshold}
				minMeasurements={minMeasurements}
				onCorrelationChange={(value: number) =>
					setCorrelationThreshold(value)
				}
				onMeasurementsChange={(value: number) =>
					setMinMeasurements(value)
				}
				onZoomToFit={() => fgRef.current.zoomToFit(400)}
			/>
			<ForceGraph3D
				ref={fgRef}
				graphData={data}
				width={dimensions.width}
				height={dimensions.height}
				nodeLabel={renderNodeLabel}
				onNodeClick={handleNodeClick}
				linkWidth={(link) => {
					const correlation = Math.abs(link.averageCorrelation!);
					return (
						GRAPH_CONSTANTS.MIN_LINK_WIDTH +
						(GRAPH_CONSTANTS.MAX_LINK_WIDTH -
							GRAPH_CONSTANTS.MIN_LINK_WIDTH) *
							correlation
					);
				}}
				linkColor={
					(link) =>
						link.averageCorrelation! > 0
							? "rgba(255, 255, 255, 0.9)" // Increased from 0.2 to 0.6
							: "rgba(255, 0, 0, 0.9)" // Increased from 0.2 to 0.6
				}
				nodeRelSize={6}
				nodeVal={(node) => {
					const liquidity = node.liquidity || 0;
					return Math.min(
						(liquidity + 1) / 1000,
						GRAPH_CONSTANTS.MAX_NODE_SIZE
					);
				}}
				nodeColor={(node) => getNodeColor(node.price || 0)}
			/>
		</div>
	);
};

export default CorrelationGraph;
