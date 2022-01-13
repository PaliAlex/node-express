const { Router } = require('express');
const Courses = require('../models/course');
const router = Router();

router.get(
    '/',
    async (request, response, next) => {
        const courses = await Courses.find()
            .populate('userId', 'email name')
            .select('price title image');

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

        const course = await Courses.findById(request.params.id);

        response.render('course-edit', {
            title: `Edit ${course.title}`,
            course,
        })

        router.post(
            '/edit',
            async (request, response) => {
                await Courses.findByIdAndUpdate(request.body.id, request.body);
                response.redirect('/courses');
            }
        )
    }
)

router.get(
    '/:id',
    async (request, response) => {
        const course = await Courses.findById(request.params.id);

        response.render('course', {
            layout: 'empty',
            title: `Course`,
            course,
        })
    }
)

router.post(
    '/remove',
    async (request, response) => {
        try {
            await Courses.deleteOne({
                _id: request.body.id,
            })
            response.redirect('/courses')
        } catch (error) {
            console.log(error)
        }
    }
)

module.exports = router;
