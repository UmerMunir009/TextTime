const Joi = require("joi");


const packagePrivilege  = Joi.object({
  name: Joi.string().required(),
  packageId: Joi.string().required(),
});



module.exports = packagePrivilege;
