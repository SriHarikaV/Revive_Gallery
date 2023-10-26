const Joi = require("joi");

function validateProduct(body) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string()).required(),
    owner: Joi.string().required(), // Assuming owner is a string (user ID)
    price: Joi.number().required(),
    categories: Joi.array().items(Joi.string()).required(),
  });
  return schema.validate(body);
}

module.exports = { validateProduct };
