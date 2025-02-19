import React, { useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { MarketTokensApiService } from '@/services/MarketTokensApiService';
import { useApi } from '@/hooks/useApi';
import ReactDOMServer from 'react-dom/server';

const MAX_NODE_SIZE = 50;

// Helper: Create a polar grid (bullseye) as a Three.js Group
function createPolarGrid({
  radius = 500,
  circles = 5,
  radialLines = 12,
}: {
  radius?: number;
  circles?: number;
  radialLines?: number;
}) {
  const gridGroup = new THREE.Group();

  // Use a bright color and disable depth testing for visibility
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xaaaaaa, // grey color
    opacity: 0.5, // adjust opacity for fainter lines
    transparent: true,
    depthTest: false,
  });

  const segments = 64;
  // Loop through only odd indices to remove every second circle.
  // Multiply the computed radius by 3 so that the gap between circles is 3× bigger.
  for (let i = 1; i <= circles; i += 2) {
    const circleRadius = (i / circles) * radius * 5;
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

  // Create the central green dot
  const dotGeometry = new THREE.SphereGeometry(3, 16, 16);
  const dotMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    depthTest: false,
  });
  const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
  gridGroup.add(dotMesh);

  // Rotate the grid so it lies on the XZ plane (Y is up)
  gridGroup.rotation.x = -Math.PI / 2;

  return gridGroup;
}

const renderNodeLabel = (node: any) => {
  return ReactDOMServer.renderToStaticMarkup(
    <table className="border-collapse text-center">
      <tbody>
        <tr>
          <td colSpan={2} className="p-2 font-bold border border-gray-300">
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
  } = useApi(() => marketTokensApi.getTopMarketCapTokens('mcap', 1, 10), []);

  // Create a ref to the ForceGraph3D component so we can access its Three.js scene
  const fgRef = useRef<any>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (fgRef.current && typeof fgRef.current.scene === 'function') {
        const scene = fgRef.current.scene();
        if (scene) {
          // Only add the grid if it hasn't been added already.
          if (!scene.getObjectByName('polar-grid')) {
            const polarGrid = createPolarGrid({
              radius: 500,
              circles: 10,
              radialLines: 16,
            });
            polarGrid.name = 'polar-grid';
            scene.add(polarGrid);
            console.log('Polar grid added to scene');
          }
          clearInterval(interval);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tokens) return <div>No data available</div>;

  // Determine maximum market cap for scaling
  const maxMcap = Math.max(...tokens.map((token) => token.mcap));

  // Map tokens to nodes
  const nodes = tokens.map((token) => ({
    id: token.unit,
    name: token.ticker,
    val: (token.mcap / maxMcap) * MAX_NODE_SIZE,
    marketCap: token.mcap,
  }));

  // For this example, link each token to the next one
  const links = tokens.slice(1).map((token, i) => ({
    source: tokens[i].unit,
    target: token.unit,
  }));

  const graphData = { nodes, links };

  return (
    <div className="overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        width={1300}
        height={950}
        backgroundColor="#080808"
        graphData={graphData}
        nodeLabel={renderNodeLabel}
        nodeAutoColorBy="name"
        linkDirectionalParticles={8}
        linkWidth={8}
        linkDirectionalParticleSpeed={0.008}
      />
    </div>
  );
};

export default CardanoTokensGraph;
