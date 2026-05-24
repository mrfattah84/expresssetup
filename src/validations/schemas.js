import Joi from "joi";

export const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string().pattern(new RegExp("^(\\+98|0)?9\\d{9}$")),
  role: Joi.string().valid("STUDENT", "TEACHER", "ADMIN").default("STUDENT"),
});
