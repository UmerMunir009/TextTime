const Joi = require("joi");

const productCategory = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
});

module.exports = productCategory;
