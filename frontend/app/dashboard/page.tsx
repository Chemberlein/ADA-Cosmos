import TokenById from "./components/tokenInfo";
import TopTokenHolders from "./components/tokens";

export default function Dashboard() {
	return (
		<main className="p-8 mx-2 xl:mx-40">
			<h1 className="text-3xl md:text-5xl pb-4 text-center">Dashboard</h1>
			<TopTokenHolders />
			<TokenById />
		</main>
	);
}
