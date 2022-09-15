const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        return res.status(200).json({
            data: products,
        });
    });
};

exports.getProductById = (req, res, next) => {
    const prodId = req.params.id;
    // Filter DB for id
    Product.findById(prodId, (product) => {
        // Return result
        return res.status(200).json({
            data: product,
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find((prod) => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
                // console.log('Cart Products', cartProducts);
            }
            // Return result
            return res.status(200).json({
                data: cartProducts,
            });
        });
    });
};

// Add product to cart
exports.addCart = (req, res, next) => {
    // Get id from req
    const prodId = req.params.id;
    // Find Product by id returning the full product
    Product.findById(prodId, (product) => {
        // Use retrieved id and retrieved product to add new entry
        Cart.addProduct(prodId, product.price);
        // Return result
        return res.status(201).json({
            message: 'Product successfully added to your cart',
            data: product,
        });
    });
};

exports.deleteCart = (req, res, next) => {
    // Get id from req
    const prodId = req.params.id;
    // Find Product by id returning the full product
    Product.findById(prodId, (product) => {
        // Use retrieved id and retrieved product to add new entry
        Cart.deleteProduct(prodId, product.price);
        // Return result
        return res.status(200).json({
            message: 'Product successfully removed from cart',
        });
    });
};

exports.getOrders = (req, res, next) => {};
exports.getCheckout = (req, res, next) => {};
