const { Router } = require('express');
const router = Router();
const Course = require('../models/course');

const mapCartItems = (cart) => cart.items.map(it => ({
    ...it.courseId._doc,
    id: it.courseId._id,
    count: it.count,
}));

const calculatePrice = (courses) => {
    return courses.reduce(
        (total, course) => total += course.price * course.count,
        0,
    )
}

router.post('/add', async (request, response) => {
    const course = await Course.findById(request.body.id)
    await request.user.addToCart(course);
    response.redirect('/cart')
})

router.delete(
    '/remove/:id',
    async (request, response) => {
        await request.user.removeFromCart(request.params.id);

        const user = await request.user.populate('cart.items.courseId');
        const courses = mapCartItems(user.cart)

        const cart = {
            courses,
            price: calculatePrice(courses)
        }

        response.status(200).json(cart);
    }
)

router.get('/', async (request, response) => {
    const user = await request.user.populate('cart.items.courseId');

    const courses = mapCartItems(user.cart);

    response.render('cart', {
        title: 'Cart',
        isCard: true,
        courses: courses,
        price: calculatePrice(courses),
    })
})

module.exports = router;
