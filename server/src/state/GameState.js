const { set } = require("mongoose");

class GameState {
    constructor(totalRounds, sport, fighterA, fighterB, id) {
        this.totalRounds = totalRounds;
        this.sport = sport;
        this.currentRound = 1;
        this.id = id;
        this.fighterA = fighterA;
        this.fighterB = fighterB;
        this.outcome = "pending";
    }

    incRound() {
        this.currentRound += 1;
        if (this.currentRound > this.totalRounds) {
            this.setOutcome("decision");
        }
    }

    setOutcome(outcome) {
        this.outcome = outcome;
    }

    objectify() {
        return {
            totalRounds: this.totalRounds,
            sport: this.sport,
            currRound: this.currentRound,
            fighterA: this.fighterA,
            fighterB: this.fighterB,
        };
    }
}

module.exports = GameState;
