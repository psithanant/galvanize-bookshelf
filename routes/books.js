'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../knex');
const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');
const ev = require('express-validation');
const validations = require('../validations/users');

router.get('/books', function(req, res, next) {
  return knex('books')
    .orderBy('title')
    .then((result) => {
      let resBody = [];
      for (let row of result) {
        resBody.push(camelizeKeys(row));
      }
      res.send(resBody);
    })
    .catch((err) => {
      next(err);
    });
});
// <a href="/books/3">go see book #3!!!</a>
router.get('/books/:id', function(req, res, next) {
  let id = Number(req.params.id);
  return knex('books')
    .where('id', id)
    .then((result) => {
      //result = [{}]
      let book = result[0];
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', ev(validations.post), function(req, res, next) {
  let book = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl,
    created_at: new Date(),
    updated_at: new Date()
  };
  knex('books').insert(book)
    .returning('id') //getting book's id after inserting
    .then((result) => {
      // result is [id]
      book.id = result[0];
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', function(req, res, next) {
  let id = Number(req.params.id);
  return knex('books')
    .update(decamelizeKeys(req.body))
    .then(() => {
      return knex('books').where('id', id);
    })
    .then((result) => {
      let book = result[0];
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', function(req, res, next) {
  let id = Number(req.params.id);
  return knex('books').where('id', id)
    .then((result) => {
      let book = result[0];
      delete book.id;
      res.send(camelizeKeys(book));
    })
    .then(() => {
      knex('books').where('id', id).del();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
