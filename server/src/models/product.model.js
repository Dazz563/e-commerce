const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = require('./user.model');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.DataTypes.STRING,
    },
    price: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.DataTypes.STRING,
    },
    description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Product;
