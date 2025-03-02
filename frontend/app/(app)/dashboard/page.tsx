export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { FetchTokensData } from "./components/data/FetchTokensData";
import { default as importDynamic } from "next/dynamic";

// Create a loading placeholder
const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen w-full bg-black text-white">
        <div className="text-center">
            <div className="text-xl mb-2">Initializing Cardano Dashboard</div>
            <div className="animate-pulse text-sm opacity-75">
                Loading market data...
            </div>
        </div>
    </div>
);

// Dynamically import with code splitting
const FocusGraphWrapper = importDynamic(
    () => import("./components/FocusGraphWrapper"),
    {
        ssr: false,
        loading: () => <LoadingFallback />,
    }
);

export default async function Dashboard() {
    // This fetch will run on the server and trigger your cacheCall logs
    const data = await FetchTokensData();
    return (
        <main className="min-h-screen w-full">
            <Suspense fallback={<LoadingFallback />}>
                <FocusGraphWrapper data={data} />
            </Suspense>
        </main>
    );
}