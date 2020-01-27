require("dotenv").config();

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
const multer = require("multer");

const bodyParser = require("body-parser");
const app = express();
//const mongoConnect = require("./helpers/mongoDB").mongoConnect;

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // el primer argumento (null) indica si hubo algun error y no se debe
    // guardar el archivo
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname); // originalname incluye la extension del archivo
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

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
  uri: process.env.MONGODB_URI,
  collection: "sessions"
});

app.use(bodyParser.urlencoded({ extended: false })); // debe ir antes de cualquier middleware con un path
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
); // el nombre image debe coincider con el asignado al input type='file' definido en el form
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
// por defualt express sirve la imagenes como si estuvieran en el directorio raiz
// p.ej /image01.png, pero no queremos eso , queremos mantener la estructura de folders
// tons agremas /images al al principio para que express las sirva como
// /images/image01.png
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
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next(); // si no hay usuarios loggeados no ejecutar el codigo User.findById
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
        // asegurarse de no guardar la sesion si el usuario no se
        // encuentra en la base de datos
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
      // throw new Error(err);
    });
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

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorsController.get500);

app.use("/", errorsController.get404);

app.use((error, req, res, next) => {
  //res.status(error.httpStatusCode).render(...);
  //res.redirect("/500");
  // console.log("Error enviado desde middleware error");
  // console.log("Sesion = " + req);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn
  });
});

// mongoConnect(() => {
//   console.log("Servidor iniciado en el puerto 3000");
//   app.listen(3000);
// });
//console.log(process.env);
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI)
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
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en el puerto ${PORT}`);
    });
  })
  .catch(err => console.log(err));
