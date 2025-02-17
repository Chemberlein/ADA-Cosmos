import { useState, useEffect } from "react";

interface ApiState<T> {
	data: T | null;
	loading: boolean;
	error: string;
}

/**
 * A generic hook to fetch data using a provided async function.
 * @param apiCall - The async function that returns data.
 * @param dependencies - Dependency array to control re-fetching.
 */
export function useApi<T>(
	apiCall: () => Promise<T>,
	dependencies: any[] = []
): ApiState<T> {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		setLoading(true);
		apiCall()
			.then((result) => {
				setData(result);
				setError("");
			})
			.catch((err: any) => {
				setError(err.message || "An error occurred");
			})
			.finally(() => {
				setLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	return { data, loading, error };
}
