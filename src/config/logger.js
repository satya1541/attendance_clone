const fs = require('fs');
const winston = require('winston');
const { combine, timestamp, printf } = winston.format;
const moment = require('moment');
const path = require('path');
const logFilePath = path.join(__dirname, '..', '..', 'log', 'error.log');

if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
}

const fileTransport = new winston.transports.File({
    filename: logFilePath,
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
            format: () => {
                return moment().format('YYYY-MM-DD hh:mm:ss A'); // Format timestamp with timezone
            },
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        fileTransport,
        new winston.transports.Console(),
    ],
});

// Override console.error to log errors using Winston
console.error = function (...args) {
    const message = args.join(' '); // Combine all arguments into a single string
    const stack = new Error().stack; // Capture the stack trace
    logger.error(`${message}\n${stack}`); // Log both message and stack trace
};

module.exports = logger;
