const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_shopping_cart_db', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;
