const rootDir = require("../helpers/path");
const path = require("path");
const fs = require("fs").promises;
const Cart = require("./cart");
const p = path.join(rootDir, "data", "products.json");

const db = require("../helpers/databese");

const getProductsFromFile = async () => {
  try {
    const data = await fs.readFile(p);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

module.exports = class Producto {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    // try {
    //   let productos = await getProductsFromFile();
    //   if (this.id) {
    //     const existingProductIndex = productos.findIndex(
    //       prod => prod.id === this.id
    //     );
    //     const updatedProducts = [...productos];
    //     updatedProducts[existingProductIndex] = this;
    //     await fs.writeFile(p, JSON.stringify(updatedProducts), err =>
    //       console.log(err)
    //     );
    //   } else {
    //     this.id = Math.random().toString();
    //     //productos = JSON.parse(data);
    //     //console.log(productos);
    //     productos.push(this);
    //     await fs.writeFile(p, JSON.stringify(productos), err =>
    //       console.log(err)
    //     );
    //   }
    // } catch (err) {
    //   console.log(err);
    // }

    // regresa una promesa
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?,?,?,?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static async deleteProd(id) {
    try {
      let productos = await getProductsFromFile();
      const prodToDeleteIndex = productos.findIndex(prod => prod.id === id);
      //console.log(prodToDeleteIndex);
      if (prodToDeleteIndex > -1) {
        let product = productos.find(prod => prod.id === id);
        console.log("Desde Product.deleteProd");
        //console.log(product);
        // filter, en este caso, regresa todos los elementos que no coincidan con el id enviado
        let updatedProducts = productos.filter(prod => prod.id !== id);
        fs.writeFile(p, JSON.stringify(updatedProducts))
          .then(() => {
            //console.log("JSON SAVED");
            Cart.deleteProduct(id, product.price);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log("ID de Producto no valido");
      }
    } catch (err) {
      console.log("Error desde metodo deleteProd");
      console.log(err);
    }
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    //   try {
    //     const products = await getProductsFromFile();
    //     const product = products.find(p => p.id === id);
    //     return product;
    //   } catch (err) {
    //     console.log(err);
    //   }

    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
