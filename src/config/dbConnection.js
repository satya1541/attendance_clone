const { Sequelize } = require('sequelize');
const config = require('./config');
const choseConfig = config.serverDatabase;

// console.log (choseConfig.databaseName);
// console.log (choseConfig.userName);
// console.log (choseConfig.password);
// console.log (choseConfig.host);
// console.log (choseConfig.dialect);

const sequelize = new Sequelize(choseConfig.databaseName, choseConfig.userName, choseConfig.password, {
    host: choseConfig.host,
    dialect: choseConfig.dialect,
    logging: false,
    timezone: '+05:30',
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully to DATABASE.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

// module.exports = {sequelize,coreMysqlConnection};
module.exports = {sequelize};


