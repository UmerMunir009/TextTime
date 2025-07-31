const Joi = require("joi");

const familyRules = Joi.object({
  ruleType: Joi.string()
    .valid(
      "messageSend",
      "sendVoice",
      "broadcastShare",
      "rcoinsReceived",
      "diamondsSent",
      "familyCreationCharges"
    )
    .required()
    .empty('')
    .messages({
      "any.required": "ruleType is required",
      "string.empty": "ruleType cannot be an empty string",
    }),

  points: Joi.number()
    .required()
    .empty('')
    .messages({
      "any.required": "points is required",        
      "number.empty": "points cannot be empty",      
    }),
});

module.exports = familyRules;
