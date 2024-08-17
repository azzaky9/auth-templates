import type { Response } from "express";

type ErrorNameIdentifier =
  | "ValidationError"
  | "NotFoundError"
  | "InternalError"
  | "Unauthorized";

class ErrorHandler extends Error {
  status: number;
  errors?: any;

  constructor(name: ErrorNameIdentifier, message: string, status: number) {
    super(message);
    this.name = name;
    this.status = status;
    this.message = message;
  }

  static handleException(error: any, res: Response) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        code: 400,
        message: "Bad Request",
        errors: error.message
      });
    } else if (error.name === "NotFoundError" || error.code === "P2025") {
      return res.status(404).json({
        code: 404,
        message: "Bad Request",
        errors:
          !!error.message && error.code !== "P2025"
            ? error.message
            : "Resource not found"
      });
    } else if (error.name === "Unauthorized") {
      return res.status(403).json({
        code: 403,
        message: "Unauthorized",
        errors: "Invalid Credentials"
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Internal Server Error"
      });
    }
  }
}

export default ErrorHandler;
