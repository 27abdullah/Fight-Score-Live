const fslSchema = require("../model/fsl.model");
const { connectDatabase, persist } = require("../config/mongodb");
const wait = require("../utils");
const { redisClient, getRoundStats, clearRounds } = require("../config/redis");

let gameState = null;
let io = null;

function setupModRoutes(gs, socket) {
    gameState = gs;
    io = socket;
}

const incRound = async (req, res) => {
    if (gameState.currentRound >= gameState.totalRounds + 1) {
        res.json({ result: "Fight over" });
        return;
    }

    gameState.incRound();
    const result = io.emit("incRound");
    await wait(1);
    const stats = await getRoundStats(gameState);
    console.log(stats);
    io.emit(`stats/${gameState.currentRound - 1}`, stats);

    if (gameState.currentRound == gameState.totalRounds + 1) {
        const outcome = await persist(gameState, redisClient);
        clearRounds(gameState, gameState.totalRounds); //TODO
        res.json({ result, stats, outcome });
        return;
    }

    res.json({ result, stats });
};

const test = async (req, res) => {
    res.json({ message: "Test" });
};

module.exports = { incRound, test, setupModRoutes };
