const Joi = require("joi");

// Schema for product body validation
const productSchema = Joi.object({
  name: Joi.string().required().max(255).messages({
    "string.empty": "Product name is required."
  }),
  pictureId: Joi.string().uuid().required().messages({
    "string.guid": "Picture ID must be a valid UUID.",
    "any.required": "Picture ID is required.",
  }),
  animationId: Joi.string().uuid(),
  categoryId: Joi.string().uuid().required().messages({
    "string.guid": "Category ID must be a valid UUID.",
    "any.required": "Category ID is required.",
  }),
  prices: Joi.object({
    1: Joi.number().positive().required().messages({
      "number.base": "Price for 1 day must be a number.",
      "number.positive": "Price for 1 day must be a positive number.",
      "any.required": "Price for 1 day is required.",
    }),
    7: Joi.number().positive().required().messages({
      "number.base": "Price for 7 days must be a number.",
      "number.positive": "Price for 7 days must be a positive number.",
      "any.required": "Price for 7 days is required.",
    }),
    30: Joi.number().positive().required().messages({
      "number.base": "Price for 30 days must be a number.",
      "number.positive": "Price for 30 days must be a positive number.",
      "any.required": "Price for 30 days is required.",
    }),
  })
    .required()
    .messages({
      "object.base": "Prices must be an object with valid keys.",
      "any.required": "Prices are required.",
    }),
});

// Schema for category params validation
const productCategoryParamSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    "string.guid": "Category ID must be a valid UUID.",
    "any.required": "Category ID is required in params.",
  }),
});


// Schema for category params validation
const productIdParamSchema = Joi.object({
    productId: Joi.string().uuid().required().messages({
      "string.guid": "Product ID must be a valid UUID.",
      "any.required": "Product ID is required in params.",
    }),
  });
  
// active product
  const productActive = Joi.object({
    action: Joi.string()
      .valid("active", "inactive") 
      .required()
      .messages({
        "any.only": "Action must be either 'active' or 'inactive'.",
        "any.required": "Action is required.",
      }),
  });
  
  

module.exports = {
  productSchema,        
  productCategoryParamSchema,  
  productIdParamSchema, 
  productActive,
};
