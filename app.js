const path = require("path");
const express = require("express");
const mongoose = require("mongoose"); // al usar mongoose ya no es necesario usar el
// helper mongoDB.js
const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const authRoutes = require("./routes/auth.js");
const errorsController = require("./controllers/errors");
const User = require("./models/userMDB");
const session = require("express-session");
const MongoDbSessionStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const bodyParser = require("body-parser");
const app = express();
//const mongoConnect = require("./helpers/mongoDB").mongoConnect;

const MONGODB_URI =
  "mongodb+srv://ibazaldua:PfzCZQEPwo439Mqa@cluster0-ekgux.mongodb.net/shop";

const csrfProtection = csrf();

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
const store = new MongoDbSessionStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

app.use(bodyParser.urlencoded({ extended: false })); // debe ir antes de cualquier middleware con un path
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next(); // si no hay usuarios loggeados no ejecutar el codigo User.findById
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
// app.use((req, res, next) => {
//   //Todos los middlewares se ejectan solo cuando hay un request
//   console.log("Iniciando consulta a MongoDb");
//   User.findById("5df06d64bb32fd3d2f202af5")
//     .then(user => {
//       req.user = user;
//       //console.log(user);
//       next();
//     })
//     .catch(err => console.log(err)); // no cuando se ejectuta npm start
// });

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/", errorsController.get404);

// mongoConnect(() => {
//   console.log("Servidor iniciado en el puerto 3000");
//   app.listen(3000);
// });

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Iván Bazaldúa",
    //       email: "ibazaldua@mail.com",
    //       cart: {
    //         items: []
    //       }
    //     });
    //     user.save();
    //   }
    // });
    console.log("Servidor iniciado en el puerto 3000");
    app.listen(3000);
  })
  .catch(err => console.log(err));
