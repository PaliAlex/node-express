const { Router } = require('express');
const auth = require('../middleware/auth');

const router = Router();

router.get(
    '/',
    auth,
    (request, response, next) => {
        response.render('profile',{
            title: 'User Profile',
            isProfile: true,
            user: request.user.toObject(),
        })
    }
)

router.post(
    '/',
    (request, response, next) => {}

)

module.exports = router;
