const cardSchema = require("../model/card.model");
const { FINISHED } = require("../utils");
let gameController = null;

function setupUserRoutes(c) {
    gameController = c;
}

const displayLiveFights = async (req, res) => {
    const fights = gameController.jsonify();
    res.json(fights);
};

const pastCards = async (req, res) => {
    // Fetch all cards with state 2 (finished)
    const pastCards = await cardSchema.find({ state: FINISHED }).exec();
    res.json({
        data: pastCards,
    });
};

module.exports = { setupUserRoutes, displayLiveFights, pastCards };
