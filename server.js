"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const bcrypt        = require('bcrypt');
const sass          = require("node-sass-middleware");
const cookieSession = require('cookie-session');
const app           = express();
const helperFunctions = require('./lib/util/helper_functions');

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));


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

// Home page
app.get("/", (req, res) => {
  res.render("index.html");
});

//standalone authentication-tester
// const help = helperFunctions.authenticate(knex, "adamcraveiro@gmail.com", "12334343")
// .then(result => {
//   display(result)
//   return result
// });

app.post("/sign-in", (req, res) => {
  helperFunctions.authenticate(knex, req.body.email, req.body.password)
  .then(result => {
    // check for true or false
    // console.log(result)
    if (result) {
      res.redirect("/")
    } else {
      res.redirect("/sign-in")
    };
  });
});

app.get("/sign-in", (req, res) => {
  res.render("sign-in")
});


$("#sign-in-form").on("submit", function(event) {
  event.preventDefault();
  helperFunctions.authenticate(knex, req.body.email, req.body.password)
  .then(result => {
    if (result) {
      $.ajax({
        method: "POST",
        url: $(this).attr("action"),
        data: $(this).serialize()
      }).done(function() {
        $("#main-container").empty();
        loadTweets();
      });
      res.redirect("/")
    } else {
      res.redirect("/sign-in")
    };
  });
    
  }
});


//register
app.post("/register", (req, res) => {
  //check if the cookie exists
  // if (req.session.user_id) {
  //   res.redirect('/')

  //check if email and password exists
  //} else 
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    res.status(400).send('Email or password is empty')

  } else {
    knex('user_credentials').insert({
      email: req.body.email,
      password: req.body.password
    }).then(res => {
      console.log('success')
    })
  }

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
