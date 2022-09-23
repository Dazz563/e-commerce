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
        validate: {
            notEmpty: {
                msg: 'Please enter your first name',
            },
        },
    },
    lastName: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: {
                msg: 'Please enter your last name',
            },
        },
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Please enter your email',
            },
            isEmail: {
                msg: 'Please enter valid email format',
            },
        },
    },
    imageUrl: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: {
                msg: 'Please upload your profile picture',
            },
        },
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: {
                msg: 'Please enter a valid password',
            },
            // regex to tighten up password
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
