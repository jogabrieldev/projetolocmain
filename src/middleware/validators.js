
import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map(err => ({
    field: err.param,
    message: err.msg
  }));

  console.log("Erros de validação:", formattedErrors);

  return res.status(400).json({
    errors: formattedErrors
  });
};
