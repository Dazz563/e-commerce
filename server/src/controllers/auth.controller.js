const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

        req.session.user = user;
        req.session.isLoggedIn = true;
        res.status(200).json({
            message: 'Successful login',
            data: loggedUser,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.signup = async (req, res, next) => {
    const {firstName, lastName, email, imageUrl, password} = req.body;
    try {
        let hashPassword = await bcrypt.hash(password, 12);
        let user = await User.create({
            firstName,
            lastName,
            email,
            imageUrl,
            password: hashPassword,
        });

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
        let token = await bcrypt.hash(email, 12);

        const user = await User.findOne({
            where: {
                email,
            },
        });

        // catch no user found
        if (!user) {
            res.status(404).json({
                message: 'No user with this email exists!',
            });
        }

        let updateToken = await user.update({
            resetToken: token,
            resetTokenExpiration: Date.now() + 3600000,
        });

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
    const {newPassword, token} = req.body;
    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now(),
                },
            },
        });

        console.log(user.toJSON());
        if (!user) {
            res.status(404).json({
                message: 'Invalid token',
            });
        }

        updatedPassword = await bcrypt.hash(newPassword, 12);

        let result = await user.update({
            password: updatedPassword,
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
