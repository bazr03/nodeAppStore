const Product = require("../models/productMDB");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Agregar Producto",
    path: "/admin/add-product",
    editing: false
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(() => {
      console.log("Product Created");
      res.redirect("/");
    })
    .catch(err => console.log(err));
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect("/");
//   }
//   const prodId = req.params.productId;
//   req.user
//     .getProducts({ where: { id: prodId } })
//     //Product.findByPk(prodId)
//     .then(products => {
//       // getProducts siempre regresa un arreglo, aun cuando solo
//       // tiene un elemento
//       const product = products[0]; // en este caso sabemos que nuestra busqueda siempre este en el primero
//       if (!product) {
//         return res.redirect("/");
//       }
//       res.render("admin/edit-product", {
//         pageTitle: "Editar producto",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product.dataValues
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDescription = req.body.description;
//   Product.findByPk(prodId)
//     .then(product => {
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.imageUrl = updatedImageUrl;
//       product.description = updatedDescription;
//       return product.save(); // para guardarlo a la base de datos, agregamos return
//       // para manejar la promesa regresado por save desde fuera y no nestear el codigo
//     })
//     .then(result => {
//       console.log("Updated Product");
//       res.redirect("/admin/products");
//     })
//     .catch(err => console.log(err));
// };

// exports.postDeleteProd = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then(product => {
//       return product.destroy();
//     })
//     .then(result => {
//       console.log("PRODUCT DESTROYED");
//       res.redirect("/admin/products");
//     })
//     .catch(err => console.log(err));
//   //Product.deleteProd(prodId);
// };

// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts()
//     //Product.findAll()
//     .then(products => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Productos",
//         path: "/admin/products"
//       });
//     })
//     .catch(err => console.log(err));
// };
