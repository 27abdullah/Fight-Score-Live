const wait = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));
const IN_PROGRESS = 0;
const FINISHED = 1;
const SET_WINNER = 2;

const STATES = [IN_PROGRESS, FINISHED, SET_WINNER];
const FIGHTER_NAME_MAX_LENGTH = 20;
const FIGHT_NAME_MAX_LENGTH = 20;
const MAX_TOTAL_ROUNDS = 15;
const MAX_FIGHTS = 20;
const MAX_HOST_MESSAGE_LENGTH = 30;
const SPORTS = [
    "Boxing",
    "MMA",
    "Muay Thai",
    "Kickboxing",
    "Wrestling",
    "BJJ",
    "Karate",
    "Taekwondo",
    "Judo",
    "Sambo",
];
const FIGHT_OUTCOMES = ["KO", "TKO", "DQ"];

module.exports = {
    wait,
    IN_PROGRESS,
    FINISHED,
    SET_WINNER,
    STATES,
    SPORTS,
    FIGHTER_NAME_MAX_LENGTH,
    FIGHT_NAME_MAX_LENGTH,
    MAX_TOTAL_ROUNDS,
    MAX_FIGHTS,
    MAX_HOST_MESSAGE_LENGTH,
    FIGHT_OUTCOMES,
};
