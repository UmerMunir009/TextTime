const Joi = require('joi');


const hostLevelInfo = Joi.object({
  level: Joi.number().required().positive().messages({
    'any.required': 'Level is required.',
    'number.base': 'Level must be a number.',
  }),
  rcoin: Joi.number().required().positive().messages({
    'any.required': 'rcoin is required ',
    'number.base': 'rcoin must be a number.',
  }),
 
});

module.exports = hostLevelInfo