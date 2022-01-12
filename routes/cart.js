const { Router } = require('express');
const router = Router();
const Cart = require('../models/cart');
const Course = require('../models/course');


router.post('/add', async (request, response) => {
    const course = await Course.findById(request.body.id)
    await Cart.add(course)
    response.redirect('/cart')
})

router.delete(
    '/remove/:id',
    async (request, response) => {
        const cart = await Cart.remove(request.params.id);

        response.status(200).json(cart);
    }
)

router.get('/', async (request, response) => {
    const cart = await Cart.fetch()
    response.render('cart', {
        title: 'Cart',
        isCard: true,
        courses: cart.courses,
        price: cart.price
    })
})
module.exports = router;
