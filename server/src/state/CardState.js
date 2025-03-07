const GameState = require("./GameState");
const { v4: uuidv4 } = require("uuid");

class CardState {
    constructor(owner, name, fights, id) {
        this.fights = [];
        this.currentFight = 0;
        this.owner = owner;
        this.name = name;
        this.id = id;
        this.loadFights(fights);
    }

    loadFights(fights) {
        for (let i = 0; i < fights.length; i++) {
            const fight = fights[i];
            const gameState = new GameState(
                fight.totalRounds,
                fight.sport,
                fight.fighterA,
                fight.fighterB,
                uuidv4()
            );

            this.fights.push(gameState);
        }
    }

    nextFight() {
        if (this.currentFight >= this.fights.length - 1) {
            return null;
        }

        this.currentFight += 1;
        return this.getCurrentFight();
    }

    setFight(i, replacement) {
        this.cards[i] = replacement;
    }

    incRound() {
        this.getCurrentFight().incRound();
    }

    getCurrentFight() {
        return this.fights[this.currentFight];
    }

    end(outcome) {
        this.getCurrentFight().setOutcome(outcome);
    }

    jsonify() {
        let result = {
            owner: this.owner,
            name: this.name,
            currentFight: this.currentFight,
            fights: [this.fights.map((fight) => fight.objectify())],
        };
        return result;
    }
}

module.exports = CardState;
