const bcrypt = require("bcryptjs");
const User = require("../models/userMDB");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SEND_GRID_TANSPORT_API_KEY
    }
  })
);

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req
  //   .get("Cookie")
  //   .split("=")[1]
  //   .trim(); // elimina cualquir espacio no deseado
  // console.log(isLoggedIn);
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  //  console.log(message);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: { email: "", password: "" }
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  //req.isLoggedIn = true;
  //res.setHeader("Set-Cookie", "LoggedIn=true");
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      // return aqui para no ejecutar el codigo fuera del if
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password }
    });
  }
  // Esta parte solo se ejecuta si no hay errores
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render("auth/login", {
          // return aqui para no ejecutar el codigo fuera del if
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password.",
          oldInput: { email: email, password: password }
        });
      }
      bcrypt
        .compare(password, user.password) // regresa True si coinciden, false si no
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err); // redirigir solamente despues de asegurarse que la sesion
              res.redirect("/"); // fue guardada en la base de datos
            });
          }
          return res.status(422).render("auth/login", {
            // return aqui para no ejecutar el codigo fuera del if
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password.",
            oldInput: { email: email, password: password }
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  }); // metodo proporcionado por el paquete de session que estamos usando
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg, // envia solo el primer mensaje de error
      oldInput: {
        name: name,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
      return transporter
        .sendMail({
          to: email,
          from: "shopICBR@node-complete.com",
          subject: "Signup Succeded!",
          html: "<h1>Congratulations! You sucessfully signed up!</h1>"
        })
        .catch(err => console.log(err));
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex"); // es necesario especificar formato de entrada, en este caso
    // es hexadecimal
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 360000 equivale a una hora en ms
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "shopICBR@node-complete.com",
          subject: "Password Reset",
          html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost/reset/${token}" >link</a>  to set a new password</p>
              `
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
  // FindONe que cumple 2 condiciones, que el token sea el mismo y que
  // la fecha de expiracion guardada en la base de datos sea mayor ($gt =  greater then,
  // operador de mondodb) que la fecha en la cual se hace el intento de cambiar la contra
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.token = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect("/login");
      // aqui se podria enviar un email confirmando
      // el reseteo del password
    })
    .catch(err => console.log(err));
};
