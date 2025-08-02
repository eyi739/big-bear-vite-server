import Joi from 'joi';

export const productSchema = Joi.object({
  
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().required,
      category: Joi.string().required(),
      description: Joi.string().required()

  })