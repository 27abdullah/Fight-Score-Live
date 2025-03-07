const CardState = require("./CardState");
const { v4: uuidv4 } = require("uuid");

class GameController {
    constructor() {
        this.cards = new Map(); // id -> card
    }

    getCard(id) {
        return this.cards.get(id);
    }

    createCard(owner, name, fights) {
        const id = uuidv4();
        this.cards.set(id, new CardState(owner, name, fights, id));
        return id;
    }

    hasId(id) {
        return this.cards.has(id);
    }

    clearCard(id) {
        this.cards.delete(id);
    }

    jsonify() {
        let result = [];
        for (let [id, card] of this.cards) {
            result.push({ id: id, card: card.jsonify() });
        }
        return result;
    }
}
gameController = new GameController();

module.exports = { gameController };
