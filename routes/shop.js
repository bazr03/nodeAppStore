//const path = require('path');
//const rootDir = require('../helpers/path');

const express = require("express");
const router = express.Router();

const shopControllers = require("../controllers/shop");

router.get("/product-list", shopControllers.getProducts);

router.get("/product-list/:productID", shopControllers.getProduct);

router.get("/cart", shopControllers.getCartProduct);
router.post("/cart", shopControllers.postCard);
router.post("/cart-delete-item", shopControllers.postCartDeleteProduct);

router.get("/checkout", shopControllers.getCheckout);
router.get("/orders", shopControllers.getOrdersPage);
router.post("/create-order", shopControllers.postOrder);
router.get("/", shopControllers.getIndex);

module.exports = router;
