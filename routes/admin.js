//const path = require('path');
//const rootDir = require('../helpers/path');

const productsController = require("../controllers/adminMDB");
const express = require("express");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

/* 
    get y post pueden tener la misma ruta xk son metodos diferentes
    /admin se usa como filtro, 
*/

// // /admin/add-product => GET
router.get("/add-product", isAuth, productsController.getAddProduct);
// // /admin/add-product => POST
router.post("/add-product", isAuth, productsController.postAddProduct);
router.get("/products", isAuth, productsController.getProducts);

router.get(
  "/edit-product/:productId",
  isAuth,
  productsController.getEditProduct
);
router.post("/edit-product", isAuth, productsController.postEditProduct);
router.post("/delete-product", isAuth, productsController.postDeleteProd);

module.exports = router;

//exports.routes = router;
//exports.productos = productos;
