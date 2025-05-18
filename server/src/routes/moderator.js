const { wait, IN_PROGRESS, FINISHED, SET_WINNER } = require("../utils");
const supabase = require("../config/supabaseClient");
const { validationResult, matchedData } = require("express-validator");

let gameController = null;
let io = null;

function setupModRoutes(c, socket) {
    gameController = c;
    io = socket;
}

function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

const incRound = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id } = matchedData(req);
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ failMessage: "Card not found" });
        return;
    }

    const result = await cardState.incRound();
    if (!result) {
        res.status(400).json({ failMessage: "Could not increment round" });
        return;
    }

    io.to(id).emit("incRound");
    await wait(1);
    const stats = await cardState.getPrevRoundStats();
    io.to(id).emit(`stats/${cardState.currentRound - 1}`, stats);
    res.json({ roomData: cardState.jsonify(), stats });
});

const fetchRoom = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id } = matchedData(req);
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.status(400).json({ failMessage: "Card not found" });
        return;
    }

    res.json({ cardState: cardState.jsonify() });
});

const setWinner = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id, winner } = matchedData(req);
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.status(400).json({ failMessage: "Card not found" });
        return;
    }

    const result = await cardState.setWinner(winner);
    if (!result) {
        res.status(400).json({ failMessage: "Could not set winner" });
        return;
    }

    io.to(id).emit("winner", winner);
    res.json({ roomData: cardState.jsonify() });
});

const finish = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id, outcome, winner } = matchedData(req);
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ failMessage: "Card not found" });
        return;
    }

    const result = await cardState.finish(outcome, winner);
    if (!result) {
        res.status(400).json({ failMessage: "Could not finish fight" });
        return;
    }

    io.to(id).emit("winner", winner);
    res.json({ roomData: cardState.jsonify() });
});

const nextFight = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id } = matchedData(req);
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ failMessage: "Card not found" });
        return;
    }

    const result = await cardState.nextFight();
    if (!result) {
        res.status(400).json({
            failMessage: "Could not go to next fight",
        });
        return;
    }

    const state = cardState.jsonify();
    io.to(id).emit("init", state);
    io.to(id).emit("clearStorage");
    res.json({ roomData: cardState.jsonify() });
});

const endCard = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id } = matchedData(req);

    if (await gameController.endCard(id)) {
        io.to(id).emit("clearStorage");
        io.to(id).emit("endCard");
        res.json({ end: true });
    } else {
        res.json({ failMessage: "Could not clean up" });
    }
});

const hostMessage = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id, message } = matchedData(req);
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ failMessage: "Card not found" });
        return;
    }

    io.to(id).emit("hostMessage", message);
    res.json({});
});

const update = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id } = matchedData(req);
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ failMessage: "Card not found" });
        return;
    }

    const state = cardState.jsonify();
    io.to(id).emit("init", state);
    io.to(id).emit("clearStorage");
    res.json({ roomData: cardState.jsonify() });
});

//

const createCard = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }
    const { name, fights } = matchedData(req);
    const owner = req.user.sub;

    // Check owner has tokens
    const { data: user, error: fetchError } = await supabase
        .from("profiles")
        .select("roomtokens")
        .eq("id", owner)
        .single();

    if (fetchError || !user || user.roomtokens <= 0) {
        res.json({
            message: "Could not create card",
            info: "error",
            id: owner,
        });
        return;
    }

    // Decrement tokens
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ roomtokens: user.roomtokens - 1 })
        .eq("id", owner)
        .select();

    if (updateError) {
        res.json({ message: "Could not create card", info: "error", id: id });
        return;
    }

    id = await gameController.createCard(owner, name, fights); // string, string, list [{rounds, sport, fighterA, fighterB}]
    res.json({ message: "Card created", info: "success", id: id });
});

//

const getLiveUserCount = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            failMessage: "Invalid data",
        });
    }

    const { id } = matchedData(req);
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ failMessage: "Card not found" });
        return;
    }

    try {
        const count = await cardState.getLiveUserCount();
        res.json({ res: count });
    } catch (err) {
        res.json({ res: "Could not get user count" });
        return;
    }
});

const logController = (req, res) => {
    res.json(gameController.jsonify());
};

const test = (req, res) => {
    res.json({ message: "Test" });
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
    setWinner,
    getLiveUserCount,
    fetchRoom,
    hostMessage,
};
