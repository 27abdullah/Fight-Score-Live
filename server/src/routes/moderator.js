const fslSchema = require("../model/fsl.model");
const { connectDatabase, persist } = require("../config/mongodb");
const wait = require("../utils");
const { redisClient, getRoundStats, clearRounds } = require("../config/redis");

let gameController = null;
let io = null;

function setupModRoutes(c, socket) {
    gameController = c;
    io = socket;
}

const incRound = async (req, res) => {
    const { id } = req.body;
    let gameState;
    if (gameController.hasId(id)) {
        gameState = gameController.getCard(id).getCurrentFight();
    } else {
        return;
    }

    if (gameState.currentRound >= gameState.totalRounds + 1) {
        res.json({ result: "Fight over" });
        return;
    }

    gameState.incRound();
    const result = io.to(id).emit("incRound");
    await wait(1);
    const stats = await getRoundStats(gameState);
    console.log(stats);
    io.to(id).emit(`stats/${gameState.currentRound - 1}`, stats);

    if (gameState.currentRound == gameState.totalRounds + 1) {
        const outcome = await persist(gameState, redisClient);
        res.json({ result, stats, outcome });
        return;
    }

    res.json({ result, stats });
};

const nextFight = (req, res) => {
    const { id } = req.body;
    let card;
    if (gameController.hasId(id)) {
        card = gameController.getCard(id);
    } else {
        return;
    }
    oldState = card.getCurrentFight();
    clearRounds(oldState, oldState.totalRounds); //TODO
    const gameState = card.nextFight();
    if (gameState != null) {
        const state = gameState.objectify();
        state["clear"] = true;
        io.to(id).emit("init", state);
        res.json({ gameState: gameState.objectify() });
    } else {
        res.json({ message: "No more fights" });
    }
};

const update = async (req, res) => {
    const { id } = req.body;
    let gameState;
    if (gameController.hasId(id)) {
        gameState = gameController.getCard(id).getCurrentFight();
    } else {
        return;
    }

    const state = gameState.objectify();
    state["clear"] = true;
    io.to(id).emit("init", state);
    res.json({ gameState: gameState.objectify });
};

const test = async (req, res) => {
    res.json({ message: "Test" });
};

const createCard = async (req, res) => {
    const { owner, name, fights } = req.body;
    id = gameController.createCard(owner, name, fights); // string, string, list [rounds, sport, fighterA, fighterB]
    res.json({ message: "Card created", id: id });
};

const logController = (req, res) => {
    res.json(gameController.jsonify());
};

module.exports = {
    incRound,
    test,
    setupModRoutes,
    nextFight,
    update,
    createCard,
    logController,
};
