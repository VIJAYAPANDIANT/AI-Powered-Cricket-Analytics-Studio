import { Request, Response, NextFunction } from 'express';

interface RequestLog {
  timestamps: number[];
}

const apiRequestLogs = new Map<string, RequestLog>();
const uploadRequestLogs = new Map<string, RequestLog>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_API_REQUESTS = 100;
const MAX_UPLOAD_REQUESTS = 5;

const cleanOldTimestamps = (timestamps: number[], now: number): number[] => {
  return timestamps.filter(ts => now - ts < WINDOW_MS);
};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  let log = apiRequestLogs.get(ip) || { timestamps: [] };
  log.timestamps = cleanOldTimestamps(log.timestamps, now);
  log.timestamps.push(now);
  apiRequestLogs.set(ip, log);

  if (log.timestamps.length > MAX_API_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many API requests from this IP. Please try again after 15 minutes.'
    });
  }

  next();
};

export const uploadRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  let log = uploadRequestLogs.get(ip) || { timestamps: [] };
  log.timestamps = cleanOldTimestamps(log.timestamps, now);
  log.timestamps.push(now);
  uploadRequestLogs.set(ip, log);

  if (log.timestamps.length > MAX_UPLOAD_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Upload limit exceeded. Max 5 dataset uploads allowed every 15 minutes.'
    });
  }

  next();
};
