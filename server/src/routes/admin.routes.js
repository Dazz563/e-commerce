const express = require('express');
const adminRouter = express.Router();

const {addProduct, getProducts, editProduct, deleteProduct} = require('../controllers/admin.controller');

adminRouter.get('/products', getProducts);
adminRouter.post('/products', addProduct);
adminRouter.patch('/edit-product/:id', editProduct);
adminRouter.delete('/delete-product/:id', deleteProduct);

module.exports = adminRouter;
