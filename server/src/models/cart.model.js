const fs = require('fs');
const path = require('path');

// // Sets a global path to the data folder
const p = path.join(__dirname, '../', '../', 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Read in the cart
        fs.readFile(p, (err, fileContent) => {
            // we store our cart here OR add an empty entry
            let cart = {products: [], totalPrice: 0};
            // check to see if the cart exists (null if FALSE)
            if (!err) {
                // 1. there is no error so we parse the existing cart here
                console.log(fileContent);
                cart = JSON.parse(fileContent);
            }
            // 2. at this point we know we have a cart and we can start analysing it
            // Find existing product to see if the prod we are trying to add already exists here
            const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            // Add new product/increase quantity
            let updatedProduct;
            // check to see if it existing
            if (existingProduct) {
                // 1. we are spreading the existing product and assigning it to an updated product
                updatedProduct = {...existingProduct};
                // 2. then adding the quantity count
                updatedProduct.qty = updatedProduct.qty + 1;
                // 3. spreading the old array into a new array
                cart.products = [...cart.products];
                // 4. overiding the old product with the new
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                // if we have a new product we add it
                updatedProduct = {id: id, qty: 1};
                // destructure the entire products array and add the new product
                cart.products = [...cart.products, updatedProduct];
            }
            // updating the carts total price with product price passed through
            cart.totalPrice = cart.totalPrice + +productPrice;
            // write it back to the file
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.findIndex((prod) => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
};
