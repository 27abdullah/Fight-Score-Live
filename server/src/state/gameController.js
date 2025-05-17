const cardSchema = require("../model/card.model");
const CardState = require("./CardState");
const { wait, IN_PROGRESS, FINISHED } = require("../utils");

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
            fighterA: fights[0].fighterA.trim(),
            fighterB: fights[0].fighterB.trim(),
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
        await this.redis.sAdd(`active-users/${id}`, "start");

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

    async endCard(id) {
        if (!(await this.hasId(id))) {
            console.error("Could not find card with id:", id);
            return false;
        }

        const card = this.cards.get(id);

        await cardSchema.findByIdAndUpdate(card.id, {
            state: FINISHED,
        });
        await card.clear();
        this.cards.delete(id);
        return true;
    }

    async loadFromMongo() {
        // TODO NEXT - only load cards that are in progress, store live state in mongo
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
