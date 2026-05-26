import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  contentType: string;
  expiry: number;
}

const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const cacheKey = req.originalUrl;
  const now = Date.now();
  const cached = apiCache.get(cacheKey);

  // Cache hit
  if (cached && now < cached.expiry) {
    console.log(`[Cache Hit] Serving cached response for: ${cacheKey}`);
    res.setHeader('Content-Type', cached.contentType);
    res.setHeader('X-Cache', 'HIT');
    return res.send(cached.data);
  }

  // Cache miss - override res.send to intercept and capture response payload
  const originalSend = res.send;
  res.send = function (body: any): Response {
    const contentType = res.getHeader('Content-Type') as string;
    
    // Only cache successful JSON or spreadsheet data transfers
    if (res.statusCode === 200 && contentType && (contentType.includes('json') || contentType.includes('text'))) {
      apiCache.set(cacheKey, {
        data: body,
        contentType,
        expiry: Date.now() + CACHE_TTL_MS
      });
    }

    return originalSend.call(this, body);
  };

  next();
};

// Helper to flush cache when new datasets are uploaded
export const flushCache = () => {
  apiCache.clear();
  console.log('[Cache] Flushed all cached queries due to dataset ingestion update.');
};
