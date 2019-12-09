const Product = require("../models/productMDB");
//const Cart = require("../models/cart");

exports.getCartProduct = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
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
    .deleteItemFromCart(prodId)
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
  Product.fetchAll()
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
  res.render("shop/index", { pageTitle: "Home", path: "/index" });
};

// exports.getCheckoutPage = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Product Checkout",
//     path: "/shop/checkout"
//   });
// };

// exports.getOrdersPage = (req, res, next) => {
//   req.user
//     .getOrders({ include: ["products"] })
//     .then(orders => {
//       res.render("shop/orders", {
//         pageTitle: "Your Orders",
//         path: "/shop/orders",
//         orders: orders
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then(products => {
//       return req.user
//         .createOrder()
//         .then(order => {
//           return order.addProducts(
//             products.map(product => {
//               product.orderItem = { quantity: product.cartItem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch(err => console.log(err));
//     })
//     .then(() => {
//       fetchedCart.setProducts(null);
//     })
//     .then(() => {
//       res.redirect("/orders");
//     })
//     .catch(err => console.log(err));
//
// };
