const cardSchema = require("../model/card.model");
const CardState = require("./CardState");
const { IN_PROGRESS, FINISHED, MAX_TOTAL_ROUNDS } = require("../utils");

class GameController {
    constructor() {
        this.cards = new Map();
        this.redis = null;
    }

    async getCard(id) {
        if (id == null) return null;
        if (!(await this.hasId(id))) {
            console.error("Could not find card with id:", id);
            return null;
        }
        return this.cards.get(id);
    }

    async createCard(owner, name, fights) {
        // Save card to mongo
        const card = new cardSchema({
            owner: owner,
            name: name,
            fights: fights,
            state: IN_PROGRESS,
        });
        card.save();

        // Add card (only required info) to redis
        const id = card._id.toString();
        const currentFight = {
            id: card._id,
            owner: owner,
            name: name,
            currentFight: 0,
            fighterA: fights[0].fighterA,
            fighterB: fights[0].fighterB,
            sport: fights[0].sport,
            totalRounds: fights[0].totalRounds,
            totalFights: fights.length,
            currentRound: 1,
            state: IN_PROGRESS,
            winner: "",
        };
        await this.redis.set(id, JSON.stringify(currentFight), (err, reply) => {
            if (err) {
                console.error("Redis error on createCard:", err);
            }
        });

        // Set vote sets for each round in each fight
        for (let i = 0; i < fights.length; i++) {
            for (let j = 1; j <= fights[i].totalRounds; j++) {
                await this.redis.sAdd(
                    `${id}/votes/${i}/${j}`, // fight id / votes / fight index / round
                    "",
                    (err, reply) => {
                        if (err) {
                            console.error(
                                `Redis error on adding ${id}/votes/${i}/${j}`,
                                err
                            );
                        }
                    }
                );
            }
        }

        // Add card to map
        this.cards.set(id, new CardState(currentFight, this.redis));

        return id;
    }

    setRedis(redis) {
        this.redis = redis;
    }

    async hasId(id) {
        if (!this.cards.has(id)) {
            try {
                const value = await this.redis.get(id);
                this.cards.set(
                    id,
                    new CardState(JSON.parse(value), this.redis)
                );
                return true;
            } catch (err) {
                console.log("Could not find id in redis:", id);
                return false;
            }
        }
        return true;
    }

    async clearRoundSets(card) {
        for (let i = 0; i < card.totalFights; i++) {
            for (let j = 1; j <= MAX_TOTAL_ROUNDS; j++) {
                //TODO dont use MAX_TOTAL_ROUNDS, pull from fight totalRounds
                await this.redis.del(
                    `${card.id}/votes/${i}/${j}`,
                    (err, reply) => {
                        if (err) {
                            console.error(
                                `Error deleting ${card.id}/votes/${i}/${j}:`,
                                err
                            );
                        }
                    }
                );
            }
        }
    }

    async endCard(id) {
        if (!(await this.hasId(id))) {
            console.error("Could not find card with id:", id);
            return false;
        }

        const card = this.cards.get(id);

        await this.clearRoundSets(card);
        await card.clear();
        this.cards.delete(id);
        await cardSchema.findByIdAndUpdate(card.id, {
            state: FINISHED,
        });
        return true;
    }

    async loadFromMongo() {
        const ids = await cardSchema.distinct("_id", { state: IN_PROGRESS });
        ids.forEach((id) => {
            if (!this.hasId(id.toString())) {
                console.error("Could not find card in redis with id:", id);
            }
        });
    }

    jsonify() {
        const result = [];
        this.cards.forEach((fight) => {
            result.push(fight.jsonify());
        });
        return result;
    }
}
const gameController = new GameController();

module.exports = { gameController };
