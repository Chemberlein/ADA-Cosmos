import { cacheCall } from "@/services/serverCache";
import { getTokensData } from "./getTokensData";

export async function FetchTokensData() {
	return await cacheCall(
		"cardanoTokens:getData",
		async () => getTokensData(),
		0 // 0 for infinite TTL
		//3600 * 1000 // 1 hour TTL
	);
}
