"use strict";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const register = function (user, callback) {
  knex('user_credentials').insert({
    email: user.email,
    password: user.password


  }).then(res => {
    res.json(results);
  })
}

module.exports = (knex) => {

  router.post("/register", (req, res) => {
    //check if the cookie exists
    if (req.session.user_id) {
      res.redirect('/')

      //check if email and password exists
    } else if (email.length === 0 || req.body.password.length === 0) {
      res.status(400).send('Email or password is empty')

    } else {
      register(req.body, (err) => {
        if (err) {
          res.status(500).send('Register error')
        } else {
          console.log('register success')
        }
      })
    }
  });

  return router;
}
