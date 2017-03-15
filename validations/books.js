'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    title: Joi.string()
      .required()
      .trim(),

    auther: Joi.string()
      .required()
      .trim(),

    genre: Joi.string()
      .required()
      .trim(),

    description: Joi.string()
      .required()
      .trim(),

    cover_url: Joi.string().uri()
      .required()
      .trim(),
  }
};
