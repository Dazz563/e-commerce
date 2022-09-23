const Product = require('../models/product.model');

exports.addProduct = async (req, res, next) => {
    const {title, description, price} = req.body;
    const image = req.file;
    // check to see if correct file format is used
    if (!image) {
        return res.status(422).json({
            message: 'Invalid file type',
        });
    }
    const imageUrl = image.path;

    try {
        const newProduct = await Product.create({
            title,
            price,
            imageUrl,
            description,
            userId: req.session.user.id,
        });
        if (!newProduct) {
            return res.status(500).json({
                message: 'Internal server error',
            });
        }
        return res.status(201).json({
            message: 'Product succesfully added',
            data: newProduct,
        });
    } catch (err) {
        console.log(err);
        next();
    }
};

// This controller must only return products CREATED by the logged in user
exports.getProducts = async (req, res, next) => {
    try {
        // where userId restricts products to logged in users products
        const products = await Product.findAll({
            where: {
                userId: req.user.id,
            },
        });

        return res.status(200).json({
            data: products,
        });
    } catch (err) {
        // throw error
    }
};

exports.editProduct = async (req, res, next) => {
    const prodId = req.params.id;
    console.log('PRODUCT ID: ', prodId);
    const {title, price, description} = req.body;
    const image = req.file;

    try {
        let product = await Product.findByPk(prodId);
        console.log(product.toJSON());
        // check to see if the product belongs to the logged in user
        if (product.userId !== req.user.id) {
            return res.status(403).json({
                message: 'This is not your product to edit',
            });
        }

        product.title = title;
        product.price = price;
        // check for new image, if empty simply leave the original
        if (image) {
            product.imageUrl = image.path;
        }
        product.description = description;

        await product.save();

        return res.status(201).json({
            message: 'Product updated successfully',
            data: product,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    const prodId = req.params.id;

    try {
        let result = await Product.destroy({
            where: {
                id: prodId,
                userId: req.user.id,
            },
        });

        if (result == 0) {
            return res.status(403).json({
                message: 'This is not your product to delete',
            });
        }

        return res.status(200).json({
            message: 'Product deleted successfully',
        });
    } catch (err) {
        console.log(err);
    }
};
