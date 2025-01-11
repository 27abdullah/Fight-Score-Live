class GameState {
    constructor(totalRounds, sport, fighterA, fighterB) {
        this.totalRounds = totalRounds;
        this.sport = sport;
        this.currentRound = 1;
        this.id = 12345;
        this.fighterA = fighterA;
        this.fighterB = fighterB;
    }

    incRound() {
        this.currentRound += 1;
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
