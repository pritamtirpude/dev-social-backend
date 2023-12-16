import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errors: errors.array(),
    });
  } else {
    next();
  }
};
