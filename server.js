"use strict";

require('dotenv').config();

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
const ogs = require('open-graph-scraper');
const methodOverride  = require('method-override')

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

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

// Home page
app.get("/", (req, res) => {
  res.render("index.html");
});

// //get links helper function
// function getUrlImage(links) {
//   const promises = links.map(link => {
//     const options = {
//       'url': link.url
//     }
//     return ogs(options)
//       .then(response => {
//         link.imgUrl = response.data.ogImage.url;
//         return link;
//       })
//   })
//   Promise.all(promises)
//     .then(links => {
//       console.log('nev', links);
//       res.send(links)
//     });
// }

//get links
app.get("/links", (req, res) => {
  //check if query string exists, search that query in the database and show the ones that have the key
  const {
    key
  } = req.query
  if (key) {
    knex.select('*')
      .from('links')
      .where('title', 'like', `%${key}%`)
      .orWhere('description', 'like', `%${key}%`)
      .then((links) => {
        const promises = links.map(link => {
          const options = {
            'url': link.url
          }
          return ogs(options)
            .then(response => {
              link.imgUrl = response.data.ogImage.url;
              return link;
            })
        })
        Promise.all(promises)
          .then(links => {
            console.log('nev', links);
            res.send(links)
          });
      })
  } else {
    knex.select('*').from('links').then((links) => {
      const promises = links.map(link => {
        const options = {
          'url': link.url
        }
        return ogs(options)
          .then(response => {
            link.imgUrl = response.data.ogImage.url;
            return link;
          })
      })
      Promise.all(promises)
        .then(links => {
          console.log('nev', links);
          res.send(links)
        });
    })
  }
});


// //get a link
// app.get("/links/:id", (req, res) => {
//   console.log(req.body)
// });


//create a new link
app.post("/links", (req, res) => {
  if (req.session.user_id) {
    const {
      title,
      description,
      url,
      category
    } = req.body
    console.log('req!', req.body)

    knex('links').insert({
        title: title,
        description: description,
        url: url,
        category: category,
        created_at: new Date(),
        user_id: req.session.user_id,
      })
      .then((links) => {
        console.log('table', links)
        res.status(200).send('Ok')
      })
  }
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
