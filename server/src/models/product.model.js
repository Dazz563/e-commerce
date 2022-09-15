const fs = require('fs');
const path = require('path');

const Cart = require('./cart.model');

// Sets a global path to the data folder
const p = path.join(__dirname, '../', '../', 'data', 'products.json');

// Helper function for reading file and returning empty array is nothing exists
const getProductsFromFile = (cb) => {
    // fs module reads file from p - path
    fs.readFile(p, (err, fileContent) => {
        // check to see if an error is null (empty file)
        if (err) {
            return cb([]);
        }
        // callback will return the data parsed into JS
        cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            // check to see if the id exists when saving new entries if TRUE we are UPDATING
            if (this.id) {
                // UPDATING PRODUCT
                const existingProductIndex = products.findIndex((prod) => prod.id === this.id);
                // create a new copy of the products
                const updatedProducts = [...products];
                // below is important we use the found productIndex and save it with this (this refers to the parameter passed into the method)
                updatedProducts[existingProductIndex] = this;
                // write the newly updated array to the file
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {
                // ADDING NEW PRODUCT
                // this.id will be added as a property to the entire product object
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            // find returns the full product object
            const product = products.find((p) => p.id === id);
            // call back to recieve the product when it's done
            cb(product);
        });
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find((prod) => prod.id === id);
            const updatedProducts = products.filter((prod) => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }
};
