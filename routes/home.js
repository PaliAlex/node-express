const { Router } = require('express');
const router = Router();

router.get(
    '/',
    (request, response, next) => {
        response.render('index', {
            title: 'Main Page',
            isHome: true,
        })
    }
)

module.exports = router;
