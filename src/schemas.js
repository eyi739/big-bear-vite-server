import Joi from 'joi';

export const productSchema = Joi.object({
  
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().required(),
      category: Joi.string().required(),
      description: Joi.string().required()

  });

export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    })
  });