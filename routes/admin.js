//const path = require('path');
//const rootDir = require('../helpers/path');

const productsController = require("../controllers/adminMDB");
const express = require("express");

const router = express.Router();

/* 
    get y post pueden tener la misma ruta xk son metodos diferentes
    /admin se usa como filtro, 
*/

// /admin/add-product => GET
router.get("/add-product", productsController.getAddProduct);
// /admin/add-product => POST
router.post("/add-product", productsController.postAddProduct);
router.get("/products", productsController.getProducts);

router.get("/edit-product/:productId", productsController.getEditProduct);
router.post("/edit-product", productsController.postEditProduct);
router.post("/delete-product", productsController.postDeleteProd);

module.exports = router;

//exports.routes = router;
//exports.productos = productos;
