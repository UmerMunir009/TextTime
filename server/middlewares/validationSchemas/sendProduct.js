const Joi = require("joi");

// Schema for product body validation
const sendProductSchema = Joi.object({
    productId: Joi.string().uuid(),
  followerId: Joi.string().uuid(),
  duration: Joi.number().valid(1, 7, 30).required().messages({
    "any.only": "Duration must be one of the following values: 1, 7, 30.",
    "any.required": "Duration is required.",
  }),
  
 
});

module.exports  =  sendProductSchema        

