const rootDir = require("../helpers/path");
const path = require("path");
const fs = require("fs").promises;

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = async () => {
  try {
    const data = await fs.readFile(p);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

module.exports = class Producto {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  async save() {
    try {
      let productos = await getProductsFromFile();
      if (this.id) {
        const existingProductIndex = productos.findIndex(
          prod => prod.id === this.id
        );
        const updatedProducts = [...productos];
        updatedProducts[existingProductIndex] = this;
        await fs.writeFile(p, JSON.stringify(updatedProducts), err =>
          console.log(err)
        );
      } else {
        this.id = Math.random().toString();
        //productos = JSON.parse(data);
        //console.log(productos);
        productos.push(this);
        await fs.writeFile(p, JSON.stringify(productos), err =>
          console.log(err)
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteProd(id) {
    try {
      let productos = await getProductsFromFile();
      const prodToDeleteIndex = productos.findIndex(prod => prod.id === id);
      console.log(prodToDeleteIndex);
      //console.log(productos[prodToDeleteIndex]);
      if (prodToDeleteIndex > -1) {
        // filter, en este caso, regresa todos los elementos que no coincidan con el id enviado
        let updatedProducts = productos.filter(prod => prod.id !== id);
        console.log(updatedProducts);
        //await fs.writeFile(p, JSON.stringify(updatedProducts), err =>
        //console.log(err);
        // );
      } else {
        console.log("ID de Producto no valido");
      }
    } catch (err) {
      console.log("Error desde metodo deleteProd");
      console.log(err);
    }
  }

  static fetchAll() {
    return getProductsFromFile();
  }

  static async findById(id) {
    try {
      const products = await getProductsFromFile();
      const product = products.find(p => p.id === id);
      return product;
    } catch (err) {
      console.log(err);
    }
  }
};
