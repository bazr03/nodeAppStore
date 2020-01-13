const Product = require("../models/productMDB");
const Order = require("../models/orderMDB");

exports.getCartProduct = (req, res, next) => {
  req.user
    .populate("cart.items.productId") // este no regresa una promesa
    .execPopulate() // se ejecuta para obtener una promesa
    .then(user => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Product Cart",
        path: "/shop/cart",
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCard = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      //console.log(result);
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render("/shop/checkout", {
//     pageTitle: "Product Checkout",
//     path: "/shop/checkout"
//   });
// };

exports.getProducts = (req, res, next) => {
  Product.find()
    //Product.findAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Product List",
        path: "/shop/product-list"
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodID = req.params.productID;
  Product.findById(prodID)
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
  res.render("shop/index", {
    pageTitle: "Home",
    path: "/index"
  });
};

// exports.getCheckoutPage = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Product Checkout",
//     path: "/shop/checkout"
//   });
// };

exports.getOrdersPage = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/shop/orders",
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user // mongoose se encarga de extraer ek Id
        },
        products: products
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};
