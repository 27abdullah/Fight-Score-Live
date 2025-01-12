const mongoose = require("mongoose");
const fslSchema = require("../model/fsl.model");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        // process.exit(1);
    }
};

const persist = async (gameState, redisClient) => {
    try {
        const keys = (fighter) =>
            Array.from(
                { length: gameState.totalRounds },
                (_, i) => `${gameState.id}/${i + 1}/${fighter}`
            );

        const fighterAKeys = keys("A");
        const fighterBKeys = keys("B");

        const statsA = await Promise.all(
            fighterAKeys.map(async (key) => redisClient.get(key))
        );
        const statsB = await Promise.all(
            fighterBKeys.map(async (key) => redisClient.get(key))
        );

        const fightOutcome = new fslSchema({
            fighterA: gameState.fighterA,
            fighterB: gameState.fighterB,
            id: gameState.id,
            outcome: gameState.outcome,
            sport: gameState.sport,
            totalRounds: gameState.totalRounds,
            stats: { statsA, statsB },
        });

        await fightOutcome.save();
        return fightOutcome;
    } catch (err) {
        console.log("Error:", err);
        return err;
    }
};

module.exports = { connectDatabase, persist };
