const fs = require("fs").promises;
const path = require("path");
const rootDir = require("../helpers/path");

const p = path.join(rootDir, "data", "cart.json");

const getCartsFromFile = async () => {
  try {
    const carts = await fs.readFile(p);
    console.log("Desde funcion getCartsFromFIle :");
    return JSON.parse(carts);
  } catch (err) {
    console.log(err);
  }
};

module.exports = class Cart {
  static async addProduct(id, productPrice) {
    // Fetch the previous Cart
    try {
      let cart = await getCartsFromFile();
      console.log(cart);
      if (cart === undefined) {
        cart = { products: [], totalPrice: 0 };
      }
      console.log(cart);
      //Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product / increase quantity if repeated
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      await fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }
};