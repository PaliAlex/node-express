const { Router } = require('express');
const Order = require('../models/order');
const router = Router();

router.get(
    '/',
    async (request, response, next) => {
        try {
            const orders = await Order.find({'user.UserId': request.user._id}).populate('user.userId');

            response.render('orders', {
                title: 'Orders',
                isOrder: true,
                orders: orders.map(it => ({
                    ...it._doc,
                    price: it.courses.reduce(
                        (total, course) => {
                            return total += course.count * course.course.price
                        }, 0)
                }))
            })
        } catch (error) {
            console.log(error);
        }

    }
)

router.post(
    '/',
    async (request, response, next) => {

        try {
            const user = await request.user.populate('cart.items.courseId');

            const courses = user.cart.items.map(it => ({
                count: it.count,
                course: {
                    ...it.courseId._doc,
                }
            }));

            const order = new Order({
                user: {
                    name: request.user.name,
                    userId: request.user,
                },
                courses,
            });

            await order.save();
            await request.user.clearCart();

            response.redirect('/orders')
        } catch(error) {
            console.log(error)
        }
    }
)

module.exports = router;

