'use client';

import { Token } from "@clerk/nextjs/server";
import OHLCTable from "./tokens";
import TopLiquidityTokens from "./tokensLiquidity";
import CorilationPath from "./graph";

export default function Dashboard() {
  return (
    <main className="overflow-hidden">
      <CorilationPath />
    </main>
  );
}
