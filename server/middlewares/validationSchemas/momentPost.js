const Joi = require("joi");


const momentSchema = Joi.object({
  description: Joi.string().allow('').optional(),
  mention: Joi.alternatives()
    .try(
      Joi.string(), 
      Joi.array().items(Joi.string()) 
    )
    .allow('')
    .optional(),
  file: Joi.string().required().messages({
    'any.required': 'File is required when "file" key is provided.'
  }).optional(),
  topics: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(Joi.string()) 
    )
    .allow('')
    .optional(),
});

   

// post like schmea
const postLikeSchema = Joi.object({
  postId: Joi.string().required().uuid().messages({
    "string.guid": "Picture ID must be a valid UUID.",
    'any.required': 'Post ID is required.'
  }),
  emoji: Joi.string().required().messages({
    'string.base': 'Emoji must be a string.',
    'any.required': 'Emoji is required.'
  })
});


// post Comment schmea
const postCommentSchema = Joi.object({
  postId: Joi.string().required().uuid().messages({
    "string.guid": "Picture ID must be a valid UUID.",
    'any.required': 'Post ID is required.'
  }),
  comment: Joi.string().required().messages({
    'string.base': 'Comment must be a string.',
    'any.required': 'Comment is required.'
  })
});

// post active schmea
const postActiveSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "active", "rejected")
    .required()
    .messages({
      "any.only": "Status must be one of 'pending', 'active', or 'rejected'.",
      "any.required": "Status is required.",
    }),

    rejectReason: Joi.string()
    .optional() 
    .allow('') 
    .messages({
      "string.base": "Reject reason must be a string.",
    }),
});



module.exports =  
{ 
  momentSchema,
  postLikeSchema,
  postCommentSchema,
  postActiveSchema,
};
