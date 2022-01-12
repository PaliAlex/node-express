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

const app = express();
const hbs = expHbs.create({
   defaultLayout: 'main',
   extname: 'hbs',
   handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/courses', coursesRoutes);

const PORT = process.env.PORT || 3000;

const start = async() => {
    const url = 'mongodb+srv://sasha:UN2QxdHgNBOnMrgB@cluster0.xzjso.mongodb.net/shop';

    try {
        await mongoose.connect(url)

        app.listen(PORT, () => {
            console.log(`Server runs on port ${PORT}`);
        })
    } catch (error) {
        console.log(error)
    }
}

start();



