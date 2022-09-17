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
} = require('../controllers/shop.controller');

shopRouter.get('/', getProducts);
shopRouter.get('/products', getProducts);
shopRouter.get('/product/:id', getProductById);
shopRouter.get('/cart', getCart);
shopRouter.post('/cart/:prodId', addCart);
shopRouter.delete('/cart-delete-item/:prodId', deleteCart);
shopRouter.get('/orders', getOrders);
shopRouter.get('/checkout', getCheckout);

module.exports = shopRouter;
