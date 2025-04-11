let gameController = null;

function setupUserRoutes(c) {
    gameController = c;
}

const displayLiveFights = async (req, res) => {
    const fights = gameController.jsonify();
    res.json(fights);
};

module.exports = { setupUserRoutes, displayLiveFights };
