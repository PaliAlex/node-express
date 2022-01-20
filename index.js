const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expHbs = require('express-handlebars');
const Handlebars = require('handlebars');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoStore = require('connect-mongodb-session')(session);
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const keys = require('./keys');

const app = express();
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URL,
});
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

app.use(session({
    secret: keys.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store,
}))
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/courses', coursesRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

const start = async() => {

    try {
        await mongoose.connect(keys.MONGODB_URL);

        app.listen(PORT, () => {
            console.log(`Server runs on port ${PORT}`);
        })
    } catch (error) {
        console.log(error)
    }
}

start();



