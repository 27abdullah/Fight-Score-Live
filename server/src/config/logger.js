const pino = require("pino");

const logger = pino(
    pino.destination({
        dest: "./logs.txt",
        minLength: 8192, // Buffer before writing
        sync: false, // Asynchronous logging
    })
);

const logHttp = (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
        if (
            res.statusCode == 400 ||
            res.statusCode == 500 ||
            res.statusCode == 401 ||
            res.statusCode == 403 ||
            res.statusCode == 422
        ) {
            logger.error({
                url: req.url,
                client: req.headers?.authorization,
                status: res.statusCode,
                start: startTime,
                duration: Date.now() - startTime,
                error: res.error,
            });
        }
    });

    next();
};

module.exports = { logHttp, logger };
