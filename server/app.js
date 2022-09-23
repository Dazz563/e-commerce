const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

const sequelize = require('./src/util/database');
const User = require('././src/models/user.model');
const Product = require('././src/models/product.model');
const Cart = require('././src/models/cart.model');
const CartItem = require('././src/models/cart-item.model');
const Order = require('././src/models/order.model');
const OrderItem = require('././src/models/order-items.model');

const mysql = require('mysql2/promise');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);

const options = {
    connectionLimit: 10,
    password: 'root',
    user: 'root',
    database: 'node_shopping_cart_db',
    host: 'localhost',
    port: '3306',
};

const connection = mysql.createPool(options);
const sessionStore = new mysqlStore({}, connection);

const shopRoutes = require('./src/routes/shop.routes');
const adminRoutes = require('./src/routes/admin.routes');
const authRoutes = require('./src/routes/auth.routes');

// This will parse incoming JSON
app.use(express.json());
// This will parse incoming file binary for images using MULTER
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// File Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
    }).single('image')
);
// Session config
app.use(
    session({
        secret: 'superSecret123$#@',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
        },
        store: sessionStore,
    })
);

// adds the user to the req
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findByPk(req.session.user.id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

// Public file
app.use('/images', express.static(path.join(__dirname, 'images')));
// Routers
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api', authRoutes);

// RELATIONS SETUP BEFORE SYNCING
// Product relations - one to many/many to one
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
// Cart relations - one to one
User.hasOne(Cart);
Cart.belongsTo(User);
// Intermediate table - many to many
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
// Order relations - one to many/many to one
Order.belongsTo(User);
User.hasMany(Order);
// Intermediate table - many to many
Order.belongsToMany(Product, {through: OrderItem});

// syncing mySQL
(async () => {
    await sequelize.sync();
    // await sequelize.sync({force: true});
})();

module.exports = app;
