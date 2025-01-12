const redis = require("redis");

const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

const getRoundStats = async (gameState) => {
    stats = {
        statsA: await redisClient.get(
            `${gameState.id}/${gameState.currentRound - 1}/A`
        ),
        statsB: await redisClient.get(
            `${gameState.id}/${gameState.currentRound - 1}/B`
        ),
        round: gameState.currentRound - 1,
    };
    return stats;
};

const clearRounds = async (gameState, completedRounds) => {
    const keys = (fighter) =>
        Array.from(
            { length: completedRounds },
            (_, i) => `${gameState.id}/${i + 1}/${fighter}`
        );

    const fighterAKeys = keys("A");
    const fighterBKeys = keys("B");

    await Promise.all(fighterAKeys.map(async (key) => redisClient.del(key)));
    await Promise.all(fighterBKeys.map(async (key) => redisClient.del(key)));
};

module.exports = { redisClient, getRoundStats, clearRounds };
