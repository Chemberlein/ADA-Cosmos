export abstract class BaseApiService {
	protected baseUrl: string;
	protected apiKey?: string;
	protected origin: string;

	constructor(
		baseUrl: string = process.env.NEXT_PUBLIC_TAPTOOLS_PROXY_URL!,
		apiKey: string = process.env.TAPTOOLS_API_KEY!,
		origin?: string
	) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
		// If an origin is provided, use it; otherwise, determine based on environment.
		this.origin =
			origin ||
			(typeof window !== "undefined"
				? window.location.origin
				: process.env.NEXT_PUBLIC_HOST || "http://localhost:3000");
	}

	/**
	 * Builds the full URL using the proxy.
	 * This works in both client and server environments.
	 */
	protected buildUrl(
		endpoint: string,
		queryParams?: Record<string, any>
	): string {
		const url = new URL(this.baseUrl, this.origin);

		// Append the API endpoint as a query parameter
		url.searchParams.append(
			"endpoint",
			endpoint.startsWith("/") ? endpoint.substring(1) : endpoint
		);

		if (queryParams) {
			Object.keys(queryParams).forEach((key) => {
				const value = queryParams[key];
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}

		// Debug: log the constructed URL
		console.log(`Constructed URL: ${url.toString()}`);
		return url.toString();
	}

	/**
	 * Generic request method used by all API services.
	 */
	protected async request<T>(
		endpoint: string,
		options: {
			method?: string;
			queryParams?: Record<string, any>;
			body?: any;
		} = {}
	): Promise<T> {
		const { method = "GET", queryParams, body } = options;
		const url = this.buildUrl(endpoint, queryParams);

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (this.apiKey) {
			headers["x-api-key"] = this.apiKey;
		}

		const response = await fetch(url, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		return response.json();
	}
}
