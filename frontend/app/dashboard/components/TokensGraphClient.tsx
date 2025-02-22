'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { SunMarketData, Token } from './data/getTokensData';
import { createPolarGrid } from './render/createPolarGrid';
import { useBloomPass } from './render/useBloomPass';
import { renderNodeLabel } from './render/renderNodeLabel';

const MAX_NODE_SIZE = 20;
const orbitGap = 30;
const offset = 3;

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
    const observer = new ResizeObserver(() => updateDimensions());
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

  // For hover/selection state
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  // Flag to trigger orbiting after camera transition
  const [shouldOrbit, setShouldOrbit] = useState(false);

  // Refs to manage orbiting animation and delay timeout
  const orbitAnimationRef = useRef<number | null>(null);
  const orbitTimeoutRef = useRef<number | null>(null);
  const orbitAngleRef = useRef(0);
  const orbitRadiusRef = useRef(0);

  // Create CSS2DRenderer instance for labels
  const labelRenderer = useMemo(() => new CSS2DRenderer(), []);

  // Memoize nodes
  const nodes: GraphNode[] = useMemo(() => {
    if (!tokens || tokens.length === 0) return [];
    const maxMcap = Math.max(...tokens.map((t) => t.mcap));
    const computedNodes: GraphNode[] = tokens.map((token, i) => {
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
      } as TokenNode;
    });
    // Add sun node at the center
    if (sunMarketData) {
      computedNodes.push({
        id: 'sun',
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

  // Add polar grid to the scene
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

  // Setup bloom pass
  useBloomPass(fgRef);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoverNode(node);
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    // When a node is clicked, cancel any pending orbit actions.
    setShouldOrbit(false);
    if (orbitTimeoutRef.current) {
      clearTimeout(orbitTimeoutRef.current);
      orbitTimeoutRef.current = null;
    }
    if (orbitAnimationRef.current) {
      cancelAnimationFrame(orbitAnimationRef.current);
      orbitAnimationRef.current = null;
    }
    setSelectedNode(node);

    // Initial camera transition to the node.
    const distance = 150;
    let targetX, targetY, targetZ;
    if (Math.hypot(node.x, node.y, node.z) === 0) {
      targetX = 200;
      targetY = 400;
      targetZ = 0;
    } else {
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      targetX = node.x * distRatio;
      targetY = node.y * distRatio + 100;
      targetZ = node.z * distRatio;
    }
    fgRef.current.cameraPosition(
      { x: targetX, y: targetY, z: targetZ },
      node,
      3000
    );
    // After the camera transition, start orbiting.
    orbitTimeoutRef.current = window.setTimeout(() => {
      setShouldOrbit(true);
    }, 3000);
  }, []);

  // Stop orbiting if the user interacts with the graph.
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
    container.addEventListener('mousedown', handleUserInput);
    container.addEventListener('touchstart', handleUserInput);
    container.addEventListener('wheel', handleUserInput);
    return () => {
      container.removeEventListener('mousedown', handleUserInput);
      container.removeEventListener('touchstart', handleUserInput);
      container.removeEventListener('wheel', handleUserInput);
    };
  }, []);

  // Orbit animation effect: smoothly orbit the camera around the selected node.
  useEffect(() => {
    // Only start orbiting if a node is selected and the flag is set.
    if (!selectedNode || !shouldOrbit) {
      if (orbitAnimationRef.current) {
        cancelAnimationFrame(orbitAnimationRef.current);
        orbitAnimationRef.current = null;
      }
      return;
    }

    // Compute the orbit radius and initial angle based on the current camera position.
    const currentCamPos = fgRef.current.camera().position;
    const dx = currentCamPos.x - selectedNode.x;
    const dz = currentCamPos.z - selectedNode.z;
    orbitRadiusRef.current = Math.sqrt(dx * dx + dz * dz);
    orbitAngleRef.current = Math.atan2(dz, dx);

    // Set a small nonzero duration (in ms) to smooth out camera transitions.
    const transitionDuration = 50;
    // Adjust orbitSpeed to control the orbiting pace.
    const orbitSpeed = 0.00015;

    const animateOrbit = () => {
      orbitAngleRef.current += orbitSpeed;
      const newX =
        selectedNode.x +
        orbitRadiusRef.current * Math.cos(orbitAngleRef.current);
      const newZ =
        selectedNode.z +
        orbitRadiusRef.current * Math.sin(orbitAngleRef.current);
      // Maintain current Y level (you can adjust this if a tilt is desired)
      const newY = currentCamPos.y;
      fgRef.current.cameraPosition(
        { x: newX, y: newY, z: newZ },
        selectedNode,
        transitionDuration
      );
      orbitAnimationRef.current = requestAnimationFrame(animateOrbit);
    };

    animateOrbit();

    return () => {
      if (orbitAnimationRef.current) {
        cancelAnimationFrame(orbitAnimationRef.current);
        orbitAnimationRef.current = null;
      }
    };
  }, [selectedNode, shouldOrbit]);

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
          extraRenderers={[labelRenderer]}
          nodeThreeObjectExtend={true}
          nodeThreeObject={(node: GraphNode) => {
            const group = new THREE.Group();
            let labelObj = (node as any).__labelObj;
            if (!labelObj) {
              const nodeEl = document.createElement('div');
              nodeEl.className = 'node-label';
              nodeEl.textContent = 'name' in node ? node.name : 'ADA';
              nodeEl.style.color = '#ffffff';
              nodeEl.style.fontSize = '7px';
              nodeEl.style.fontWeight = 'bold';
              nodeEl.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
              nodeEl.style.borderRadius = '4px';
              nodeEl.style.padding = '2px 2px';
              labelObj = new CSS2DObject(nodeEl);
              (node as any).__labelObj = labelObj;
            }
            group.add(labelObj);

            if (node === hoverNode || node === selectedNode) {
              const ringColor = node === hoverNode ? 'red' : 'orange';
              const nodeRadius = Math.cbrt(node.val);
              const innerRadius = nodeRadius * 6;
              const ringThickness = 1;
              const outerRadius = innerRadius + ringThickness;
              const ringGeometry = new THREE.RingGeometry(
                innerRadius,
                outerRadius,
                32
              );
              const ringMaterial = new THREE.MeshBasicMaterial({
                color: ringColor,
                side: THREE.DoubleSide,
              });
              const ring = new THREE.Mesh(ringGeometry, ringMaterial);
              ring.rotation.x = Math.PI / 2;
              group.add(ring);
            }
            return group;
          }}
        />
      )}
    </div>
  );
};

export default TokensGraphClient;
