"use client";

import React, { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import rawGraphData from "../../../graphData/logReturnGraph.json";

const CorailationPath = () => {
  const fgRef = useRef<any>(null);
  const CORRELATION_THRESHOLD = 0.2; // Adjust this threshold as needed

  // Helper function to remove duplicate links
  const removeDuplicateLinks = (links: any[]) => {
    const uniqueLinks = new Map();
    
    links.forEach(link => {
      // Create a unique key for each link pair, regardless of direction
      const nodeIds = [link.source, link.target].sort();
      const key = `${nodeIds[0]}-${nodeIds[1]}`;
      
      // Keep the link with the highest absolute correlation
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
      .filter(link => Math.abs(link.averageCorrelation) > CORRELATION_THRESHOLD),
  };

  useEffect(() => {
    if (fgRef.current) {
      // Set custom link force: positive values attract, negative repel.
      fgRef.current.d3Force("link")
        .strength((link: { averageCorrelation: any; }) => link.averageCorrelation>0 ? link.averageCorrelation : 0)
        .distance(() => 50);  // Set maximum link length to 200
      
      // Optionally adjust charge force if needed.
      fgRef.current.d3Force("charge").strength(-100);
      
      // Add strong center force to attract nodes to the middle
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
