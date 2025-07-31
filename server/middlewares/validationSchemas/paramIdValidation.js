const Joi = require("joi");

const  IdParamsValidation = Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.guid": "Id must be a valid UUID.",
      "any.required": "Id is required in params.",
    }),
  });

  
  module.exports = IdParamsValidation