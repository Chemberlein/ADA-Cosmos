"use client";

import React, { useRef, useEffect, useCallback } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import ReactDOMServer from "react-dom/server";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SunMarketData, Token } from "./getTokensData";

const MAX_NODE_SIZE = 1000;
const orbitGap = 100; // Gap between orbit lines
const offset = 3; // First node's multiplier

// Helper: Create a polar grid with circles at each node orbit
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
	gridGroup.rotation.x = -Math.PI / 2;
	return gridGroup;
}

// Helper: Render node label as static markup.
const renderNodeLabel = (node: any) => {
	if (node.id === "sun") {
		return ReactDOMServer.renderToStaticMarkup(
			<table className="border-collapse text-center">
				<tbody>
					<tr>
						<td
							colSpan={2}
							className="p-2 font-bold border border-gray-300"
						>
							ADA Market Data
						</td>
					</tr>
					<tr>
						<td className="p-2 border border-gray-300">
							ADA Price
						</td>
						<td className="p-2 border border-gray-300">
							${node.marketData?.adaPrice?.toFixed(3) || "N/A"}
						</td>
					</tr>
					<tr>
						<td className="p-2 border border-gray-300">
							24H DEX Volume
						</td>
						<td className="p-2 border border-gray-300">
							₳
							{node.marketData?.dexVolume?.toLocaleString() ||
								"N/A"}
						</td>
					</tr>
					<tr>
						<td className="p-2 border border-gray-300">
							24H NFT Volume
						</td>
						<td className="p-2 border border-gray-300">
							₳
							{node.marketData?.nftVolume?.toLocaleString() ||
								"N/A"}
						</td>
					</tr>
					<tr>
						<td className="p-2 border border-gray-300">
							24H Active Addresses
						</td>
						<td className="p-2 border border-gray-300">
							{node.marketData?.activeAddresses?.toLocaleString() ||
								"N/A"}
						</td>
					</tr>
				</tbody>
			</table>
		);
	} else {
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
	}
};

interface CardanoTokensGraphClientProps {
	tokens: Token[];
	sunMarketData: SunMarketData;
}

const CardanoTokensGraphClient: React.FC<CardanoTokensGraphClientProps> = ({
	tokens,
	sunMarketData,
}) => {
	const fgRef = useRef<any>();

	// Build nodes and links
	let nodes: any[] = [];
	let links: any[] = [];
	if (tokens && tokens.length > 0) {
		const maxMcap = Math.max(...tokens.map((t) => t.mcap));
		nodes = tokens.map((token, i) => {
			const orbitRadius = (offset + i) * orbitGap;
			const angle = Math.random() * 2 * Math.PI;
			const x = orbitRadius * Math.cos(angle);
			const z = orbitRadius * Math.sin(angle);
			return {
				id: token.unit,
				name: token.ticker,
				marketCap: token.mcap,
				val: (token.mcap / maxMcap) * MAX_NODE_SIZE,
				x,
				y: 0,
				z,
				fx: x,
				fy: 0,
				fz: z,
				orbitRadius,
				angle,
			};
		});

		// Add sun node at the center
		if (sunMarketData) {
			nodes.push({
				id: "sun",
				marketData: sunMarketData,
				val: 15000,
				x: 0,
				y: 0,
				z: 0,
				fx: 0,
				fy: 0,
				fz: 0,
			});
		}
	}

	useEffect(() => {
		if (fgRef.current && tokens && tokens.length > 0) {
			fgRef.current.cameraPosition(
				{ x: -1300, y: 1300, z: 500 },
				{ x: 0, y: 0, z: 0 },
				0
			);
		}
	}, [tokens]);

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
		const distance = 100;
		let targetX, targetY, targetZ;
		if (Math.hypot(node.x, node.y, node.z) === 0) {
			targetX = 200;
			targetY = 200;
			targetZ = -700;
		} else {
			const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
			targetX = node.x * distRatio + 200;
			targetY = node.y * distRatio + 200;
			targetZ = node.z * distRatio - 700;
		}
		fgRef.current.cameraPosition(
			{ x: targetX, y: targetY, z: targetZ },
			node,
			3000
		);
	}, []);

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
				nodeResolution={16}
			/>
		</div>
	);
};

export default CardanoTokensGraphClient;
