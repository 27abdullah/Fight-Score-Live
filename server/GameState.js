class GameState {
    constructor(totalRounds, sport) {
        this.totalRounds = totalRounds;
        this.sport = sport;
        this.currentRound = 1;
        this.id = 12345;
    }

    incRound() {
        if (this.currentRound < this.totalRounds) {
            this.currentRound += 1;
        }
    }
}

module.exports = GameState;
