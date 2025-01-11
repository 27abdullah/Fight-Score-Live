const fslSchema = require("../model/fsl.model");

const persist = async (req, res) => {
    try {
        const example = new fslSchema({ fighterA: "test" });
        await example.save();
        res.status(201).json(example);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

let gameState = null;
let io = null;
let redisClient = null;
function setupModRoutes(gs, socket, rc) {
    gameState = gs;
    io = socket;
    redisClient = rc;
}

const wait = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

const incRound = async (req, res) => {
    if (gameState.currentRound >= gameState.totalRounds + 1) {
        console.log("Fight over");
        res.json({ result: "Fight over" });
        return;
    }

    gameState.incRound();
    result = io.emit("incRound");
    await wait(2);
    console.log(`${gameState.id}/${gameState.currentRound - 1}`);
    stats = {
        statsA: await redisClient.get(
            `${gameState.id}/${gameState.currentRound - 1}/A`
        ),
        statsB: await redisClient.get(
            `${gameState.id}/${gameState.currentRound - 1}/B`
        ),
        round: gameState.currentRound - 1,
    };
    io.emit(`stats/${gameState.currentRound - 1}`, stats);
    res.json({ result, stats });
};

const test = async (req, res) => {
    res.json({ message: "Test" });
};

module.exports = { persist, incRound, test, setupModRoutes };
