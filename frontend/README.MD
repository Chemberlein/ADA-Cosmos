# API Implementation Documentation

Our project follows a modular approach to manage API calls, ensuring maintainability, type safety, and clear separation of concerns. This documentation details the architecture, implementation, and usage patterns of our API integration with the TapTools API.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Proxy Layer](#1-proxy-layer)
3. [Service Layer](#2-service-layer)
4. [Interfaces & Type Safety](#3-interfaces--type-safety)
5. [Use of Generics](#4-use-of-generics)
6. [Caching Strategy](#5-caching-strategy)
7. [React Integration](#6-react-integration)
8. [Error Handling](#7-error-handling)
9. [Security Considerations](#8-security-considerations)
10. [Usage Examples](#9-usage-examples)
11. [Performance Optimization](#10-performance-optimization)

## Architecture Overview

The ADA Kosmos platform integrates with the TapTools API using a multi-layered architecture:

```
┌─────────────┐     ┌────────────┐     ┌──────────────┐     ┌──────────────┐
│ React       │     │ Service    │     │ Proxy        │     │ TapTools     │
│ Components  │────▶│ Layer      │────▶│ Layer        │────▶│ API          │
└─────────────┘     └────────────┘     └──────────────┘     └──────────────┘
       │                  │                   │                     │
       │                  │                   │                     │
       ▼                  ▼                   ▼                     ▼
┌─────────────┐     ┌────────────┐     ┌──────────────┐     ┌──────────────┐
│ React       │     │ TypeScript │     │ Server-side  │     │ External     │
│ Hooks       │     │ Interfaces │     │ Caching      │     │ Data Source  │
└─────────────┘     └────────────┘     └──────────────┘     └──────────────┘
```

This design ensures:

-   Clear separation of concerns
-   Type safety throughout the application
-   Secure handling of API keys
-   Efficient data access patterns
-   Optimized performance with caching

## 1. Proxy Layer

-   **Location:** `frontend/app/api/taptoolsProxy/route.ts`
-   **Purpose:**
    -   **Intermediary:** Acts as a proxy between the frontend and the external TAPTOOLS API.
    -   **CORS Management:** Handles CORS by setting the appropriate headers, allowing cross-origin requests.
    -   **Security:** Appends the API key and other environment-specific settings.
    -   **Request Forwarding:** Forwards requests to the actual API endpoint, preserving and appending query parameters.
    -   **Error Handling:** Logs errors and returns consistent error responses.

```typescript
// Example implementation
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const endpoint = searchParams.get("endpoint");

	if (!endpoint) {
		return NextResponse.json(
			{ error: "Endpoint not specified" },
			{ status: 400 }
		);
	}

	const API_BASE_URL = process.env.TAPTOOLS_BASE_URL;
	const API_KEY = process.env.TAPTOOLS_API_KEY;

	// Remove any trailing slashes from the base URL
	const baseUrl = API_BASE_URL?.replace(/\/+$/, "");
	const targetUrl = new URL(`${baseUrl}/${endpoint}`);

	// Append all query parameters except 'endpoint'
	searchParams.forEach((value, key) => {
		if (key !== "endpoint") {
			targetUrl.searchParams.append(key, value);
		}
	});

	try {
		const response = await fetch(targetUrl.toString(), {
			headers: {
				"Content-Type": "application/json",
				"x-api-key": API_KEY || "",
			},
		});

		// Handle response and errors
		if (!response.ok) {
			console.error(
				`Fetch error: ${
					response.status
				} for URL ${targetUrl.toString()}`
			);
			return NextResponse.json(
				{ error: `Request failed with status ${response.status}` },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data, {
			headers: { "Access-Control-Allow-Origin": "*" },
		});
	} catch (error: any) {
		console.error("Fetch exception:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
```

## 2. Service Layer

-   **Location:** `frontend/services/` directory containing various service classes
-   **Purpose:**
    -   **Encapsulation:** Wraps all API endpoints in dedicated service classes.
    -   **Interface Implementation:** Each service implements a corresponding interface.
    -   **Endpoint Methods:** Provides methods that directly correspond to API endpoints.
    -   **Generic Request Handler:** Uses a generic `request<T>` method to uniformly handle API calls.

### Base API Service

The foundation of our service layer is the `BaseApiService` abstract class:

```typescript
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
		this.origin =
			origin ||
			(typeof window !== "undefined"
				? window.location.origin
				: process.env.NEXT_PUBLIC_HOST || "http://localhost:3000");
	}

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

		return url.toString();
	}

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
```

### Specialized Service Classes

We implement multiple specialized services that extend the base service:

-   **MarketTokensApiService**: For token market data
-   **NftApiService**: For NFT-related data
-   **WalletApiService**: For wallet portfolio data
-   **OnchainApiService**: For on-chain blockchain data
-   **MetricsApiService**: For market metrics and statistics

Example implementation from `MarketTokensApiService.ts`:

```typescript
export class MarketTokensApiService
	extends BaseApiService
	implements IMarketTokensApi
{
	async getTokenHolders(unit: string): Promise<TokenHoldersResponse> {
		return this.request<TokenHoldersResponse>("/token/holders", {
			queryParams: { unit },
		});
	}

	async getTopTokenHolders(
		unit: string,
		page: number = 1,
		perPage: number = 20
	): Promise<TopTokenHolder[]> {
		return this.request<TopTokenHolder[]>("/token/holders/top", {
			queryParams: { unit, page, perPage },
		});
	}

	// Other methods...
}
```

## 3. Interfaces & Type Safety

-   **Location:** `frontend/interfaces/` directory organized by domain
-   **Purpose:**
    -   **Structured Data:** Defines clear TypeScript interfaces for API responses and request parameters.
    -   **Contract Enforcement:** Service interfaces outline methods and expected return types.
    -   **Type Safety:** Reduces runtime errors by leveraging TypeScript's static type checking.

Example interfaces:

```typescript
// From interfaces/tokens/index.ts
export interface TokenHoldersResponse {
	holders: number;
}

export interface TopTokenHolder {
	address: string;
	amount: number;
}

export interface TokenMarketCapResponse {
	circSupply: number;
	fdv: number;
	mcap: number;
	price: number;
	ticker: string;
	totalSupply: number;
}

// Service interface from interfaces/tokens/IMarketTokensApi.ts
export interface IMarketTokensApi {
	getTokenHolders(unit: string): Promise<TokenHoldersResponse>;
	getTopTokenHolders(
		unit: string,
		page?: number,
		perPage?: number
	): Promise<TopTokenHolder[]>;
	getTokenMarketCap(unit: string): Promise<TokenMarketCapResponse>;
	// Other methods...
}
```

## 4. Use of Generics

-   **Where:** Inside the `BaseApiService` class and React hooks
-   **Purpose:**
    -   **Flexibility:** The `request<T>` method uses generics to return the expected data type for different API calls.
    -   **Reusability:** This approach avoids duplication, allowing a single method to handle various response types safely.
    -   **Type Inference:** Ensures that each API method returns data matching the defined interfaces.

```typescript
// Generic request method
protected async request<T>(
  endpoint: string,
  options: {
    method?: string;
    queryParams?: Record<string, any>;
    body?: any;
  } = {}
): Promise<T> {
  // Implementation details...
  return response.json();
}

// Usage example
async getTokenMarketCap(unit: string): Promise<TokenMarketCapResponse> {
  return this.request<TokenMarketCapResponse>('/token/mcap', {
    queryParams: { unit },
  });
}
```

## 5. Caching Strategy

-   **Location:** `frontend/services/serverCache.ts`
-   **Purpose:**
    -   **Performance:** Reduces redundant API calls for frequently accessed data.
    -   **User Experience:** Improves response times for common requests.
    -   **API Quota Management:** Helps manage API rate limits by reducing call volume.

```typescript
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL!,
	token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function cacheCall<T>(
	key: string,
	fn: () => Promise<T>,
	ttl: number = 3600 * 1000
): Promise<T> {
	// If ttl is set to 0 or negative, treat it as infinite (no expiration)
	const hasExpiration = ttl > 0;
	try {
		const cachedValue = await redis.get<string>(key);
		if (cachedValue !== null) {
			console.log(`Cache hit for key: ${key}`);
			// Return cached value after parsing
			// ...
		}

		console.log(`Cache miss for key: ${key}. Making API call...`);
		const result = await fn();

		// Store result in cache
		// ...

		return result;
	} catch (error) {
		console.error(`Cache error for key: ${key}`, error);
		// Fallback to direct call if Redis fails
		return fn();
	}
}

export async function invalidateCache(key: string): Promise<void> {
	// Implementation details...
}
```

## 6. React Integration

-   **Location:** `frontend/hooks/useApi.ts`
-   **Purpose:**
    -   **Component Integration:** Seamlessly connects API services to React components.
    -   **State Management:** Handles loading, error, and data states.
    -   **Lifecycle Management:** Properly integrates with React's rendering lifecycle.

```typescript
import { useState, useEffect } from "react";

interface ApiState<T> {
	data: T | null;
	loading: boolean;
	error: string;
}

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
	}, dependencies);

	return { data, loading, error };
}
```

Usage in a component:

```tsx
function TokenComponent({ unit }) {
	const service = new MarketTokensApiService();

	const { data, loading, error } = useApi(
		() => service.getTokenMarketCap(unit),
		[unit]
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h2>{data.ticker}</h2>
			<p>Market Cap: {data.mcap.toLocaleString()} ₳</p>
			<p>Price: {data.price.toLocaleString()} ₳</p>
		</div>
	);
}
```

## 7. Error Handling

Our API implementation features robust error handling at multiple levels:

1. **Proxy Layer:** Catches HTTP errors and logs detailed information
2. **Service Layer:** The `request` method in `BaseApiService` throws errors with status codes
3. **Hook Layer:** The `useApi` hook captures and exposes errors to components
4. **Caching Layer:** The `cacheCall` function handles cache-specific errors

```typescript
// Error handling in the proxy layer
if (!response.ok) {
	console.error(
		`Fetch error: ${response.status} for URL ${targetUrl.toString()}`
	);
	return NextResponse.json(
		{ error: `Request failed with status ${response.status}` },
		{ status: response.status }
	);
}

// Error handling in the service layer
if (!response.ok) {
	throw new Error(`Request failed with status ${response.status}`);
}

// Error handling in the React hook
apiCall().catch((err: any) => {
	setError(err.message || "An error occurred");
});
```

## 8. Security Considerations

Our API implementation includes several security features:

-   **API Key Protection:** Keys are stored as environment variables and never exposed to the client
-   **CORS Management:** Proper CORS headers in the proxy layer
-   **Input Validation:** Validating and sanitizing parameters before use
-   **Error Handling:** Preventing sensitive information leakage in error messages

## 9. Usage Examples

### Direct Service Usage

```typescript
import { MarketTokensApiService } from "@/services/MarketTokensApiService";

async function fetchTokenData(unit: string) {
	const service = new MarketTokensApiService();
	try {
		const marketCap = await service.getTokenMarketCap(unit);
		const holders = await service.getTokenHolders(unit);
		return { marketCap, holders };
	} catch (error) {
		console.error("Error fetching token data:", error);
		throw error;
	}
}
```

### React Component Integration

```tsx
import { useApi } from "@/hooks/useApi";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";

function TokenDetails({ unit }) {
	const service = new MarketTokensApiService();

	const { data, loading, error } = useApi(
		() => service.getTokenMarketCap(unit),
		[unit]
	);

	if (loading) return <div>Loading token details...</div>;
	if (error) return <div>Error loading token: {error}</div>;
	if (!data) return <div>No token data available</div>;

	return (
		<div className="token-card">
			<h2>{data.ticker}</h2>
			<div className="token-stats">
				<div className="stat">
					<span className="label">Market Cap:</span>
					<span className="value">
						{data.mcap.toLocaleString()} ₳
					</span>
				</div>
				<div className="stat">
					<span className="label">Price:</span>
					<span className="value">
						{data.price.toLocaleString()} ₳
					</span>
				</div>
				<div className="stat">
					<span className="label">Circulating Supply:</span>
					<span className="value">
						{data.circSupply.toLocaleString()}
					</span>
				</div>
			</div>
		</div>
	);
}
```

### Server-Side Data Fetching with Caching

```typescript
import { cacheCall } from "@/services/serverCache";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";

export async function fetchTopTokens() {
	const service = new MarketTokensApiService();

	return await cacheCall(
		"topTokens:marketCap",
		async () => service.getTopMarketCapTokens("mcap", 1, 10),
		3600 * 1000 // 1 hour TTL
	);
}
```

## 10. Performance Optimization

Our API implementation includes several performance optimizations:

-   **Caching:** Server-side caching with configurable TTL
-   **Request Batching:** Where appropriate, batch multiple requests into one
-   **Pagination:** Support for paginated data fetching to limit response size
-   **Minimal Data:** Request only the fields needed for each use case
-   **Component Optimization:** Prevent unnecessary re-renders with proper dependency arrays

### Caching Implementation

```typescript
// Example usage of caching for dashboard data
export async function getDashboardData() {
	return await cacheCall(
		"dashboard:mainMetrics",
		async () => {
			const metricsService = new MetricsApiService();
			const tokensService = new MarketTokensApiService();

			const [marketStats, topTokens] = await Promise.all([
				metricsService.getMarketStats(),
				tokensService.getTopMarketCapTokens("mcap", 1, 10),
			]);

			return { marketStats, topTokens };
		},
		300 * 1000 // 5 minute TTL for frequently changing data
	);
}
```
