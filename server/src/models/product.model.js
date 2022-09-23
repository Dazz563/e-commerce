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
        validate: {
            notEmpty: {
                msg: 'Please enter a title',
            },
        },
    },
    price: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please enter a price',
            },
            isNumeric: {
                msg: 'Value must be a number',
            },
        },
    },
    imageUrl: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: {
                msg: 'Please enter a image',
            },
            // isURL: {
            //     msg: 'Value must be a valid url',
            // },
        },
    },
    description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please enter a image',
            },
        },
    },
});

module.exports = Product;
