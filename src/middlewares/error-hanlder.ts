import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

interface APIError {
  statusCode: number;
  message: string;
}

const errorHandler: ErrorRequestHandler = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: { message } });
};

export default errorHandler;
