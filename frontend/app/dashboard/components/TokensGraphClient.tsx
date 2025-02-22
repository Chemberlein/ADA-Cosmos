'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { SunMarketData, Token } from './data/getTokensData';
import { createPolarGrid } from './render/createPolarGrid';
import { useBloomPass } from './render/useBloomPass';
import { renderNodeLabel } from './render/renderNodeLabel';

const MAX_NODE_SIZE = 1000;
const orbitGap = 100; // Gap between orbit lines
const offset = 3; // First node's multiplier

interface CardanoTokensGraphClientProps {
  tokens: Token[];
  sunMarketData: SunMarketData;
}

const TokensGraphClient: React.FC<CardanoTokensGraphClientProps> = ({
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
        id: 'sun',
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
        if (fgRef.current && typeof fgRef.current.scene === 'function') {
          const scene = fgRef.current.scene();
          if (scene && !scene.getObjectByName('polar-grid')) {
            const polarGrid = createPolarGrid({
              orbitGap,
              offset,
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

  // Set up the bloom pass using the custom hook
  useBloomPass(fgRef);

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

export default TokensGraphClient;
