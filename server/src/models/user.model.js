const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    firstName: {
        type: Sequelize.DataTypes.STRING,
    },
    lastName: {
        type: Sequelize.DataTypes.STRING,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
    },
    imageUrl: {
        type: Sequelize.DataTypes.STRING,
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: true,
        },
    },
    resetToken: {
        type: Sequelize.DataTypes.STRING,
    },
    resetTokenExpiration: {
        type: Sequelize.DataTypes.DATE,
    },
});

module.exports = User;
