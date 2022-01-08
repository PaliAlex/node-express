const express = require('express');
const expHbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const coursesRoutes = require('./routes/courses');

const app = express();
const hbs = expHbs.create({
   defaultLayout: 'main',
   extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/courses', coursesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server runs on port ${PORT}`);
})
