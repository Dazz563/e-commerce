const express = require('express');
const shopRouter = express.Router();

const {
    getCheckout, //
    getCart,
    getProducts,
    getOrders,
    getProductById,
    addCart,
    deleteCart,
    createOrder,
} = require('../controllers/shop.controller');
const isAuth = require('../middleware/is-auth.middleware');

// shopRouter.get('/', getProducts);
shopRouter.get('/products', getProducts);
shopRouter.get('/product/:id', getProductById);
shopRouter.get('/cart', isAuth, getCart);
shopRouter.post('/cart/:prodId', isAuth, addCart);
shopRouter.delete('/cart-delete-item/:prodId', isAuth, deleteCart);
shopRouter.get('/orders', isAuth, getOrders);
shopRouter.post('/order/create-order', isAuth, createOrder);
shopRouter.get('/checkout', isAuth, getCheckout);

module.exports = shopRouter;
