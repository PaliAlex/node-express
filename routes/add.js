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

        const course = new Course({
            title: request.body.title,
            price: request.body.price,
            image: request.body.image,
            userId: request.user,
        });

        try{
            await course.save();
            response.redirect('/courses');
        } catch (error) {
            console.log(error)
        }
    }
)

module.exports = router;
