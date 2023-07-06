require('dotenv').config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controllers/userController");
const userDatabase = require("../models/userModel").database;
const GitHubStrategy = require('passport-github').Strategy;
const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
        message: "Your login details are not valid. Please try again",
      });
  }
);

const gitLogin = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    const user = userController.getUserById(Number(profile.id));
    if (user) {
      done(null, user)
    } else {
      const user = {
        id: (Number(profile.id)),
        name: (profile.username),
        email: (profile.profileUrl),
      }
      userDatabase.push(user)
      done(null, user)
    }
  }
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin), passport.use(gitLogin);
