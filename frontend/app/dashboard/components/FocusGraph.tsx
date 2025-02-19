import React, { useRef, useEffect, useCallback } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { useApi } from "@/hooks/useApi";
import ReactDOMServer from "react-dom/server";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const MAX_NODE_SIZE = 750;

// Adjustable variables:
// orbitGap controls the distance between orbit lines (and between nodes)
// offset controls the multiplier for the first node (e.g. offset = 4.2 puts the first node at 4.2 * orbitGap)
const orbitGap = 100; // Change this to adjust the gap between orbit lines
const offset = 3; // First node's multiplier (adjust for closer or farther starting position)

// Helper: Create a polar grid with circles at the exact node orbit radii
function createPolarGrid({
	orbitGap,
	offset,
	circles,
	radialLines = 12,
}: {
	orbitGap: number;
	offset: number;
	circles: number;
	radialLines?: number;
}) {
	const gridGroup = new THREE.Group();

	const lineMaterial = new THREE.LineBasicMaterial({
		color: 0xaaaaaa,
		opacity: 0.5,
		transparent: true,
		depthTest: false,
	});

	const segments = 64;
	// Draw one circle per node orbit:
	for (let i = 0; i < circles; i++) {
		const circleRadius = (offset + i) * orbitGap;
		const circlePoints: THREE.Vector3[] = [];
		for (let j = 0; j <= segments; j++) {
			const theta = (j / segments) * 2 * Math.PI;
			circlePoints.push(
				new THREE.Vector3(
					circleRadius * Math.cos(theta),
					circleRadius * Math.sin(theta),
					0
				)
			);
		}
		const circleGeometry = new THREE.BufferGeometry().setFromPoints(
			circlePoints
		);
		const circle = new THREE.LineLoop(circleGeometry, lineMaterial);
		gridGroup.add(circle);
	}

	// Create the central sun with an emissive material
	const sunGeometry = new THREE.SphereGeometry(50, 52, 52);
	const sunMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffdd,
		emissive: 0xffffee,
		emissiveIntensity: 1,
		depthTest: false,
	});
	const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
	gridGroup.add(sunMesh);

	// Rotate the grid so it lies on the XZ plane (with Y up)
	gridGroup.rotation.x = -Math.PI / 2;

	return gridGroup;
}

// Helper: Render node label as static markup (using a simple HTML table)
const renderNodeLabel = (node: any) => {
	return ReactDOMServer.renderToStaticMarkup(
		<table className="border-collapse text-center">
			<tbody>
				<tr>
					<td
						colSpan={2}
						className="p-2 font-bold border border-gray-300"
					>
						${node.name}
					</td>
				</tr>
				<tr>
					<td className="p-2 border border-gray-300">Mcap</td>
					<td className="p-2 border border-gray-300">
						${node.marketCap.toLocaleString()} ₳
					</td>
				</tr>
			</tbody>
		</table>
	);
};

const CardanoTokensGraph = () => {
	const marketTokensApi = new MarketTokensApiService();
	const {
		data: tokens,
		loading,
		error,
	} = useApi(() => marketTokensApi.getTopMarketCapTokens("mcap", 1, 10), []);

	const fgRef = useRef<any>();

	let nodes: any[] = [];
	let links: any[] = [];
	if (tokens && tokens.length > 0) {
		nodes = tokens.map((token, i) => {
			// Calculate orbit radius based on adjustable gap and offset
			const orbitRadius = (offset + i) * orbitGap;
			// Choose a random angle (in radians) for the node's position along its orbit
			const angle = Math.random() * 2 * Math.PI;
			const x = orbitRadius * Math.cos(angle);
			const z = orbitRadius * Math.sin(angle);

			return {
				id: token.unit,
				name: token.ticker,
				marketCap: token.mcap,
				val:
					(token.mcap / Math.max(...tokens.map((t) => t.mcap))) *
					MAX_NODE_SIZE,
				x,
				y: 0,
				z,
				// Fix the node in position
				fx: x,
				fy: 0,
				fz: z,
				orbitRadius,
				angle,
			};
		});
	}

	// Set the initial camera position once the tokens data is loaded
	useEffect(() => {
		if (fgRef.current && tokens && tokens.length > 0) {
			fgRef.current.cameraPosition(
				{ x: -1300, y: 1300, z: 500 },
				{ x: 0, y: 0, z: 0 },
				0
			);
		}
	}, [tokens]);

	// Add the polar grid to the scene
	useEffect(() => {
		if (tokens && tokens.length > 0) {
			const interval = setInterval(() => {
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
							radialLines: 16,
						});
						polarGrid.name = "polar-grid";
						scene.add(polarGrid);
					}
					clearInterval(interval);
				}
			}, 100);
			return () => clearInterval(interval);
		}
	}, [tokens]);

	// Add bloom effect to the scene once the composer is available
	useEffect(() => {
		const interval = setInterval(() => {
			if (
				fgRef.current &&
				typeof fgRef.current.postProcessingComposer === "function"
			) {
				const composer = fgRef.current.postProcessingComposer();
				if (composer) {
					const bloomPass = new UnrealBloomPass(
						new THREE.Vector2(
							window.innerWidth,
							window.innerHeight
						),
						1.5,
						0.4,
						0.85
					);
					bloomPass.strength = 3;
					bloomPass.radius = 1;
					bloomPass.threshold = 0;
					composer.addPass(bloomPass);
					clearInterval(interval);
				}
			}
		}, 100);
		return () => clearInterval(interval);
	}, []);

	// Click-to-focus: animate camera to the clicked node
	const handleNodeClick = useCallback((node: any) => {
		const distance = 400;
		const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
		fgRef.current.cameraPosition(
			{
				x: node.x * distRatio + 200,
				y: node.y * distRatio + 200,
				z: node.z * distRatio - 700,
			},
			node,
			3000
		);
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!tokens) return <div>No data available</div>;

	const graphData = { nodes, links };

	return (
		<div className="overflow-hidden">
			<ForceGraph3D
				ref={fgRef}
				width={1300}
				height={950}
				backgroundColor="#000000"
				graphData={graphData}
				nodeLabel={renderNodeLabel}
				nodeAutoColorBy="name"
				enableNodeDrag={false}
				onNodeClick={handleNodeClick}
			/>
		</div>
	);
};

export default CardanoTokensGraph;
