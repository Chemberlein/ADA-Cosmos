"use client";

import React, { useEffect, useRef } from "react";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { useApi } from "@/hooks/useApi";
import { TokenOHLCV, TopTokenHolder } from "@/interfaces/tokens";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import rawGraphData from "../../../graphData/logReturnGraph.json"

// Ensure avgLogReturn is always a number and avarageCorilation is always a number or undefined
const graphData = {
  ...rawGraphData,
  nodes: rawGraphData.nodes.map(node => ({
    ...node,
    avgLogReturn: node.avgLogReturn ?? 0
  })),
  links: rawGraphData.links
    .map(link => ({
      ...link,
      avarageCorilation: link.avarageCorilation ?? undefined
    }))
    .filter(link => Math.abs(link.avarageCorilation ?? 0) >= 0.3) // Filter out links with avarageCorilation lower than 0.3
};

import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from "react-force-graph-2d";
import * as d3 from "d3-force"
import { scaleLinear } from 'd3-scale';
import { SimulationNodeDatum } from 'd3-force';

interface MyNode extends SimulationNodeDatum {
  id: string;
  name: string;
  avgLogReturn: number;
  // Add other custom properties if needed
}

const CorailationPath = () => {
    const fgRef = useRef<ForceGraphMethods<NodeObject<MyNode>, LinkObject<MyNode, { avarageCorilation?: number }>> | undefined>(undefined);

    useEffect(() => {
      if (fgRef.current) {
        // Calculate the min and max avgLogReturn from your data
        const minReturn = Math.min(...graphData.nodes.map(d => d.avgLogReturn ?? 0));
        const maxReturn = Math.max(...graphData.nodes.map(d => d.avgLogReturn ?? 0));
  
        // Create a linear scale mapping avgLogReturn to an x-coordinate range
        const scaleX = scaleLinear()
          .domain([minReturn, maxReturn])
          .range([-800 / 2, 800 / 2]);
  
        // Add a custom force to position nodes along the x-axis based on avgLogReturn
        fgRef.current.d3Force(
            'x',
            d3.forceX((node: SimulationNodeDatum) => {
              const customNode = node as MyNode;
              return scaleX(customNode.avgLogReturn ?? 0);
            }).strength(0.1) // Decreased strength to make low magnitude forces irrelevant
          );
  
        // Optionally, add a force to keep nodes aligned horizontally
        fgRef.current.d3Force('y', d3.forceY(0).strength(0.05)); // Decreased strength to make low magnitude forces irrelevant
      }
    }, [800, 800]);
  
    return (
        <div className="flex w-screen">
            <div className="rounded-md border m-auto" >
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    linkColor={(link) => link.avarageCorilation! > 0 ? 'rgba(255,255,255,0.2)': 'rgba(255,0,0,0.2)'}
                    d3VelocityDecay={0.1} // Decreased decay
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const customNode = node as MyNode;
                        const size = 5 + customNode.avgLogReturn * 5; // Increased scaling factor to make nodes bigger
                        ctx.beginPath();
                        ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'rgba(31, 119, 180, 0.6)';
                        ctx.fill();
                        ctx.strokeStyle = 'rgba(31, 119, 180, 1)';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }}
                />	
            </div>
        </div>
    );
};

export default CorailationPath;
