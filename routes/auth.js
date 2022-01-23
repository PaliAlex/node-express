const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const sendgrid = require('nodemailer-sendgrid-transport');
const router = Router();
const User = require('../models/user');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const { registerValidators } = require('../utils/validators');

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: keys.sendGridApiKey,
    }
}));

router.get(
    '/login',
    async (request, response) => {
        response.render('auth/login',{
            title: 'Authorisation',
            isLogin: true,
            loginError: request.flash('loginError'),
            registerError: request.flash('registerError'),
        });
    }
)

router.get(
    '/logout',
    async (request, response) => {
        request.session.destroy(()=>{
            response.redirect('/auth/login#login');
        });
    }
)

router.post('/login',
    async (request, response) => {

    try {
        const { email, password } = request.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            const isSame = await bcrypt.compare(password, candidate.password);

            if (isSame) {
                request.session.user = candidate;
                request.session.isAuthenticated = true;
                request.session.save(
                    error => {
                        if (error) {
                            throw error
                        }
                        response.redirect('/');
                    }
                )
            } else {
                request.flash('loginError', 'Incorrect password');
                response.redirect('/auth/login#login');
            }
        } else {
            request.flash('loginError', 'User does not exists');
            response.redirect('/auth/login#login');
        }
    } catch (error) {
        console.log(error)
    }
    }
)

router.post(
    '/register',
    registerValidators,
    async (request, response) => {
        try{
            const { email, password, name } = request.body;

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                request.flash('registerError', errors.array()[0].msg);

                return response.status(422).redirect('/auth/login#register');
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, password: hashPassword, name, cart: { items: []},
            })
            await user.save();

            await transporter.sendMail(regEmail(email));
            response.redirect('/auth/login#login');
        } catch (error) {
            console.log(error)
        }
    }
)

router.get(
    '/reset',
    (request, response) => {
        response.render('auth/reset',{
            title: 'Forgot password',
            error: request.flash('error'),
        });
    }
)

router.post(
    '/reset',
    (request, response) => {
        try{
            crypto.randomBytes(32,  async (error, buffer) => {
                if (error) {
                    request.flash('error', 'Something has gone wrong. Try later.')
                    return response.redirect('/auth/reset');
                }

                const token = buffer.toString('hex');
                const candidate = await User.findOne({email: request.body.email});

                if (candidate) {
                    candidate.resetToken = token;
                    candidate.resetTokenExp = Date.now() + 3600 * 1000;

                    await candidate.save();
                    await transporter.sendMail(resetEmail(candidate.email, token));

                    response.redirect('/auth/login');
                } else {
                    request.flash('error', 'No such email')
                    return response.redirect('/auth/reset');
                }
            })
        } catch (error) {
            console.log(error);
        }

    }
)

router.get(
    '/password/:token',
    async (request, response) => {
        if (!request.params.token) {
            return response.redirect('/auth/login');
        }

        try {
            const user = await User.findOne({
                resetToken: request.params.token,
                resetTokenExp: {$gt: Date.now()}
            });

            if (!user) {
                return response.redirect('/auth/login');
            } else {
                response.render('auth/password',{
                    title: 'Recovery access',
                    error: request.flash('error'),
                    userId: user._id.toString(),
                    token: request.params.token,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
)

router.post(
    '/password',
    async (request, response) => {
        try {
            const user = await User.findOne({
                _id: request.body.userId,
                resetToken: request.body.token,
                resetTokenExp: {$gt: Date.now()}
            })

            if (user) {
                user.password = await bcrypt.hash(request.body.password, 10);
                user.resetToken = undefined;
                user.resetTokenExp = undefined;
                await user.save();
                response.redirect('/auth/login')
            } else {
                request.flash('loginError', 'Token is invalid');
                return response.redirect('/auth/login');
            }
        } catch (error) {
            console.log(error);
        }
    }
)

module.exports = router;
