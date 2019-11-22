const fs = require("fs").promises;
const path = require("path");
const rootDir = require("../helpers/path");

const p = path.join(rootDir, "data", "cart.json");

const getCartsFromFile = async () => {
  try {
    const carts = await fs.readFile(p);
    //console.log("Desde funcion getCartsFromFIle :");
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
      //console.log(cart);
      if (cart === undefined) {
        cart = { products: [], totalPrice: 0 };
      }
      //console.log(cart);
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

  static async deleteProduct(id, prodPrice) {
    try {
      let cartProducts = await getCartsFromFile();
      //console.log("desde Cart.deleteProduct");
      //console.log(cartProducts);
      if (!cartProducts) {
        return;
      }
      let updatedCart = { ...cartProducts };
      const product = updatedCart.products.find(prod => prod.id === id);
      const productQty = product.qty;
      //console.log(prodPrice);
      updatedCart.products = updatedCart.products.filter(
        prod => prod.id !== id
      );
      updatedCart.totalPrice = updatedCart.totalPrice - productQty * prodPrice;
      await fs.writeFile(p, JSON.stringify(updatedCart), err =>
        console.log(err)
      );
      //console.log(updatedCart);
    } catch (err) {
      console.log(err);
    }
  }

  static async getCart() {
    try {
      const cart = await getCartsFromFile();
      if (cart) {
        return cart;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  }
};
