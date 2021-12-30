const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.get(
    '/',
    (request, response, next) => {
        response.render('add',{
            title: 'Add course',
            isAdd: true,
        })
    }
)

router.post(
    '/',
    async (request, response) => {
        const course = new Course(
            request.body.title,
            request.body.price,
            request.body.image,
        );

        await course.save();
        response.redirect('/courses');
    }
)

module.exports = router;
