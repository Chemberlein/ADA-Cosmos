"use client";

import React, { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import rawGraphData from "../../../graphData/graphV2.json";

const CorailationPath = () => {
  const fgRef = useRef<any>(null);
  const CORRELATION_THRESHOLD = 0.2; 
  const MIN_MEASUREMENTS = 100; // New constant for minimum measurements

  // Helper function to remove duplicate links
  const removeDuplicateLinks = (links: any[]) => {
    const uniqueLinks = new Map();
    
    links.forEach(link => {
      const nodeIds = [link.source, link.target].sort();
      const key = `${nodeIds[0]}-${nodeIds[1]}`;
      
      if (!uniqueLinks.has(key) || 
          Math.abs(link.avarageCorilation) > Math.abs(uniqueLinks.get(key).avarageCorilation)) {
        uniqueLinks.set(key, link);
      }
    });

    return Array.from(uniqueLinks.values());
  };
  
  const data = {
    nodes: rawGraphData.nodes,
    links: removeDuplicateLinks(rawGraphData.links)
      .map((link: any) => ({
        ...link,
        averageCorrelation: link.avarageCorilation ?? 0,
      }))
      .filter(link => 
        Math.abs(link.averageCorrelation) > CORRELATION_THRESHOLD && 
        link.nbOfMesurments >= MIN_MEASUREMENTS
      ),
  };

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("link")
        .strength((link: { averageCorrelation: any; }) => link.averageCorrelation>0 ? link.averageCorrelation : 0)
        .distance(() => 50);  
      
      fgRef.current.d3Force("charge").strength(-100);
      
      fgRef.current.d3Force("center").strength(1);
    }
  }, []);
  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      linkWidth={link => Math.abs(link.averageCorrelation) * 2}
      linkColor={link => link.averageCorrelation > 0 ? '#ffffff' : '#ff0000'}
    />
  );
};

export default CorailationPath;
