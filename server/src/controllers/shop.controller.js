const Product = require('../models/product.model');
const User = require('../models/user.model');

exports.getProducts = async (req, res, next) => {
    try {
        // const products = await Product.findAll({include: User});
        const products = await Product.findAll();

        return res.status(200).json({
            data: products,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getProductById = async (req, res, next) => {
    const prodId = req.params.id;

    try {
        const product = await Product.findByPk(prodId);

        return res.status(200).json({
            data: product,
        });
    } catch (err) {
        // throw error
    }
};

exports.getCart = async (req, res, next) => {
    try {
        let cart = await req.user.getCart();
        // checks for empty cart
        if (!cart) {
            return res.status(200).json({
                message: 'Your cart is empty',
                data: [],
            });
        }
        // sequelize uses belongsToMany to give us the getProducts as a magic method
        cartProducts = await cart.getProducts();

        return res.status(200).json({
            data: cartProducts,
        });
    } catch (err) {
        console.log(err);
    }
};

// Add product to cart
exports.addCart = async (req, res, next) => {
    // Get id from req
    const prodId = req.params.prodId;

    try {
        let cart = await req.user.getCart();
        console.log('Here is your cart', cart.toJSON());

        // check to see if the product exists in the cart
        let products = await cart.getProducts({where: {id: prodId}});
        products.forEach((product) => {
            console.log(product.toJSON());
        });
        // if we do have products we will assign it (undefined if not)
        let product;
        if (products.length >= 0) {
            product = products[0];
        }
        // check to adjust quantity if product exists
        let newQuantity = 1;
        if (product) {
            // sequelize is helping us retrieve the old quantity
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            // return here to exit updating a cart product and not running code below
            await cart.addProduct(product, {through: {quantity: newQuantity}});

            return res.status(201).json({
                message: 'Product successfully updated in your cart',
                data: product,
            });
        }
        // NEW PRODUCT at this point we know a new product is available lets find it
        product = await Product.findByPk(prodId);
        await cart.addProduct(product, {through: {quantity: newQuantity}});

        return res.status(201).json({
            message: 'Product successfully added to your cart',
            data: product,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.deleteCart = async (req, res, next) => {
    // Get id from req
    const prodId = req.params.prodId;

    try {
        // Get users cart
        let cart = await req.user.getCart();
        // with the cart we can now find the product to delete (returns array)
        let products = await cart.getProducts({where: {id: prodId}});
        fetchedProduct = products[0];
        // destroy the product BUT only in the intermediate table
        // sequelize gives me magic property cartItem for accessing this record
        let result = await fetchedProduct.cartItem.destroy();

        // Return result
        return res.status(200).json({
            message: 'Product successfully removed from cart',
        });
    } catch (err) {}
};

exports.createOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            return req.user
                .createOrder()
                .then((order) => {
                    return order.addProducts(
                        products.map((product) => {
                            product.orderItem = {quantity: product.cartItem.quantity};
                            return product;
                        })
                    );
                })
                .catch((err) => console.log(err));
        })
        .then((result) => {
            if (result) {
                // Cleaning out the cart
                fetchedCart.setProducts(null);
                // Return result
                return res.status(200).json({
                    message: 'Cart successfully added to orders',
                });
            }
        })
        .catch((err) => console.log(err));
};
exports.getOrders = async (req, res, next) => {
    try {
        let orders = await req.user.getOrders({include: ['products']});
        if (orders) {
            // Return result
            return res.status(200).json({
                data: orders,
            });
        }
    } catch (err) {}
};
exports.getCheckout = (req, res, next) => {};
