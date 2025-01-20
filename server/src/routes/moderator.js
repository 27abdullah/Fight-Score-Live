const fslSchema = require("../model/fsl.model");
const { connectDatabase, persist } = require("../config/mongodb");
const wait = require("../utils");
const { redisClient, getRoundStats, clearRounds } = require("../config/redis");

let card = null;
let io = null;

function setupModRoutes(c, socket) {
    card = c;
    io = socket;
}

const incRound = async (req, res) => {
    const gameState = card.getCurrentFight();
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
        res.json({ result, stats, outcome });
        return;
    }

    res.json({ result, stats });
};

const nextFight = (req, res) => {
    const oldState = card.getCurrentFight();
    clearRounds(oldState, oldState.totalRounds); //TODO
    const gameState = card.nextFight();
    if (gameState != null) {
        const state = gameState.objectify();
        state["clear"] = true;
        io.emit("init", state);
        res.json({ gameState: gameState.objectify() });
    } else {
        res.json({ message: "No more fights" });
    }
};

const update = async (req, res) => {
    const gameState = card.getCurrentFight();
    const state = gameState.objectify();
    state["clear"] = true;
    io.emit("init", state);
    res.json({ gameState: gameState.objectify });
};

const test = async (req, res) => {
    res.json({ message: "Test" });
};

module.exports = { incRound, test, setupModRoutes, nextFight, update };
