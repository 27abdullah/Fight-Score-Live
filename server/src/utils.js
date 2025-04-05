const wait = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));
IN_PROGRESS = 0;
FINISHED = 1;
SET_WINNER = 2;
module.exports = { wait, IN_PROGRESS, FINISHED, SET_WINNER };
