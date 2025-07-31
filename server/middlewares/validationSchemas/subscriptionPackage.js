const Joi = require("joi");


const subcriptionPackageSchema  = Joi.object({
  name: Joi.string().required(),
  price: Joi.string().required(),
});



module.exports = subcriptionPackageSchema;
