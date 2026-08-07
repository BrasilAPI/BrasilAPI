import Joi from 'joi';

export const igpmSchema = Joi.array()
  .items(
    Joi.object({
      data: Joi.string(),
      valor: Joi.string(),
    })
  )
  .min(1)
  .required();
