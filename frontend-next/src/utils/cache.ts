/**
 * Intelligent caching system for BlockBase
 * Advanced cache management with TTL, invalidation, and optimization
 */

export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface CacheConfig {
  maxSize: number
  defaultTTL: number
  cleanupInterval: number
  enableCompression: boolean
  enableEncryption: boolean
}

export interface CacheStats {
  hits: number
  misses: number
  evictions: number
  size: number
  hitRate: number
  memoryUsage: number
}

class IntelligentCache {
  private cache = new Map<string, CacheEntry>()
  private config: CacheConfig
  private stats: CacheStats
  private cleanupTimer?: NodeJS.Timeout

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      enableCompression: false,
      enableEncryption: false,
      ...config
    }

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      hitRate: 0,
      memoryUsage: 0
    }

    this.startCleanupTimer()
  }

  // Set cache entry
  set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number
      tags?: string[]
      priority?: 'low' | 'medium' | 'high' | 'critical'
    } = {}
  ): void {
    const { ttl = this.config.defaultTTL, tags = [], priority = 'medium' } = options

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      tags,
      priority
    }

    // Check if we need to evict entries
    if (this.cache.size >= this.config.maxSize) {
      this.evictEntries()
    }

    this.cache.set(key, entry)
    this.updateStats()
  }

  // Get cache entry
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      this.stats.misses++
      this.updateStats()
      return null
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key)
      this.stats.misses++
      this.updateStats()
      return null
    }

    // Update access info
    entry.accessCount++
    entry.lastAccessed = Date.now()
    this.stats.hits++
    this.updateStats()

    return entry.data
  }

  // Get or set pattern
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: {
      ttl?: number
      tags?: string[]
      priority?: 'low' | 'medium' | 'high' | 'critical'
    }
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    this.set(key, data, options)
    return data
  }

  // Check if entry exists and is valid
  has(key: string): boolean {
    const entry = this.cache.get(key)
    return entry !== undefined && !this.isExpired(entry)
  }

  // Delete specific entry
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Clear all entries
  clear(): void {
    this.cache.clear()
    this.updateStats()
  }

  // Invalidate by tags
  invalidateByTags(tags: string[]): number {
    let invalidated = 0
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key)
        invalidated++
      }
    }
    this.updateStats()
    return invalidated
  }

  // Invalidate by pattern
  invalidateByPattern(pattern: RegExp): number {
    let invalidated = 0
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
        invalidated++
      }
    }
    this.updateStats()
    return invalidated
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats }
  }

  // Get cache size
  getSize(): number {
    return this.cache.size
  }

  // Get all keys
  getKeys(): string[] {
    return Array.from(this.cache.keys())
  }

  // Get entries by tag
  getByTag(tag: string): Array<{ key: string; entry: CacheEntry }> {
    const results: Array<{ key: string; entry: CacheEntry }> = []
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        results.push({ key, entry })
      }
    }
    return results
  }

  // Warm up cache
  async warmUp(entries: Array<{ key: string; fetcher: () => Promise<any>; options?: any }>): Promise<void> {
    const promises = entries.map(async ({ key, fetcher, options }) => {
      try {
        const data = await fetcher()
        this.set(key, data, options)
      } catch (error) {
        console.warn(`Failed to warm up cache for key: ${key}`, error)
      }
    })

    await Promise.all(promises)
  }

  // Private methods
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  private evictEntries(): void {
    const entries = Array.from(this.cache.entries())
    
    // Sort by priority and access patterns
    entries.sort(([, a], [, b]) => {
      // Critical entries never get evicted
      if (a.priority === 'critical') return 1
      if (b.priority === 'critical') return -1

      // Calculate eviction score (lower is better)
      const scoreA = this.calculateEvictionScore(a)
      const scoreB = this.calculateEvictionScore(b)

      return scoreA - scoreB
    })

    // Evict 10% of entries
    const toEvict = Math.ceil(entries.length * 0.1)
    for (let i = 0; i < toEvict; i++) {
      const [key] = entries[i]
      this.cache.delete(key)
      this.stats.evictions++
    }
  }

  private calculateEvictionScore(entry: CacheEntry): number {
    const age = Date.now() - entry.timestamp
    const timeSinceLastAccess = Date.now() - entry.lastAccessed
    const accessFrequency = entry.accessCount / Math.max(age, 1)

    // Lower score = more likely to be evicted
    return (
      (timeSinceLastAccess / 1000) * 0.4 + // Time since last access
      (1 / Math.max(accessFrequency, 0.001)) * 0.3 + // Inverse of access frequency
      (age / 1000) * 0.2 + // Age
      (entry.priority === 'low' ? 0 : entry.priority === 'medium' ? 1 : 2) * 0.1 // Priority
    )
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  private cleanup(): void {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      this.updateStats()
    }
  }

  private updateStats(): void {
    this.stats.size = this.cache.size
    this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    
    // Estimate memory usage
    let memoryUsage = 0
    for (const entry of this.cache.values()) {
      memoryUsage += JSON.stringify(entry).length * 2 // Rough estimate
    }
    this.stats.memoryUsage = memoryUsage
  }

  // Cleanup on destroy
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.cache.clear()
  }
}

// Singleton instance
export const cache = new IntelligentCache({
  maxSize: 500,
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  cleanupInterval: 2 * 60 * 1000, // 2 minutes
  enableCompression: true
})

// React hook for cache
export function useCache() {
  return {
    get: cache.get.bind(cache),
    set: cache.set.bind(cache),
    getOrSet: cache.getOrSet.bind(cache),
    has: cache.has.bind(cache),
    delete: cache.delete.bind(cache),
    clear: cache.clear.bind(cache),
    invalidateByTags: cache.invalidateByTags.bind(cache),
    invalidateByPattern: cache.invalidateByPattern.bind(cache),
    getStats: cache.getStats.bind(cache),
    getSize: cache.getSize.bind(cache),
    getKeys: cache.getKeys.bind(cache),
    getByTag: cache.getByTag.bind(cache),
    warmUp: cache.warmUp.bind(cache)
  }
}

// Cache decorator for functions
export function cached(
  ttl: number = 5 * 60 * 1000,
  tags: string[] = [],
  priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const key = `${target.constructor.name}.${propertyName}.${JSON.stringify(args)}`
      
      const cached = cache.get(key)
      if (cached !== null) {
        return cached
      }

      const result = await originalMethod.apply(this, args)
      cache.set(key, result, { ttl, tags, priority })
      return result
    }

    return descriptor
  }
}
