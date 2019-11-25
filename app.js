const path = require("path");
const express = require("express");

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");

const bodyParser = require("body-parser");
const errorsController = require("./controllers/errors");

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

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", errorsController.get404);

app.listen(3000);
