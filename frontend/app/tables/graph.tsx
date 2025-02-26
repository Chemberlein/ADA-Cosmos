"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import rawGraphData from "../../../graphData/graphV2.json";
import { Controls } from "./components/Controls";
import { GraphData } from "./types";
import { GRAPH_CONSTANTS } from "./constants/graph";
import { removeDuplicateLinks, getNodeColor } from "./utils/graphHelpers";
import { renderNodeLabel } from './utils/renderNodeLabel';

const CorailationPath = () => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions when container size changes
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const [correlationThreshold, setCorrelationThreshold] = useState(GRAPH_CONSTANTS.INITIAL_CORRELATION_THRESHOLD);
  const [minMeasurements, setMinMeasurements] = useState(GRAPH_CONSTANTS.INITIAL_MIN_MEASUREMENTS);

  const data: GraphData = {
    nodes: rawGraphData.nodes,
    links: removeDuplicateLinks(rawGraphData.links)
      .map(link => ({
        ...link,
        averageCorrelation: link.avarageCorilation ?? 0,
      }))
      .filter(link => 
        Math.abs(link.averageCorrelation!) > correlationThreshold && 
        link.nbOfMesurments! >= minMeasurements
      ),
  };

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("link")
        .strength((link: { averageCorrelation: any; }) => link.averageCorrelation>0 ? link.averageCorrelation : 0)
        .distance(() => 200);
      
      fgRef.current.d3Force("charge").strength(-200);
      fgRef.current.d3Force("center").strength(1);
    }
  }, [data]);

  // Add this new useEffect for initial zoom to fit
  useEffect(() => {
    // Short timeout to ensure the graph is rendered
    const timeoutId = setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(500); // 400ms transition duration
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Controls
        correlationThreshold={correlationThreshold}
        minMeasurements={minMeasurements}
        onCorrelationChange={setCorrelationThreshold}
        onMeasurementsChange={setMinMeasurements}
        onZoomToFit={() => fgRef.current.zoomToFit(400)}
      />
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel={renderNodeLabel}
        linkWidth={link => {
          const correlation = Math.abs(link.averageCorrelation!);
          return GRAPH_CONSTANTS.MIN_LINK_WIDTH + 
                 (GRAPH_CONSTANTS.MAX_LINK_WIDTH - GRAPH_CONSTANTS.MIN_LINK_WIDTH) * correlation;
        }}
        linkColor={link => link.averageCorrelation! > 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 0, 0, 0.2)'}
        nodeRelSize={6}
        nodeVal={node => {
          const liquidity = node.liquidity || 0;
          return Math.min((liquidity + 1)/1000, GRAPH_CONSTANTS.MAX_NODE_SIZE);
        }}
        nodeColor={node => getNodeColor(node.price || 0)}
      />
    </div>
  );
};

export default CorailationPath;
