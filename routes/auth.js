const express = require("express");
const { body } = require("express-validator");
const User = require("../models/userMDB");
const authController = require("../controllers/auth");
const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .custom((val, { req }) => {
        // customs checks
        // if (value === "test@test.com") {
        //   throw new Error("This email addres is forbiden!");
        // }
        // return true;
        return User.findOne({ email: val }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              "E-mail already exist, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 6 characters"
    ) // este mensaja sera el de dafualt para cualquier error dentro de este check
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(), // trim remueve espacios en blanco innecesarios
    // en produccion permitir simbolos especiales, no solo alpha numericos
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password does not match!");
        }
        return true;
      })
  ],
  authController.postSignup
);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password", "Password min lenght is 6 characters.")
      .isLength({
        min: 5
      })
      .trim()
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
