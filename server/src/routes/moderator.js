const { wait, IN_PROGRESS, FINISHED, SET_WINNER } = require("../utils");
const supabase = require("../config/supabaseClient");

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

    if (cardState.state == SET_WINNER) {
        res.json({ message: "Please set winner of fight" });
        return;
    }

    if (
        cardState.currentRound >= cardState.totalRounds + 1 ||
        cardState.state == FINISHED
    ) {
        res.json({ result: "Fight over" });
        return;
    }

    await cardState.incRound();
    const result = io.to(id).emit("incRound");
    await wait(1);
    const stats = await cardState.getPrevRoundStats();
    io.to(id).emit(`stats/${cardState.currentRound - 1}`, stats);

    res.json({ result, stats });
};

const fetchRoom = async (req, res) => {
    const id = req.params.id;
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ message: "Card not found" });
        return;
    }

    res.json({ cardState: cardState.jsonify() });
};

// Set winner on decision after final round
const setWinner = async (req, res) => {
    const { id, winner } = req.body;
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ message: "Card not found" });
        return;
    }

    if (cardState.state == IN_PROGRESS || cardState.state == FINISHED) {
        res.json({
            message: "State not in set winner",
            state: cardState.state,
        });
        return;
    }

    await cardState.setWinner(winner);
    io.to(id).emit("winner", winner);
    res.json({ message: "Winner set" });
};

const finish = async (req, res) => {
    const { id, outcome, winner } = req.body;
    const cardState = await gameController.getCard(id);
    if (cardState == null) {
        res.json({ message: "Card not found" });
        return;
    }

    if (cardState.state != IN_PROGRESS) {
        res.json({ message: "Fight no longer in progess cannot finish" });
        return;
    }

    cardState.finish(outcome, winner);
    io.to(id).emit("winner", winner);
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
        io.to(id).emit("endCard");
        res.json({ message: "Cleaned up" });
    } else {
        res.json({ message: "Could not clean up" });
    }
};

const update = async (req, res) => {
    const { id } = req.body; //TODO get id from auth header and supabase
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
    const { name, fights } = req.body;
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
    const { data: updatedUser, error: updateError } = await supabase
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
    setWinner,
    fetchRoom,
};
