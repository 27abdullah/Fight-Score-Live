const { wait, IN_PROGRESS, FINISHED } = require("../utils");

let gameController = null;
let io = null;

function setupModRoutes(c, socket) {
    gameController = c;
    io = socket;
}

const incRound = async (req, res) => {
    const { id } = req.body;
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ message: "Card not found" });
        return;
    }

    if (
        cardState.currentRound >= cardState.totalRounds + 1 ||
        cardState.state == FINISHED
    ) {
        res.json({ result: "Fight over" });
        return;
    }

    cardState.incRound();
    const result = io.to(id).emit("incRound");
    await wait(2);
    const stats = await cardState.getPrevRoundStats();
    console.log(stats);
    io.to(id).emit(`stats/${cardState.currentRound - 1}`, stats);

    res.json({ result, stats });
};

const finish = async (req, res) => {
    const { id, outcome } = req.body;
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ message: "Card not found" });
        return;
    }

    cardState.finish(outcome);
    res.json({ message: "Finished" });
};

const nextFight = async (req, res) => {
    const { id } = req.body;
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ message: "Card not found" });
        return;
    }

    if (await cardState.nextFight()) {
        const state = cardState.jsonify();
        io.to(id).emit("init", state);
        io.to(id).emit("clearStorage");
        res.json({ cardState: cardState.jsonify() });
    } else {
        res.json({
            message: "No more fights or current fight still in progress",
        });
    }
};

const endCard = async (req, res) => {
    const { id } = req.body;
    if (await gameController.endCard(id)) {
        io.to(id).emit("clearStorage");
        res.json({ message: "Cleaned up" });
    } else {
        res.json({ message: "Could not clean up" });
    }
};

const update = async (req, res) => {
    const { id } = req.body;
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ message: "Card not found" });
        return;
    }

    const state = cardState.jsonify();
    io.to(id).emit("init", state);
    io.to(id).emit("clearStorage");
    res.json({ cardState: state });
};

const test = async (req, res) => {
    res.json({ message: "Test" });
};

const createCard = async (req, res) => {
    const { owner, name, fights } = req.body;
    id = gameController.createCard(owner, name, fights); // string, string, list [{rounds, sport, fighterA, fighterB}]
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
    finish,
    endCard,
};
