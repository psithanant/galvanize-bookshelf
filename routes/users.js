'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');
const { camelizeKeys, decamelizeKeys } = require('humps');
const bcrypt = require('bcrypt-as-promised');
/*
<form method="post" action="/users"">
Email: <input type="text" name="email"/>
Password: <input type="password" name="password"/>
...
<input type="submit" name="Submit"/>
</form>
*/
router.post('/users', function(req, res, next) {
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      return knex('users')
        .insert({
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hashed_password,
        }, '*'); // '*' means to return all the columns inserted
    })
    .then((users) => {
      const user = users[0];
      delete user.hashed_password;
      res.send(camelizeKeys(users[0]));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
