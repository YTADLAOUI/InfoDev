const express = require("express");
const AuthController = require("../controllers/AuthController");

const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  res.render("login", { title: "Login Page" });
});

authRouter.get("/register", (req, res) => {
  res.render("register");
});

authRouter.post("/register", AuthController.register);

module.exports = authRouter;
