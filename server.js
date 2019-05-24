"use strict";

require('dotenv').config();

//////////////////// REQUIREMENTS ////////////////////
const PORT            = process.env.PORT || 8080;
const ENV             = process.env.ENV || "development";
const express         = require("express");
const bodyParser      = require("body-parser");
const bcrypt          = require('bcrypt');
const saltRounds      = 10;
const sass            = require("node-sass-middleware");
const cookieSession   = require('cookie-session');
const app             = express();
const helperFunctions = require('./lib/util/helper_functions');
const methodOverride  = require('method-override')
const knexConfig      = require("./knexfile");
const knex            = require("knex")(knexConfig[ENV]);
const morgan          = require('morgan');
const knexLogger      = require('knex-logger');

// Separated Routes for each Resource
const usersRoutes     = require("./routes/users");



//////////////////// MIDDLEWARE ////////////////////
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

// To handle PUT form submissions
app.use(methodOverride('_method'))


app.use(express.static(__dirname + '/public/HTML'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));


//////////////////// POST METHODS ////////////////////

// sign-in form
app.post("/sign-in", (req, res) => {
  if (!req.body.email) {
    res.send("Empty email field. Please try again.")
  }
  if (req.body.password.length === 0) {
    res.send("Empty password field. Please try again.")
  }
  helperFunctions.authenticate(knex, req.body.email, req.body.password)
    .then(result => {
      if (result) {
        helperFunctions.findId(knex, req.body.email)
        .then(user => {
          console.log(user)
          req.session.user_id = user;
          console.log(req.session.user_id);
          res.redirect("/")
        })
      } else {
        res.send("Wrong password or email. Please try again.")
      };
    });
});

//Register page
app.post("/register", (req, res) => {
  const {
    email,
    password
  } = req.body

  //check if email and password exists
  if (email.length === 0 || password.length === 0) {
    res.status(400).send('Email or password is empty')
  } else {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    knex('user_credentials').insert({
        email: email,
        password: hashedPassword
      }).returning('id')
      .then((ids) => {
        req.session.user_id = ids[0]
        res.status(200).send('Ok')
      })
      .catch(error => {
        res.status(400).send(error)
      })
  }
});

// logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


//////////////////// PUT METHODS ////////////////////

// update user-password
app.put("/update-profile", (req, res) => {
  // add cookie session here?  
  let inputEmail = req.body.email;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  helperFunctions.updatePassword(knex, inputEmail, oldPassword, newPassword)
    .then((result) => {
        if (result) {
          res.send("Password successfully changed.")
        }
        res.send("Wrong password. Please try again.")
    })
});

app.get("/update-profile", (req, res) => {
  res.render("/update-profile")
});

app.get("/sign-in", (req, res) => {
  res.render("/sign-in")
});



//////////////////// GET METHODS ////////////////////

// Home page
app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
