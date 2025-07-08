const redis = require("redis");

let redisConn;
if (process.env.NODE_ENV !== "production") {
    redisConn = {
        socket: {
            host: process.env.REDIS_HOST || "localhost",
            port: parseInt(process.env.REDIS_PORT) || 6379,
        },
    };
} else {
    redisConn = {
        socket: {
            host: process.env.REDIS_HOST || "localhost",
            port: parseInt(process.env.REDIS_PORT) || 6379,
        },
        password: process.env.REDIS_PASSWORD,
    };
}

const redisClient = redis.createClient(redisConn);

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

module.exports = { redisClient };
