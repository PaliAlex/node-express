const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expHbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const User = require('./models/user');

const app = express();
const hbs = expHbs.create({
   defaultLayout: 'main',
   extname: 'hbs',
   handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (request, response, next) => {
    try {
        const user = await User.findById('61df0afd5652215f71a46779');
        request.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/courses', coursesRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3000;

const start = async() => {
    const url = 'mongodb+srv://sasha:UN2QxdHgNBOnMrgB@cluster0.xzjso.mongodb.net/shop';

    try {
        await mongoose.connect(url);

        const candidate = await User.findOne();

        if (!candidate) {
            const user = new User({
                email: 'Sasha@yyy.com',
                name: 'Sasha',
                cart: { items:[] },
            })
            await user.save();
        }

        app.listen(PORT, () => {
            console.log(`Server runs on port ${PORT}`);
        })
    } catch (error) {
        console.log(error)
    }
}

start();



