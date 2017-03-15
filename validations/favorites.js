'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    bookId: Joi.number()
      .label('book_id')
      .required()
      .trim()
  }
};
