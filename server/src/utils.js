const wait = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));
IN_PROGRESS = 0;
FINISHED = 1;
module.exports = { wait, IN_PROGRESS, FINISHED };
