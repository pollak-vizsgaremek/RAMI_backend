import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

dotenv.config();

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10); // default 1 hour
const maxPerIp = parseInt(process.env.RATE_LIMIT_MAX_IP || '100', 10); // default 100 requests per window per IP

// Redis store support was removed; middleware uses the default in-memory store.
// If you later want Redis-backed limiting, reinstall `ioredis` and `rate-limit-redis`
// and update this file to initialize the store when `REDIS_URL` is present.

export const authIpRateLimiter = rateLimit({
  windowMs,
  max: maxPerIp,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ message: 'Too many requests from this IP, please try again later.' });
  },
});

export default authIpRateLimiter;
