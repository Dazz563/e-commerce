const Product = require('../models/product.model');

exports.addProduct = async (req, res, next) => {
    const {title, imageUrl, description, price} = req.body;

    try {
        const newProduct = await Product.create({
            title,
            price,
            imageUrl,
            description,
            userId: req.user.id,
        });

        return res.status(201).json({
            message: 'Product succesfully added',
            data: newProduct,
        });
    } catch (err) {
        // throw error
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();

        return res.status(200).json({
            data: products,
        });
    } catch (err) {
        // throw error
    }
};

exports.editProduct = async (req, res, next) => {
    const prodId = req.params.id;

    const {title, price, imageUrl, description} = req.body;

    try {
        product = await Product.findByPk(prodId);

        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;

        await product.save();

        return res.status(201).json({
            message: 'Product updated successfully',
            data: product,
        });
    } catch (err) {
        // throw error
    }
};

exports.deleteProduct = async (req, res, next) => {
    const prodId = req.params.id;

    try {
        await Product.destroy({where: {id: prodId}});

        return res.status(200).json({
            message: 'Product deleted successfully',
        });
    } catch (err) {
        // throw error
    }
};
