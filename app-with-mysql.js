const path = require("path");
const express = require("express");

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const bodyParser = require("body-parser");
const errorsController = require("./controllers/errors");
const sequelize = require("./helpers/databese");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // views es el de defualt, se pone solo por si el usuario utiliza otro nombre
// para esta carpeta
// .use() permite crear una función middleware
// la funcion que definamos en el middleware se ejecutara para cada una
// de las peticiones (incoming requests)
// app.use( (req, res, next) => {
//     console.log("In the middleware");
//     next(); // permite pasar al siguiente middleware
// } );

app.use(bodyParser.urlencoded({ extended: false })); // debe ir antes de cualquier middleware con un path
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // Todos los middlewares se ejectan solo cuando hay un request
  User.findByPk(1)
    .then(user => {
      req.user = user; // podemos agrarg cualquir campo al request, solo asegurarse de no
      // sobrescribir uno existente, p.ej. body
      next();
    })
    .catch(err => console.log(err)); // no cuando se ejectuta npm start
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", errorsController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true }) // { force: true } Solo usar force:true en desarrollo, xk genera las tablas cada que inicia
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: "Ivan",
        lastName: "Bazaldua",
        age: 33,
        email: "ivan@ibazaldua.com"
      });
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
