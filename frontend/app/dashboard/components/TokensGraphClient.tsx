'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three'; // Import Three.js for custom objects
import { SunMarketData, Token } from './data/getTokensData';
import { createPolarGrid } from './render/createPolarGrid';
import { useBloomPass } from './render/useBloomPass';
import { renderNodeLabel } from './render/renderNodeLabel';

const MAX_NODE_SIZE = 2000;
const orbitGap = 100; // Gap between orbit lines
const offset = 3; // First node's multiplier

interface TokenNode {
  id: string;
  name: string;
  marketCap: number;
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
  id: 'sun';
  marketData: SunMarketData;
  val: number;
  x: number;
  y: number;
  z: number;
  fx: number;
  fy: number;
  fz: number;
}

type GraphNode = TokenNode | SunNode;

interface CardanoTokensGraphClientProps {
  tokens: Token[];
  sunMarketData: SunMarketData;
}

function useDimensions(ref: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = () => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  };

  useEffect(() => {
    if (!ref.current) return;
    updateDimensions();
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(ref.current);
    window.addEventListener('resize', updateDimensions);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [ref]);

  return dimensions;
}

const TokensGraphClient: React.FC<CardanoTokensGraphClientProps> = ({
  tokens,
  sunMarketData,
}) => {
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useDimensions(containerRef);

  // State for highlighting (hovered and selected)
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Memoize nodes so their positions remain constant
  const nodes: GraphNode[] = useMemo(() => {
    if (!tokens || tokens.length === 0) return [];
    const maxMcap = Math.max(...tokens.map((t) => t.mcap));
    const computedNodes: GraphNode[] = tokens.map((token, i) => {
      const orbitRadius = (offset + i) * orbitGap;
      const angle = Math.random() * 2 * Math.PI; // Random angle computed once
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
      } as TokenNode;
    });

    // Add sun node at the center
    if (sunMarketData) {
      computedNodes.push({
        id: 'sun',
        marketData: sunMarketData,
        val: 20000,
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

  // Update hover state on pointer move
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoverNode(node);
  }, []);

  // On click, highlight the node and animate the camera
  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
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
    <div
      ref={containerRef}
      className="overflow-hidden"
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {width > 0 && height > 0 && (
        <ForceGraph3D
          ref={fgRef}
          width={width}
          height={height}
          backgroundColor="#000000"
          graphData={graphData}
          nodeLabel={renderNodeLabel}
          nodeAutoColorBy="name"
          enableNodeDrag={false}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          nodeResolution={16}
          /*
            Use nodeThreeObjectExtend so that the object returned by nodeThreeObject
            is appended to the default node mesh rather than replacing it.
          */
          nodeThreeObjectExtend={true}
          nodeThreeObject={(node: GraphNode) => {
            if (node === hoverNode || node === selectedNode) {
              const ringColor = node === hoverNode ? 'red' : 'orange';
              // Use cube root scaling to approximate the rendered node sphere radius.
              const nodeRadius = Math.cbrt(node.val);
              // Set the inner radius to be exactly x6 larger than the node's radius.
              const innerRadius = nodeRadius * 6;
              // Use a fixed ring thickness (in world units). Adjust this constant as needed.
              const ringThickness = 5;
              const outerRadius = innerRadius + ringThickness;
              
              const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
              const ringMaterial = new THREE.MeshBasicMaterial({
                color: ringColor,
                side: THREE.DoubleSide,
              });
              const ring = new THREE.Mesh(ringGeometry, ringMaterial);
              // Rotate so the ring is flat (facing the camera).
              ring.rotation.x = Math.PI / 2;
              return ring;
            }
            return new THREE.Group();
          }}
          
        />
      )}
    </div>
  );
};

export default TokensGraphClient;
