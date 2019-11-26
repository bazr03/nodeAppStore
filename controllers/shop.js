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

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  await Cart.deleteProduct(prodId, product.price);
  res.redirect("/shop/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("/shop/checkout", {
    pageTitle: "Product Checkout",
    path: "/shop/checkout"
  });
};

exports.getProducts = (req, res, next) => {
  // path root "/" es el default
  //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  // Product.fetchAll( productos => {
  //   res.render('shop', {prods:productos, pageTitle:"Shop", path:'/'}); // render utiliza el template engine especificado en app.js (p.ej. ejs)
  // } );
  Product.findAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Product List",
        path: "/shop/product-list"
      });
    })
    .catch(err => console.log(err));

  // Product.fetchAll().then(([rows, fieldData]) => {
  //   // destructuring
  //   res.render("shop/product-list", {
  //     prods: rows,
  //     pageTitle: "Product List",
  //     path: "/shop/product-list"
  //   });
  // });
  //   .catch( err => console.log(err) );
  // try {
  //   const productos = await Product.fetchAll();
  //   res.render("shop/product-list", {
  //     prods: productos,
  //     pageTitle: "Product List",
  //     path: "/shop/product-list"
  //   });
  // } catch (err) {
  //   console.log(err);
  // }
};

exports.getProduct = (req, res, next) => {
  const prodID = req.params.productID;
  Product.findByPk(prodID)
    .then(product => {
      res.render("shop/product-details", {
        pageTitle: product.title,
        path: "/shop/product-list",
        product: product
      });
    })
    .catch(err => console.log(err));
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
