require('dotenv').config();

module.exports = {
    localDatabase: {
        databaseName: process.env.localDatabase,
        userName: process.env.localUsername,
        password: process.env.localPassword,
        host: process.env.localHost,
        dialect: process.env.localDialect
    },
    serverDatabase: {
        databaseName: process.env.serverDatabase,
        userName: process.env.serverUsername,
        password: process.env.serverPassword,
        host: process.env.serverHost,
        dialect: process.env.serverDialect
    },
};