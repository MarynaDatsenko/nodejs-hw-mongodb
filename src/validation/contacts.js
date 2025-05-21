import Joi from "joi";

export const createContactSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Name should be a string',
        'string.min': 'Name should have at least {#limit} characters',
        'string.max': 'Name should have at most {#limit} characters',
        'any.required': 'Name is required',
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Phone number should be a string',
        'string.min': 'Phone number should have at least {#limit} characters',
        'string.max': 'Phone number should have at most {#limit} characters',
        'any.required': 'Phone number is required',
    }),
    email: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .messages({
      'string.base': 'email should be a string',
      'string.min': 'email should have at least 3 characters',
      'string.max': 'email should have at most 50 characters',
      'string.pattern.base': 'Invalid email format',
    }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string()
        .min(3)
        .max(20)
        .valid('work', 'home', 'personal')
        .required(),
});

export const updateContactSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .messages({
      'string.base': 'email should be a string',
      'string.min': 'email should have at least 3 characters',
      'string.max': 'email should have at most 50 characters',
      'string.pattern.base': 'Invalid email format',
    }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string()
        .min(3)
        .max(20)
        .valid('work', 'home', 'personal'),
});
