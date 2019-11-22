const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getCartProduct = async (req, res, next) => {
  const cart = await Cart.getCart();
  const products = await Product.fetchAll();
  const cartProducts = [];
  for (product of products) {
    const cartProductData = cart.products.find(prod => prod.id === product.id);
    if (cartProductData) {
      cartProducts.push({ productData: product, qty: cartProductData.qty });
    }
  }
  res.render("shop/cart", {
    pageTitle: "Product Cart",
    path: "/shop/cart",
    products: cartProducts
  });
};

exports.postCard = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  Cart.addProduct(prodId, product.price);
  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("/shop/checkout", {
    pageTitle: "Product Checkout",
    path: "/shop/checkout"
  });
};

exports.getProducts = async (req, res, next) => {
  // path root "/" es el default
  //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  // Product.fetchAll( productos => {
  //   res.render('shop', {prods:productos, pageTitle:"Shop", path:'/'}); // render utiliza el template enige especificado en app.js (p.ej. ejs)
  // } );
  try {
    const productos = await Product.fetchAll();
    res.render("shop/product-list", {
      prods: productos,
      pageTitle: "Product List",
      path: "/shop/product-list"
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodID = req.params.productID;
  const product = await Product.findById(prodID);
  res.render("shop/product-details", {
    pageTitle: product.title,
    path: "/shop/product-list",
    product: product
  });
};

exports.getIndex = (req, res, next) => {
  res.render("shop/index", { pageTitle: "Home", path: "/index" });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Product Checkout",
    path: "/shop/checkout"
  });
};

exports.getOrdersPage = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Product to order",
    path: "/shop/orders"
  });
};
