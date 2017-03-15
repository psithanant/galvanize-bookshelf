'use strict';

//authentication

const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');
const router = express.Router();
const ev = require('express-validation');
const validations = require('../validations/users');

router.get('/token', (req, res, next) => {
  if (!req.cookies.token) {
    res.send(false);
    return;
  }
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.status(400).send("bad cookies");
      return;
    }
    res.send(true);
  });
});

// use from a login page
router.post('/token', ev(validations.post), (req, res, next) => {
  knex('users').where('email', req.body.email)
    .then((rows) => {
      // user is one row
      const user = rows[0];
      // if no matching email, or found a user but with wrong password
      if (user === undefined || !bcrypt.compareSync(req.body.password, user.hashed_password)) {
        res.set('Content-type', 'text/plain');
        res.status(400).send("Bad email or password");
        return;
      }
      const payload = { userId: user.id }; //our session
      // JWT_KEY from .env file
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '7 days'
      });
      // set cookie in response.
      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: router.get('env') === 'production'
      });
      delete user.hashed_password;
      res.send(camelizeKeys(user));
    });
});

router.delete('/token', (req, res, next) => {
  res.cookie('token', '');
  res.send(true);
});

module.exports = router;
