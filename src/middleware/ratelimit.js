import { redisClient } from "../redis.js";

const rateLimiter = async (req, res, next) => {
    try {
        // const ip = req.ip; //  req.headers["x-forwarded-for"]
         const { email } = req.body;
        // const key = `rate_limit:${ip}`;
        
         const key = `ratelimit:${email}`;
        const requests = await redisClient.incr(key);

      
        if (requests === 1) {
            await redisClient.expire(key, 60); // 60 seconds
        }

        // 5 requests per minute
        if (requests > 5) {
            const ttl = await redisClient.ttl(key);

            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later.",
                retryAfter: ttl
            });
        }

        next();

    } catch (err) {
        console.error(err);
        next(); // Redis down ho to app band na ho
    }
};

export default rateLimiter;
