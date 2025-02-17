export abstract class BaseApiService {
	protected baseUrl: string;
	protected apiKey?: string;

	constructor(baseUrl: string, apiKey?: string) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
	}

	/**
	 * Builds the full URL using the proxy.
	 * All endpoints will be sent through the proxy.
	 */
	protected buildUrl(
		endpoint: string,
		queryParams?: Record<string, any>
	): string {
		// Construct the proxy URL using the provided base URL
		const url = new URL(this.baseUrl, window.location.origin);

		// Append the actual API endpoint as a query parameter named "endpoint"
		url.searchParams.append(
			"endpoint",
			endpoint.startsWith("/") ? endpoint.substring(1) : endpoint
		);

		// Append any additional query parameters
		if (queryParams) {
			Object.keys(queryParams).forEach((key) => {
				const value = queryParams[key];
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}
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
