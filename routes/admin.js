//const path = require('path');
//const rootDir = require('../helpers/path');

const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const productsController = require("../controllers/adminMDB");
const isAuth = require("../middleware/is-auth");

/* 
    get y post pueden tener la misma ruta xk son metodos diferentes
    /admin se usa como filtro, 
*/

// // /admin/add-product => GET
router.get("/add-product", isAuth, productsController.getAddProduct);
// // /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    body("title")
      .isString()
      //.withMessage("Only alphanumeric characters are permited!")
      .isLength({ max: 150, min: 3 })
      .withMessage("Title lenght should not be longer than 150 characters")
      .trim(),
    body("imageUrl").isURL(),
    body("price")
      .isNumeric()
      .withMessage("Price must be a number!"),
    body("description", "Min length is 3 and max lenght is 400 characters")
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  productsController.postAddProduct
);
router.get("/products", isAuth, productsController.getProducts);

router.get(
  "/edit-product/:productId",
  isAuth,
  productsController.getEditProduct
);
router.post(
  "/edit-product",
  [
    body("title")
      .trim()
      .isString()
      //.withMessage("Only alphanumeric characters are permited!")
      .isLength({ max: 150, min: 3 })
      .withMessage(
        "Title lenght should not be longer than 150 characters and at least 3."
      )
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("imageUrl").isURL(),
    body("price")
      .isNumeric()
      .withMessage("Price must be a number!"),
    body("description")
      .isLength({ min: 5, max: 400 })
      .not()
      .isEmpty()
      .trim()
      .escape()
  ],
  isAuth,
  productsController.postEditProduct
);
router.post("/delete-product", isAuth, productsController.postDeleteProd);

module.exports = router;

//exports.routes = router;
//exports.productos = productos;
