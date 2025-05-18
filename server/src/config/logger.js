const pino = require("pino");

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
        },
    },
});

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
        } else {
            logger.info({
                url: req.url,
                status: res.statusCode,
                start: startTime,
                duration: Date.now() - startTime,
            });
        }
    });

    next();
};

module.exports = logHttp;
