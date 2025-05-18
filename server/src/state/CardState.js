const cardSchema = require("../model/card.model");
const { wait, IN_PROGRESS, FINISHED, SET_WINNER } = require("../utils");

/**
 * This class should do all the state validatino (IN_PROGRESS, FINISHED, etc.) and not
 * moderator.js
 */

class CardState {
    constructor(card, redis) {
        this.currentFight = card.currentFight; // Index into fights
        this.owner = card.owner;
        this.name = card.name;
        this.id = card.id.toString();
        this.fighterA = card.fighterA;
        this.fighterB = card.fighterB;
        this.sport = card.sport;
        this.totalRounds = card.totalRounds;
        this.totalFights = card.totalFights;
        this.currentRound = card.currentRound;
        this.redis = redis;
        this.state = card.state;
        this.winner = card.winner; // "" | "A" | "B"
    }

    redisKeys(s) {
        return Array.from(
            { length: this.currentRound },
            (_, i) => `${this.id}/${i + 1}/${s}`
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
            votesA: await Promise.all(
                this.redisKeys("votesA").map(async (key) => {
                    const value = await this.redis.get(key);
                    return Number(value ?? 0);
                })
            ),
            votesB: await Promise.all(
                this.redisKeys("votesB").map(async (key) => {
                    const value = await this.redis.get(key);
                    return Number(value ?? 0);
                })
            ),
            medians: await Promise.all(
                this.redisKeys("median").map(async (key) => {
                    const value = await this.redis.get(key);
                    return Number(value ?? 0);
                })
            ),
            diffs: await Promise.all(
                this.redisKeys("diffs").map(async (key) => {
                    const values = await this.redis.lRange(key, 0, -1);
                    return values.map(Number);
                })
            ),
        };

        card.fights[this.currentFight].outcome = {
            round: round,
            way: way,
            winner: await this.redis.get(`${this.id}/winner`),
        };
        card.save();

        return true;
    }

    async nextFight() {
        if (this.state == IN_PROGRESS) {
            return false;
        }

        const card = await cardSchema.findById(this.id);

        if (!card || this.currentFight >= card.fights.length - 1) {
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
        this.winner = "";

        this.updateRedis(this.jsonify(), "nextFight");

        return true;
    }

    async getLiveUserCount() {
        return (await this.redis.SCARD(`active-users/${this.id}`)) - 1;
    }

    async incRound() {
        if (
            this.state == FINISHED ||
            this.state == SET_WINNER ||
            this.currentRound > this.totalRounds
        ) {
            // LOG - "Cannot increment round"
            return false;
        }

        if (this.currentRound + 1 > this.totalRounds) {
            this.state = SET_WINNER;
        }

        this.currentRound += 1;
        await this.updateRedis(this.jsonify(), "incRound");
        return true;
    }

    async setWinner(winner, outcome = "Decision") {
        if (
            // Cannot have decision if fight unfinished
            (this.state == IN_PROGRESS && outcome == "Decision") ||
            this.state == FINISHED
        ) {
            return false;
        }

        await this.redis.set(`${this.id}/winner`, winner, (err, reply) => {
            if (err) {
                console.error("Error setting winner:", err);
            }
        });
        this.state = FINISHED;
        this.winner = winner;
        await this.persist(this.currentRound, outcome);
        await this.updateRedis(this.jsonify(), "setWinner");
        return true;
    }

    async finish(outcome, winner) {
        if (this.state != IN_PROGRESS) {
            return false;
        }
        return await this.setWinner(winner, outcome);
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
            totalFights: this.totalFights,
            currentRound: this.currentRound,
            state: this.state,
            winner: this.winner,
        };
    }

    async updateRedis(newState, msg) {
        await this.redis.set(
            this.id,
            JSON.stringify(newState),
            (err, reply) => {
                if (err) {
                    console.error(`Redis error on ${msg}: `, err);
                }
            }
        );
    }

    async getPrevRoundStats() {
        // Save and get the median of the differences
        const diffs = await this.redis.lRange(
            `${this.id}/${this.currentRound - 1}/diffs`,
            0,
            -1
        );
        diffs.sort((a, b) => Number(a) - Number(b));
        let median = diffs[Math.floor(diffs.length / 2)];
        if (median !== undefined) {
            await this.redis.set(
                `${this.id}/${this.currentRound - 1}/median`,
                median
            );
        } else {
            median = null;
        }

        return {
            votesA: await this.redis.get(
                `${this.id}/${this.currentRound - 1}/votesA`
            ),
            votesB: await this.redis.get(
                `${this.id}/${this.currentRound - 1}/votesB`
            ),
            median: median,
        };
    }

    // For ALL rounds up to and including currentRound
    async clearFightStats() {
        const votesA = Promise.all(
            this.redisKeys("votesA").map(async (key) => this.redis.del(key))
        );
        const votesB = Promise.all(
            this.redisKeys("votesB").map(async (key) => this.redis.del(key))
        );
        const median = Promise.all(
            this.redisKeys("median").map(async (key) => this.redis.del(key))
        );
        const diff = Promise.all(
            this.redisKeys("diffs").map(async (key) => this.redis.del(key))
        );
        const winner = this.redis.del(`${this.id}/winner`);

        await Promise.all([votesA, votesB, median, diff, winner]);
    }

    async clearLiveState() {
        await this.redis.del(this.id, (err, reply) => {
            if (err) {
                console.error("Error deleting key:", err);
                return false;
            }
        });
        await this.redis.del(`active-users/${this.id}`, (err, reply) => {
            if (err) {
                console.error("Error deleting key:", err);
                return false;
            }
        });
    }

    async clear() {
        await Promise.all([this.clearFightStats(), this.clearLiveState()]);
    }

    async roundResults(scoreA, scoreB) {
        // Differences in scores (A - B)
        this.redis.rPush(
            `${this.id}/${this.currentRound - 1}/diffs`,
            String(scoreA - scoreB),
            (err, reply) => {
                if (err) {
                    console.error("Error pushing to redis:", err);
                }
            }
        );

        // Number of people who voted for A or B
        if (scoreA >= scoreB) {
            this.redis.incr(`${this.id}/${this.currentRound - 1}/votesA`);
        }
        if (scoreA <= scoreB) {
            this.redis.incr(`${this.id}/${this.currentRound - 1}/votesB`);
        }
    }
}

module.exports = CardState;
