const { Router } = require('express');
const Courses = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

const isOwner = (course, request) => {
    return course.userId.toString() === request.user._id.toString()
}
router.get(
    '/',
    async (request, response, next) => {
        try {
            const courses = await Courses.find()
                .populate('userId', 'email name')
                .select('price title image');

            response.render('courses', {
                title: 'Courses',
                isCourses: true,
                userId: request.user ? request.user._id.toString() : null,
                courses,
            })
        } catch (error) {
            console.log(error)
        }
    }
)

router.get(
    '/:id/edit',
    auth,
    async (request, response) => {
        if (!request.query.allow) {
            return response.redirect('/')
        }
        const course = await Courses.findById(request.params.id);

        if (!isOwner(course, request)) {
            return response.redirect('/courses');
        }

        response.render('course-edit', {
            title: `Edit ${course.title}`,
            course,
        })
    }
)

router.post(
    '/edit',
    auth,
    async (request, response) => {
        const course = await Courses.findById(request.body.id);

        if (!isOwner(course, request)) {
            return response.redirect('/courses');
        }

        Object.assign(course, request.body);
        await course.save();
        response.redirect('/courses');
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
    auth,
    async (request, response) => {
        try {
            await Courses.deleteOne({
                _id: request.body.id,
                userId: request.user._id,
            })
            response.redirect('/courses')
        } catch (error) {
            console.log(error)
        }
    }
)

module.exports = router;
