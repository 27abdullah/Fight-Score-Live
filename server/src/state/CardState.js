const fs = require("fs");
const readline = require("readline");
const GameState = require("./GameState");
const { v4: uuidv4 } = require("uuid");

class CardState {
    constructor(sport, dir) {
        this.fights = [];
        this.currentFight = 0;
        this.sport = sport;
        this.loadFights(dir);
    }

    loadFights(dir) {
        const fileStream = fs.createReadStream(dir);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        rl.on("line", (line) => {
            const split = line.split(",");
            const gameState = new GameState(
                Number(split[2]),
                this.sport,
                split[0],
                split[1],
                uuidv4()
            );

            this.fights.push(gameState);
        });
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
}

module.exports = CardState;
