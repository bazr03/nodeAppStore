const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Agregar Producto",
    path: "/admin/add-product",
    editing: false
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  try {
    product = await Product.findById(prodId);
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Editar producto",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProd = (req, res, next) => {
  const prodId = req.body.productId;
  //console.log(prodId);
  Product.deleteProd(prodId);
  res.redirect("/admin/products");
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect("/");
  //res.redirect(path.join(rootDir, 'views' , 'shop.html'));
};

exports.getProducts = async (req, res, next) => {
  // path root "/" es el default
  //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  // Product.fetchAll( productos => {
  //   res.render('shop', {prods:productos, pageTitle:"Shop", path:'/'}); // render utiliza el template enige especificado en app.js (p.ej. ejs)
  // } );
  try {
    const productos = await Product.fetchAll();
    //console.log(productos);
    res.render("admin/products", {
      prods: productos,
      pageTitle: "Productos",
      path: "/admin/products"
    });
  } catch (err) {
    console.log(err);
  }
};
