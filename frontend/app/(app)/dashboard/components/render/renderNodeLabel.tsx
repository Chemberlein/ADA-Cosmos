// app/(app)/dashboard/components/render/renderNodeLabel.tsx
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
              {node.marketData?.adaPrice?.toFixed(3) || 'N/A'} $
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">24H DEX Volume</td>
            <td className="p-2 border border-gray-300">
              {node.marketData?.dexVolume?.toLocaleString() || 'N/A'} ₳
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">24H NFT Volume</td>
            <td className="p-2 border border-gray-300">
              {node.marketData?.nftVolume?.toLocaleString() || 'N/A'} ₳
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
  } else if (node.id.startsWith('wallet-')) {
    // Wallet node label
    return ReactDOMServer.renderToStaticMarkup(
      <table className="border-collapse text-center">
        <tbody>
          <tr>
            <td colSpan={2} className="p-2 font-bold border border-gray-300 bg-amber-700/50">
              Wallet Explorer
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">Address</td>
            <td className="p-2 border border-gray-300">
              {node.address.substring(0, 12)}...{node.address.substring(node.address.length - 8)}
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
              ${node.ticker}
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">Mcap</td>
            <td className="p-2 border border-gray-300">
              {node.mcap.toLocaleString()} ₳
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}