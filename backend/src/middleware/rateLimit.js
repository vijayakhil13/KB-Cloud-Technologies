const { RateLimiterMemory } = require('rate-limiter-flexible');

/**
 * Express middleware factory. Key = IP (+ body.email when keyByEmail).
 * Responds 429 { error, code: 'RATE_LIMITED' } with Retry-After.
 */
function rateLimit({ points, durationSec, keyByEmail = false, name = 'rl' }) {
  const limiter = new RateLimiterMemory({ points, duration: durationSec, keyPrefix: name });
  return async (req, res, next) => {
    const email = keyByEmail && req.body && typeof req.body.email === 'string'
      ? req.body.email.trim().toLowerCase() : '';
    try {
      await limiter.consume(`${req.ip}|${email}`);
      next();
    } catch (rej) {
      if (rej instanceof Error) return next(rej);
      res.set('Retry-After', String(Math.ceil(rej.msBeforeNext / 1000) || 1));
      res.status(429).json({ error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' });
    }
  };
}

module.exports = { rateLimit };
