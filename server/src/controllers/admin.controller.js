const Product = require('../models/product.model');

exports.addProduct = (req, res, next) => {
    const {title, imageUrl, description, price} = req.body;

    const product = new Product(null, title, imageUrl, description, price);
    product.save(product);

    return res.status(201).json({
        message: 'Product succesfully added',
        data: product,
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        return res.status(200).json({
            data: products,
        });
    });
};

exports.editProduct = (req, res, next) => {
    const prodId = req.params.id;

    const {title, price, imageUrl, description} = req.body;

    const updatedProduct = new Product(
        prodId, //
        title,
        imageUrl,
        description,
        price
    );

    updatedProduct.save();

    return res.status(201).json({
        message: 'Product updated successfully',
        data: updatedProduct,
    });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.deleteById(prodId);

    return res.status(200).json({
        message: 'Product deleted successfully',
    });
};
