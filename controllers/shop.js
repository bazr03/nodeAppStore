const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getCartProduct = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      //console.log(cart);
      return cart
        .getProducts()
        .then(products => {
          res.render("shop/cart", {
            pageTitle: "Product Cart",
            path: "/shop/cart",
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  // const cart = await Cart.getCart();
  // const products = await Product.fetchAll();
  // const cartProducts = [];
  // for (product of products) {
  //   const cartProductData = cart.products.find(prod => prod.id === product.id);
  //   if (cartProductData) {
  //     cartProducts.push({ productData: product, qty: cartProductData.qty });
  //   }
  // }
  // res.render("shop/cart", {
  //   pageTitle: "Product Cart",
  //   path: "/shop/cart",
  //   products: cartProducts
  // });
};

exports.postCard = (req, res, next) => {
  // const prodId = req.body.productId;
  // const product = await Product.findById(prodId);
  // Cart.addProduct(prodId, product.price);
  // res.redirect("/cart");
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => res.redirect("/cart"))
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  // const prodId = req.body.productId;
  // const product = await Product.findById(prodId);
  // await Cart.deleteProduct(prodId, product.price);
  // res.redirect("/shop/cart");
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
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
  req.user
    .getProducts()
    //Product.findAll()
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
  req.user
    .getOrders({ include: ["products"] })
    .then(orders => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/shop/orders",
        orders: orders
      });
    })
    .catch(err => console.log(err));
  // res.render("shop/orders", {
  //   pageTitle: "Product to order",
  //   path: "/shop/orders"
  //});
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(() => {
      fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};
