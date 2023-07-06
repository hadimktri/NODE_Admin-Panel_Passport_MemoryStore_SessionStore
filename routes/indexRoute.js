const express = require("express");
const router = express.Router();
const User = require("../models/userModel").userModel;
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
require("../middleware/passport");

router.get("/", (req, res) => {
  res.render("login",
    { user: req.user })
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard",
    { user: req.user });
});

router.get("/adminPage", isAdmin, (req, res) => {
  const activeUserS = [];
  req.sessionStore.all((err, usersObj) => {
    Object.keys(usersObj).forEach(cookie => {
      const activeUser = (User.findById(usersObj[cookie].passport.user));
      req.user.id !== activeUser.id ? activeUserS.push([cookie, activeUser.name]) : '';
    })
    res.render("adminPage", { user: req.user, activeUsers: activeUserS });
  });
})
module.exports = router;
