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
    '/:id/edit',
    async (request, response) => {
        if (!request.query.allow) {
            return response.redirect('/')
        }

        const course = await Courses.getAllById(request.params.id);

        response.render('course-edit', {
            title: `Edit ${course.title}`,
            course,
        })
        console.log(request.body);

        router.post(
            '/edit',
            async (request, response) => {
                console.log(request.body);

                await Courses.update(request.body);
                response.redirect('/courses');
            }
        )
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
