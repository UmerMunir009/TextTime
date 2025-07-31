const Joi = require('joi');


const sender_level_info = Joi.object({
  level: Joi.number().required().positive().messages({
    'any.required': 'Level is required.',
    'number.base': 'Level must be a number.',
  }),
  diamond: Joi.number().required().positive().messages({
    'any.required': 'Diamond is required',
    'number.base': 'Diamond must be a number.',
  }),
});

module.exports = sender_level_info