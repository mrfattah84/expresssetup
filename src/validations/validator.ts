import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate = (schema: Joi.AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Request body is required",
      });
    }

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

    req.body = value;
    next();
  };
};

export default validate;
