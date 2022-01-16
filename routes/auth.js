const { Router } = require('express');
const router = Router();
const User = require('../models/user');

router.get(
    '/login',
    async (request, response) => {
        response.render('auth/login',{
            title: 'Authorisation',
            isLogin: true,
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
        const user = await User.findById('61df0afd5652215f71a46779');
        request.session.user = user;
        request.session.isAuthenticated = true;
        request.session.save(
            error => {
                if (error) {
                    throw error
                }
                response.redirect('/');
            }
        )
    }
)
module.exports = router;
