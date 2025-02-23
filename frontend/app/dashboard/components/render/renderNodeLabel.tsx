import ReactDOMServer from 'react-dom/server';
import React from 'react';

export function renderNodeLabel(node: any) {
  if (node.id === 'sun') {
    return ReactDOMServer.renderToStaticMarkup(
      <table className="border-collapse text-center">
        <tbody>
          <tr>
            <td colSpan={2} className="p-2 font-bold border border-gray-300">
              ADA Market Data
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">ADA Price</td>
            <td className="p-2 border border-gray-300">
              ${node.marketData?.adaPrice?.toFixed(3) || 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">24H DEX Volume</td>
            <td className="p-2 border border-gray-300">
              ₳{node.marketData?.dexVolume?.toLocaleString() || 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">24H NFT Volume</td>
            <td className="p-2 border border-gray-300">
              ₳{node.marketData?.nftVolume?.toLocaleString() || 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">24H Active Addresses</td>
            <td className="p-2 border border-gray-300">
              {node.marketData?.activeAddresses?.toLocaleString() || 'N/A'}
            </td>
          </tr>
        </tbody>
      </table>
    );
  } else {
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
              ${node.mcap.toLocaleString()} ₳
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
