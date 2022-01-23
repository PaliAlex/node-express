const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email', 'Enter correct email')
        .isEmail()
        .custom(async (value, { req }) => {
            try {
                const candidate = await User.findOne({ email: value });

                if (candidate) {
                    return Promise.reject('User with the same name exists')
                }

            } catch (error) {
                console.log(error);
            }
        })
        .normalizeEmail(),
    body('password', 'Correct password should be at list 6 symbols')
        .isLength({min: 6, max: 20})
        .isAlphanumeric()
        .trim(),
    body('confirm', 'Passwords have to be the same')
        .custom((value, { req }) => value === req.body.password)
        .trim(),
    body('name', 'Correct name should be at list 3 symbols')
        .isLength({min: 3, max: 20})
        .trim(),
]


exports.courseValidators = [
    body('title', 'Minimum length is 3')
        .isLength({min: 3})
        .trim(),
    body('price', 'Enter correct price')
        .isNumeric(),
    body('image', 'Enter correct url')
        .isURL(),
]
