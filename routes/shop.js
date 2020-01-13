//const path = require('path');
//const rootDir = require('../helpers/path');

const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

const shopControllers = require("../controllers/shopMDB");

router.get("/product-list", shopControllers.getProducts);

router.get("/product-list/:productID", shopControllers.getProduct);

router.get("/cart", isAuth, shopControllers.getCartProduct);
router.post("/cart", isAuth, shopControllers.postCard);
router.post("/cart-delete-item", isAuth, shopControllers.postCartDeleteProduct);

// // router.get("/checkout", shopControllers.getCheckout);
router.get("/orders", isAuth, shopControllers.getOrdersPage);
router.post("/create-order", isAuth, shopControllers.postOrder);
router.get("/", shopControllers.getIndex);

module.exports = router;
