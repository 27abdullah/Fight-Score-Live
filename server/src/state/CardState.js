const cardSchema = require("../model/card.model");
const { wait, IN_PROGRESS, FINISHED } = require("../utils");

class CardState {
    constructor(card, redis) {
        this.currentFight = card.currentFight;
        this.owner = card.owner;
        this.name = card.name;
        this.id = card.id.toString();
        this.fighterA = card.fighterA;
        this.fighterB = card.fighterB;
        this.sport = card.sport;
        this.totalRounds = card.totalRounds;
        this.currentRound = card.currentRound;
        this.redis = redis;
        this.state = card.state;
    }

    keys(fighter) {
        return Array.from(
            { length: this.currentRound + 1 },
            (_, i) => `${this.id}/${i + 1}/${fighter}`
        );
    }

    async persist(round, way) {
        if (this.state == IN_PROGRESS) {
            console.log("Cannot persist while in progress");
            return false;
        }

        const card = await cardSchema.findById(this.id);

        if (!card) {
            console.error("Error finding card:", err);
            return false;
        }

        card.fights[this.currentFight].stats = {
            statsA: await Promise.all(
                this.keys("A").map(async (key) => this.redis.get(key))
            ),
            statsB: await Promise.all(
                this.keys("B").map(async (key) => this.redis.get(key))
            ),
        };
        card.fights[this.currentFight].outcome = {
            round: round,
            way: way,
        };
        card.save();

        return true;
    }

    async nextFight() {
        if (this.state == IN_PROGRESS) {
            console.log("Cannot go to next fight while in progress");
            return false;
        }

        const card = await cardSchema.findById(this.id);

        if (!card) {
            console.log("Error finding card:", err);
            return false;
        }

        if (this.currentFight >= card.fights.length - 1) {
            return false;
        }

        this.clearFightStats();

        const nextFight = card.fights[this.currentFight + 1];
        this.currentFight += 1;
        this.fighterA = nextFight.fighterA;
        this.fighterB = nextFight.fighterB;
        this.sport = nextFight.sport;
        this.totalRounds = nextFight.totalRounds;
        this.currentRound = 1;
        this.state = IN_PROGRESS;

        this.updateRedis(this.jsonify(), "nextFight");

        return true;
    }

    incRound() {
        if (this.state == FINISHED) {
            console.log("Cannot increment round while finished");
            return;
        }
        if (this.currentRound + 1 > this.totalRounds) {
            this.state = FINISHED;
            this.persist(this.currentRound, "decision");
        }

        this.currentRound += 1;
        this.updateRedis(this.jsonify(), "incRound");
    }

    finish(outcome) {
        this.state = FINISHED;
        this.persist(this.currentRound, outcome);
    }

    jsonify() {
        return {
            id: this.id,
            owner: this.owner,
            name: this.name,
            currentFight: this.currentFight,
            fighterA: this.fighterA,
            fighterB: this.fighterB,
            sport: this.sport,
            totalRounds: this.totalRounds,
            currentRound: this.currentRound,
            state: this.state,
        };
    }

    updateRedis(newState, msg) {
        this.redis.set(this.id, JSON.stringify(newState), (err, reply) => {
            if (err) {
                console.error(`Redis error on ${msg}: `, err);
            }
        });
    }

    async getPrevRoundStats() {
        return {
            statsA: await this.redis.get(
                `${this.id}/${this.currentRound - 1}/A`
            ),
            statsB: await this.redis.get(
                `${this.id}/${this.currentRound - 1}/B`
            ),
            round: this.currentRound - 1,
        };
    }

    async clearFightStats() {
        await Promise.all(
            this.keys("A").map(async (key) => this.redis.del(key))
        );
        await Promise.all(
            this.keys("B").map(async (key) => this.redis.del(key))
        );
    }

    // Updates prev round results
    async roundResults(scoreA, scoreB) {
        if (scoreA >= scoreB) {
            this.redis.incr(`${this.id}/${this.currentRound - 1}/A`);
        }
        if (scoreA <= scoreB) {
            this.redis.incr(`${this.id}/${this.currentRound - 1}/B`);
        }
    }
}

module.exports = CardState;
