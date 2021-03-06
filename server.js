"use strict";

require("dotenv").config();

//////////////////// REQUIREMENTS ////////////////////
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sass = require("node-sass-middleware");
const cookieSession = require('cookie-session');
const app = express();
const helperFunctions = require('./lib/util/helper_functions');
const ogs = require('open-graph-scraper');
const methodOverride = require('method-override')
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");

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
app.use(morgan("dev"));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

// To handle PUT form submissions
app.use(methodOverride("_method"));

app.use(express.static(__dirname + "/public/HTML"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));


//////////////////// POST METHODS ////////////////////

// sign-in form
app.post("/sign-in", (req, res) => {

  if (helperFunctions.loggedOn(req)) {
    res.redirect("/");
    return;
  }
  if (!req.body.email) {
    res.send("Empty email field. Please try again.");
    return;
  }
  if (req.body.password.length === 0) {
    res.send("Empty password field. Please try again.");
    return;
  }
  helperFunctions
    .authenticate(knex, req.body.email, req.body.password)
    .then(result => {
      if (result) {
        helperFunctions.findId(knex, req.body.email).then(user => {
          req.session.user_id = user;
          // res.redirect("/");
          res.json({
            success: true,
          })
        });
      } else {
        // res.send("Wrong password or email. Please try again.");
        res.json({
          success: false,
        })
      }
    });
});

//Register page
app.post("/register", (req, res) => {
  if (helperFunctions.loggedOn(req)) {
    res.redirect("/");
  }
  const {
    email,
    password
  } = req.body;

  //check if email and password exists
  if (email.length === 0 || password.length === 0) {
    res.status(400).send("Email or password is empty");
  } else {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    knex("user_credentials")
      .insert({
        email: email,
        password: hashedPassword
      })
      .returning("id")
      .then(ids => {
        req.session.user_id = ids[0];
        res.status(200).send("Ok");
      })
      .catch(error => {
        res.status(400).send(error);
      });
  }
});

//create a new link
app.post("/links", (req, res) => {
  if (req.session.user_id) {
    const {
      title,
      description,
      url,
      category
    } = req.body;
    console.log("req!", req.body);

    knex("links")
      .insert({
        title: title,
        description: description,
        url: url,
        category: category,
        created_at: new Date(),
        user_id: req.session.user_id
      })
      .then(links => {
        console.log("table", links);
        res.status(200).send("Ok");
      });
  }
});

// Make a new comment
app.post("/comments", (req, res) => {

  const { link_id } = req.body;
  if (req.session.user_id) {
    console.log('idid:', req.session.user_id)
    // const {comment} = req.body;
    console.log("body text", req.body.text);

    knex("comments")
      .insert({
        comment: req.body.text,
        link_id,
        user_id: req.session.user_id
      })
      .then(comments => {
        console.log("table", comments);
        res.json({
          comment: req.body.text
        })
      });
  }

});


// logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

//////////////////// PUT METHODS ////////////////////

// update user-password
app.put("/update-profile", (req, res) => {
  if (!helperFunctions.loggedOn(req)) {
    res.redirect("/");
  }
  let inputEmail = req.body.email;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  helperFunctions
    .updatePassword(knex, inputEmail, oldPassword, newPassword)
    .then(result => {
      if (result) {
        res.redirect("/");
        return;
      }
      res.redirect("/");
    });
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

app.get("/update-profile", (req, res) => {
  if (!helperFunctions.loggedOn(req)) {
    res.redirect("/");
  }
  res.render("/update-profile");
});

app.get("/sign-in", (req, res) => {
  if (helperFunctions.loggedOn(req)) {
    res.redirect("/");
  }
  res.render("/sign-in");
});

//get links
app.get("/links", (req, res) => {
  //check if query string exists, search that query in the database and show the ones that have the key
  const {
    key
  } = req.query;
  if (key) {
    knex
      .select("*")
      .from("links")
      .where("title", "like", `%${key}%`)
      .orWhere("description", "like", `%${key}%`)
      .then(links => {
        const promises = links.map(link => {
          const options = {
            url: link.url
          };
          return ogs(options).then(response => {
            link.imgUrl = response.data.ogImage.url;
            return link;
          });
        });
        Promise.all(promises).then(links => {
          console.log("nev", links);
          res.send(links);
        });
      });
  } else {
    knex
      .select("*")
      .from("links")
      .then(links => {
        const promises = links.map(link => {
          const options = {
            url: link.url
          };
          return ogs(options).then(response => {
            link.imgUrl = response.data.ogImage.url;
            return link;
          });
        });
        Promise.all(promises).then(links => {
          console.log("nev", links);
          res.send(links);
        });
      });
  }
});

// Get comments
app.get("/comments/:link_id", (req, res) => {

  const link_id = req.params.link_id;

  knex
    .select("comment")
    .from("comments")
    .where({ link_id })
    .then(comments => {
      console.log('waht are you?: ', comments);
      res.send(comments);
    });
})


// Popup-link show creator, title and description of the link
app.get("/links/:link_id", (req, res) => {
  knex("links").leftOuterJoin("user_credentials", "links.user_id", "=", "user_credentials.id")
    .select("*")
    .where("links.id", "=", `${req.params.link_id}`)
    .then(link => {
      console.log(link)
      res.send(link)
    });
})

// container page shows the collection of links created or liked by the user
app.get("/container", (req, res) => {
  knex("links")
    .select("*")
    .where("links.user_id", "=", req.session.user_id)
    .then(userLinks => {
      knex("links").innerJoin("likes", "links.id", "=", "likes.link_id")
        .select("*")
        .where("likes.user_id", "=", req.session.user_id)
        .then(userLikes => {
          knex("user_credentials")
            .select("email")
            .where("id", req.session.user_id)
            .then(email => {
              const linksByUser = {
                email: email[0].email,
                ownLinks: userLinks,
                likedLinks: userLikes
              }
              res.json(linksByUser)
            })
        });
    });
})
// //get a link
// app.get("/link", (req, res) => {
//   console.log('bip;', req.body)
// });

//like
// app.get("/links/:id/like", (req, res) => {
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
    } = req.body;
    console.log("links body", req.body);

    knex("links")
      .insert({
        title: title,
        description: description,
        url: url,
        category: category,
        created_at: new Date(),
        user_id: req.session.user_id
      })
      .then(links => {
        console.log("table", links);
        res.status(200).send("Ok");
      });
  }
});

app.get("/check_user", (req, res) => {
  const value = helperFunctions.loggedOn(req)
  res.json({
    loggedOn: value
  })
})

// app.get('/:link', (req, res) => {
//   console.log(req.params.link);
// })

//like links
app.post("/like", (req, res) => {
  console.log("reqq", req.body)

  knex
    .select("*")
    .from("likes")
    .where("link_id", "=", req.body.link_id)
    .then(like => {
      console.log("likes", like);

      if (like.length > 0) {
        knex('likes')
          .where('link_id', req.body.link_id)
          .del().then(rows => {
            res.status(200).send({
              liked: false
            })
          })

      } else {
        knex("likes")
          .insert({
            link_id: req.body.link_id,
            user_id: req.session.user_id,
          }).then(like => {
            console.log("like", like);
            res.status(200).send({
              liked: true
            })
          })
      }
    });
})

app.get('/person', (req, res) => {
  res.json({
    id: req.session.user_id
  })
})


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
