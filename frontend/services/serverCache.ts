// A simple in-memory cache. In production consider using a shared cache (e.g. Redis)
interface CacheItem<T> {
	value: T;
	expiry: number;
}

class Cache {
	private store = new Map<string, CacheItem<any>>();

	get<T>(key: string): T | undefined {
		const item = this.store.get(key);
		if (!item) return undefined;
		if (Date.now() > item.expiry) {
			this.store.delete(key);
			return undefined;
		}
		return item.value as T;
	}

	set<T>(key: string, value: T, ttl: number): void {
		this.store.set(key, { value, expiry: Date.now() + ttl });
	}
}

export const cache = new Cache();

/**
 * Wraps any asynchronous function with caching.
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
	const cachedValue = cache.get<T>(key);
	if (cachedValue !== undefined) {
		console.log(`Cache hit for key: ${key}`);
		return cachedValue;
	}
	console.log(`Cache miss for key: ${key}. Making API call...`);
	const result = await fn();
	cache.set(key, result, ttl);
	return result;
}
