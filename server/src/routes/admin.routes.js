const express = require('express');
const adminRouter = express.Router();

const {addProduct, getProducts, editProduct, deleteProduct} = require('../controllers/admin.controller');
const isAuth = require('../middleware/is-auth.middleware');

adminRouter.get('/products', isAuth, getProducts);
adminRouter.post('/products', isAuth, addProduct);
adminRouter.patch('/edit-product/:id', isAuth, editProduct);
adminRouter.delete('/delete-product/:id', isAuth, deleteProduct);

module.exports = adminRouter;
