// post active schmea
const Joi = require("joi");

const updateFamilyStatus = Joi.object({
  status: Joi.string()
    .valid("Pending", "Active", "Blocked")
    .required()
    .messages({
      "any.only": "Status must be one of 'Pending', 'Active', or 'Blocked'.",
      "any.required": "Status is required.",
    }),
   blockedReason: Joi.string()
      .when("status", {
        is: "Blocked",
        then: Joi.required().messages({
          "any.required": "Blocked reason is required when status is 'Blocked'.",
          "string.base": "Blocked reason must be a string.",
        }),
        otherwise: Joi.optional(),
      }),
});

module.exports = updateFamilyStatus