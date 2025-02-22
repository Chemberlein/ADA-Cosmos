import { FetchTokensData } from './components/data/FetchTokensData';
import FocusGraphWrapper from './components/FocusGraphWrapper';

export default async function Dashboard() {
  // This fetch will run on the server and trigger your cacheCall logs.
  const data = await FetchTokensData();

  return (
    <main className="min-h-screen w-full">
      <FocusGraphWrapper data={data} />
    </main>
  );
}
