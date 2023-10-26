const Joi = require("joi");

function validateRegister(body) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(3).max(24).required(),
    firstName: Joi.string().min(3).max(24).required(),
    lastName: Joi.string().min(3).max(24).required(),
  });
  return schema.validate(body);
}

module.exports = { validateRegister };
