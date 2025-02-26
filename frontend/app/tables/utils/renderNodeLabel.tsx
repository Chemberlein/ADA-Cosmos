import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { GraphNode } from '../types';

export function renderNodeLabel(node: GraphNode) {
  return ReactDOMServer.renderToStaticMarkup(
    <table className="border-collapse text-center">
      <tbody>
        <tr>
          <td colSpan={2} className="p-2 font-bold border border-gray-300">
            {node.name}
          </td>
        </tr>
        <tr>
          <td className="p-2 border border-gray-300">Price</td>
          <td className="p-2 border border-gray-300">
            {node.price?.toLocaleString() || 'N/A'}
          </td>
        </tr>
        <tr>
          <td className="p-2 border border-gray-300">Liquidity</td>
          <td className="p-2 border border-gray-300">
            {node.liquidity?.toLocaleString() || 'N/A'}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
