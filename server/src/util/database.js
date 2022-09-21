const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE, 'root', 'root', {
    dialect: process.env.DIALECT,
    host: process.env.HOST,
});

module.exports = sequelize;
