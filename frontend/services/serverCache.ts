import { Redis } from "@upstash/redis";

// Initialize the Upstash Redis client using your environment variables
const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL!,
	token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Wraps any asynchronous function with caching using Upstash Redis.
 *
 * @param key - A unique key for the cache.
 * @param fn - The async function to call if the cache is empty or expired.
 * @param ttl - Time to live in milliseconds (default is 1 hour).
 * @returns The cached result, or the new result from fn.
 */
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
			try {
				// Check if the value is already an object or needs parsing
				if (typeof cachedValue === "string") {
					return JSON.parse(cachedValue) as T;
				} else {
					// If it's already an object, just return it
					return cachedValue as unknown as T;
				}
			} catch (parseError) {
				console.error(
					`Error parsing cached JSON for key: ${key}`,
					parseError
				);
				// If the cached value is not valid JSON, invalidate it and proceed with a fresh call
				await invalidateCache(key);
			}
		}

		console.log(`Cache miss for key: ${key}. Making API call...`);
		const result = await fn();

		// Ensure we're not storing [object Object] directly
		// Proper stringification of the result object
		const serialized = JSON.stringify(result);

		// Check that we can parse the result back (validation step)
		try {
			JSON.parse(serialized);
		} catch (e) {
			console.error(
				`Cannot serialize result for key: ${key}. Skipping cache storage.`,
				e
			);
			return result;
		}

		// Set the cache with or without expiration based on ttl
		if (hasExpiration) {
			await redis.set(key, serialized, { ex: ttl / 1000 });
		} else {
			// Set without expiration for infinite TTL
			await redis.set(key, serialized);
		}
		return result;
	} catch (error) {
		console.error(`Cache error for key: ${key}`, error);
		// Fallback to direct call if Redis fails
		return fn();
	}
}

export async function invalidateCache(key: string): Promise<void> {
	try {
		await redis.del(key);
		console.log(`Cache invalidated for key: ${key}`);
	} catch (error) {
		console.error(`Error invalidating cache for key: ${key}`, error);
	}
}
