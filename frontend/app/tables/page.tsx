'use client';

import { Token } from "@clerk/nextjs/server";
import OHLCTable from "./tokens";
import TopLiquidityTokens from "./tokensLiquidity";

export default function Dashboard() {
  return (
    <main className="overflow-hidden">
      <TopLiquidityTokens />
    </main>
  );
}
