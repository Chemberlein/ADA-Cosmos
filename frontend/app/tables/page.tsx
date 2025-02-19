'use client';

import { Token } from "@clerk/nextjs/server";
import TopTokenHolders from "./tokens";

export default function Dashboard() {
  return (
    <main className="overflow-hidden">
      <TopTokenHolders />
    </main>
  );
}
