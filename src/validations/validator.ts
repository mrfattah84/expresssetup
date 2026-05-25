import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate = (schema: Joi.AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 'abortEarly: false' finds all errors, not just the first one
    // 'stripUnknown: true' removes fields not defined in your schema (Security Best Practice)
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: errorMessage,
      });
    }

    // Replace req.body with the sanitized 'value'
    // This ensures only your Joi-defined fields reach your controller
    req.body = value;
    next();
  };
};

export default validate;
