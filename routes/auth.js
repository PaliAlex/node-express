const { Router } = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const router = Router();
const User = require('../models/user');
const keys = require('../keys');
const regEmail = require('../emails/registration');

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
    async (request, response) => {
        try{
            const { email, password, repeat, name } = request.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                request.flash('registerError', 'User with the same name exists');
                response.redirect('/auth/login#register')
            } else {
                const hashPassword = await bcrypt.hash(password, 10)
                const user = new User({
                    email, password: hashPassword, name, cart: { items: []},
                })
                await user.save();

                await transporter.sendMail(regEmail(email));
                response.redirect('/auth/login#login');

            }

        } catch (error) {
            console.log(error)
        }
    }
)

module.exports = router;
