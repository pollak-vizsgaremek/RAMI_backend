import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

dotenv.config();

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10);
const maxPerIp = parseInt(process.env.RATE_LIMIT_MAX_IP || '100', 10);



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
