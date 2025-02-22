import { FetchTokensData } from "./components/fetchTokensData";
import FocusGraphWrapper from "./components/FocusGraphWrapper";

export default async function Dashboard() {
	// This fetch will run on the server and trigger your cacheCall logs.
	const data = await FetchTokensData();

	return (
		<main className="overflow-hidden">
			<FocusGraphWrapper data={data} />
		</main>
	);
}