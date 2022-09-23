const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// crypto is converted into a promise
const crypto = require('crypto');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);

// Validation
const {validationResult} = require('express-validator/check');

const Sequelize = require('sequelize');
const {Op} = Sequelize;

const {sendEmail, sendTemplateEmail} = require('../util/ses-email');

exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({
            where: {
                email,
            },
        });

        // check to see if user and email exist
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        // serialization
        let loggedUser = user.toJSON();
        delete loggedUser.password;

        req.session.user = loggedUser;
        req.session.isLoggedIn = true;
        res.status(200).json({
            message: 'Successful login',
            data: loggedUser,
        });
    } catch (err) {
        console.log(err);
        next();
    }
};

exports.signup = async (req, res, next) => {
    const {firstName, lastName, email, password} = req.body;
    const image = req.file;
    // check to see if correct file format is used
    if (!image) {
        return res.status(422).json({
            message: 'Invalid file type',
        });
    }
    const imageUrl = image.path;
    try {
        let hashPassword = await bcrypt.hash(password, 12);
        let user = await User.create({
            firstName,
            lastName,
            email,
            imageUrl,
            password: hashPassword,
        });

        // create cart for user
        await user.createCart();

        if (!user) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error',
                    data: err,
                });
            }
        }

        let emailRes = await sendEmail(
            email,
            `Hello and welcome to our e-commerce platform!`,
            `<h1>What our packages offer...</h1>
             <h3>Lifetime guarantee!</h3>
             <p>For 25 years you'll be covered.</p>`
        );
        console.log('Your email result:', emailRes);

        return res.status(201).json({
            message: 'You have succesfully signed up',
            data: {
                firstName,
                lastName,
                email,
                imageUrl,
            },
        });
    } catch (err) {
        console.log(err);
        if (err) {
            return res.status(500).json({
                message: 'Internal server error',
                data: err,
            });
        }
    }
};

exports.logout = async (req, res, next) => {
    req.session.destroy(() => {
        res.status(200).json({
            message: 'Successful logout',
        });
    });
};

exports.resetPassword = async (req, res, next) => {
    const email = req.body.email;
    try {
        const token = (await randomBytes(32)).toString('hex');

        const user = await User.findOne({
            where: {
                email,
            },
        });

        // check for user existence
        if (!user) {
            res.status(404).json({
                message: 'No user with this email exists!',
            });
        }

        let updateToken = await user.update({
            resetToken: token,
            resetTokenExpiration: Date.now() + 3600000,
        });

        // check update has been successful
        if (updateToken) {
            let emailRes = await sendEmail(email, `Here is your reset token`, token);

            if (!emailRes) {
                res.status(500).json({
                    message: 'Something went wrong sending the email',
                });
            }

            res.status(201).json({
                message: 'Token sent',
                data: token,
            });
        }
    } catch (err) {
        console.log(err);
        next();
    }
};

exports.newPassword = async (req, res, next) => {
    const newPassword = req.body.newPassword;
    const token = req.params.token;

    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now(),
                },
            },
        });

        if (!user) {
            res.status(404).json({
                message: 'Invalid token',
            });
        }

        updatedPassword = await bcrypt.hash(newPassword, 12);

        let result = await user.update({
            password: updatedPassword,
            resetToken: null,
            resetTokenExpiration: null,
        });

        if (!result) {
            res.status(500).json({
                message: 'Updating password failed!',
            });
        }

        res.status(200).json({
            message: 'Password updated',
        });
    } catch (err) {
        console.log(err);
        next();
    }
};
