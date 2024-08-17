import * as v from "valibot";
import type { Request, Response } from "express";
import ErrorHandler from "@config/error-handler";
import { LoginSchema } from "@validation/auth.validation";
import {
  clearCookies,
  sendAuthCookies,
  validateUser
} from "@services/auth/auth.service";

const loginController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { success, issues, output } = v.safeParse(LoginSchema, body);

    if (!success) {
      const message = issues.map((issue) => issue.message).join(", ");
      throw new ErrorHandler("ValidationError", message, 400);
    }

    const user = await validateUser(output.username, output.password);
    if (user) {
      sendAuthCookies(res, user);
      return res.status(200).json({
        code: 200,
        message: "Login successful"
      });
    } else {
      throw new ErrorHandler(
        "Unauthorized",
        "Invalid username or password",
        401
      );
    }
  } catch (error) {
    if (error instanceof ErrorHandler)
      return ErrorHandler.handleException(error, res);
  }
};

const logoutController = async (req: Request, res: Response) => {
  try {
    // Clear the authentication cookies
    clearCookies(res);

    return res.status(204).json();
  } catch (error) {
    if (error instanceof ErrorHandler)
      return ErrorHandler.handleException(error, res);
  }
};

export { loginController, logoutController };
