import React, { useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { MarketTokensApiService } from '@/services/MarketTokensApiService';
import { useApi } from '@/hooks/useApi';
import ReactDOMServer from 'react-dom/server';

const MAX_NODE_SIZE = 100;
const MAX_ORBIT_RADIUS = 500; // maximum radius for the outer orbit

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

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xaaaaaa,
    opacity: 0.5,
    transparent: true,
    depthTest: false,
  });

  const segments = 64;
  // Draw every circle (one per orbit)
  for (let i = 1; i <= circles; i++) {
    // Each circle's radius is proportional to i
    const circleRadius = (i / circles) * radius;
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

  // Rotate grid so it lies on the XZ plane (with Y as up)
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

  const fgRef = useRef();
  // Ref to store original positions keyed by node id
  const originalPositions = useRef({});

  // Compute nodes and store original positions
  let nodes: any = [];
  let links: any = [];
  if (tokens && tokens.length > 0) {
    const maxMcap = Math.max(...tokens.map((token) => token.mcap));
    const n = tokens.length;
    nodes = tokens.map((token, i) => {
      const orbitRadius = ((i + 1) / n) * MAX_ORBIT_RADIUS;
      // Random angle for a random position along the orbit circle
      const angle = Math.random() * 2 * Math.PI;
      const x = orbitRadius * Math.cos(angle);
      const z = orbitRadius * Math.sin(angle);

      // Store original position for resetting later
      originalPositions.current[token.unit] = { x, y: 0, z };

      return {
        id: token.unit,
        name: token.ticker,
        marketCap: token.mcap,
        val: (token.mcap / maxMcap) * MAX_NODE_SIZE,
        x,
        y: 0,
        z,
        // Initially fix the node at its original position
        fx: x,
        fy: 0,
        fz: z,
      };
    });
  }

  // Add the polar grid (as before)
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const interval = setInterval(() => {
        if (fgRef.current && typeof fgRef.current.scene === 'function') {
          const scene = fgRef.current.scene();
          if (scene && !scene.getObjectByName('polar-grid')) {
            const polarGrid = createPolarGrid({
              radius: MAX_ORBIT_RADIUS,
              circles: tokens.length,
              radialLines: 16,
            });
            polarGrid.name = 'polar-grid';
            scene.add(polarGrid);
          }
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [tokens]);

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
        backgroundColor="#080808"
        graphData={graphData}
        nodeLabel={renderNodeLabel}
        nodeAutoColorBy="name"
        // Reset node to original position when dragging ends
        onNodeDragEnd={(node) => {
          const orig = originalPositions.current[node.id];
          if (!orig) return;
          const duration = 1000; // animation duration in ms
          const startTime = performance.now();
          // Capture the node's current position at drag end
          const startPos = { x: node.x, y: node.y, z: node.z };
          // Easing function (cubic ease-out)
          const easeOutCubic = (t) => --t * t * t + 1;

          const animate = (time) => {
            const elapsed = time - startTime;
            const t = Math.min(elapsed / duration, 1);
            const easedT = easeOutCubic(t);
            // Interpolate positions
            node.fx = startPos.x + (orig.x - startPos.x) * easedT;
            node.fy = startPos.y + (orig.y - startPos.y) * easedT;
            node.fz = startPos.z + (orig.z - startPos.z) * easedT;

            // Continue animation until complete
            if (t < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }}
      />
    </div>
  );
};

export default CardanoTokensGraph;
