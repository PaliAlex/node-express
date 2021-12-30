const { Router } = require('express');
const Courses = require('../models/course');
const router = Router();

router.get(
    '/',
    async (request, response, next) => {
        const courses = await Courses.getAll();
        response.render('courses', {
            title: 'Courses',
            isCourses: true,
            courses,
        })
    }
)

router.get(
    '/:id',
    async (request, response) => {
        const course = await Courses.getAllById(request.params.id);

        response.render('course', {
            layout: 'empty',
            title: `Course`,
            course,
        })
    }
)

module.exports = router;
