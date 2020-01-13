const bcrypt = require("bcryptjs");
const User = require("../models/userMDB");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        "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"
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
    errorMessage: message
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
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  //req.isLoggedIn = true;
  //res.setHeader("Set-Cookie", "LoggedIn=true");
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
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
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
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
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "E-mail already exist.");
        return res.redirect("/signup");
      }
      return bcrypt
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
    })
    .catch(err => console.log(err));
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
