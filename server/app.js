const express = require('express');
const app = express();

const sequelize = require('./src/util/database');
const User = require('././src/models/user.model');
const Product = require('././src/models/product.model');
const Cart = require('././src/models/cart.model');
const CartItem = require('././src/models/cart-item.model');
const Order = require('././src/models/order.model');
const OrderItem = require('././src/models/order-items.model');

const shopRoutes = require('./src/routes/shop.routes');
const adminRoutes = require('./src/routes/admin.routes');

// This will parse incoming JSON
app.use(express.json());

// temporarily adds the user to the req
app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
        });
});
// Routers
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);

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
const syncDb = async () => {
    const db = await sequelize
        .sync()
        // .sync({force: true})
        // temporary
        .then((result) => {
            return User.findByPk(1);
        })
        .then((user) => {
            if (!user) {
                return User.create({
                    firstName: 'Darren',
                    lastName: 'Nienaber',
                    email: 'test@gmail.com',
                    imageUrl: 'imageUrl',
                });
            }
            return user;
        })
        .then((user) => {
            return user.createCart();
        })
        .catch((err) => {
            console.log(err);
        });
    // temporary
};
syncDb();

module.exports = app;
