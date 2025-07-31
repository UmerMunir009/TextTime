const joi = require("joi");

const schema = joi.object({
    day: joi.number().required().positive().messages({
        'any.required': 'Day is required',
    }),
    type: joi.string().valid('diamonds', 'inBoradBullet', 'publicBullet', 'frame', 'effect').required().messages({
        'string.base': "Type must be string",
        'any.required': "Type is required",
    }),
    frameId: joi.string().guid({ version: ['uuidv4'] }).optional().allow('').messages({
        'string.guid': "frameId must be valid UUID",
    }),
    entranceEffectId: joi.string().guid({ version: ['uuidv4'] }).optional().allow('').messages({
        'string.guid': 'entranceEffectId must be valid UUID',
    }),
    points: joi.number().integer().optional().allow('').messages({
        'number.base': "Points must be a number",
        'number.integer': "Points must be an integer",
    }),
});

module.exports = schema;
