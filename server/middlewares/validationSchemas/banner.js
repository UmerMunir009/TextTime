const Joi = require("joi");

const BannerValidationSchema = Joi.object({  
    imageId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Image ID must be a valid UUID.",
      "any.required": "Image ID is required.",
    }),
  startTime: Joi.date()
    .required()
    .messages({
      "date.base": "Start time must be a valid date.",
      "any.required": "Start time is required.",
    }),
  endTime: Joi.date()
    .greater(Joi.ref("startTime"))
    .required()
    .messages({
      "date.base": "End time must be a valid date.",
      "date.greater": "End time must be later than the start time.",
      "any.required": "End time is required.",
    }),
    country: Joi.string()
    .required().messages({
      "any.required": "Country must be required.",
    })
});


module.exports = BannerValidationSchema;
