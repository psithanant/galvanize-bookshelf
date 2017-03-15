'use strict';

//authorization

const express = require('express');
const knex = require('../knex');
const checkToken = require('../auth_middleware');
const { camelizeKeys, decamelizeKeys } = require('humps');
const router = express.Router();
const ev = require('express-validation');
const validations = require('../validations/favorites');

router.get('/favorites', checkToken, (req, res, next) => {
  return knex('favorites')
    .where('user_id', req.user.userId)
    .join('books', 'favorites.book_id', 'books.id')
    .then((results) => {
      res.send(results.map(camelizeKeys));
    })
    .catch((err) => {
      console.err("err: " + err);
    });
});

router.get('/favorites/check', checkToken, (req, res, next) => {
  return knex('favorites')
    .where('user_id', req.user.userId)
    .where('book_id', req.query.bookId)
    .then((results) => {
      res.send(results.length === 1);
    });
});

const prepareResponse = (row) => {
  let resp = camelizeKeys(row);
  delete resp.updatedAt;
  delete resp.createdAt;
  return resp;
};

router.post('/favorites', checkToken, ev(validations.post), (req, res, next) => {
  return knex('favorites').insert({
    user_id: req.user.userId,
    book_id: req.body.bookId,
  }, '*').then((rows) => {
    res.send(prepareResponse(rows[0]));
  });
});

router.delete('/favorites', checkToken, (req, res, next) => {
  return knex('favorites')
    .where("user_id", req.user.userId)
    .where('book_id', req.body.bookId)
    .then((results) => {
      if (results.length === 0) {
        res.sendStatus(404);
        return;
      }
      return knex('favorites').del().where('id', results[0].id)
        .then((affectedRows) => {
          let resp = prepareResponse(results[0]);
          delete resp.id;
          res.send(resp);
        });
    });
});

module.exports = router;
