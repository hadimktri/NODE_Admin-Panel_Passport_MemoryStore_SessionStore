const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    err => next(err);
    res.redirect("login");
  });
});

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github',
  { failureRedirect: '/login' }),
  (req, res) => { res.redirect('/dashboard'); }
);

router.get("/kickOutUser/:cookie", (req, res, next) => {

  const cookie = req.params.cookie;
  req.sessionStore.destroy(cookie, () => {
    res.redirect("/adminPage");
  })
});

module.exports = router;
