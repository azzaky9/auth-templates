import ErrorHandler from "@config/error-handler";
import type { NextFunction, Request, Response } from "express";
import {
  verifyRefreshToken,
  verifyAcessToken,
  cookieOpts
} from "@services/auth/auth.service";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.id;
  const refreshToken = req.cookies.rid;

  if (!accessToken && !refreshToken) {
    throw ErrorHandler.handleException({ name: "Unauthorized" }, res);
  }

  const verifyAccess = verifyAcessToken(accessToken);

  if (verifyAccess) {
    return next();
  }

  try {
    const verifyRefresh = (await verifyRefreshToken(refreshToken)) as {
      refreshToken: string;
      accessToken: string;
    };

    if (verifyRefresh) {
      res.cookie("id", verifyRefresh.accessToken, cookieOpts);
      res.cookie("rid", verifyRefresh.refreshToken, cookieOpts);

      return next();
    }
  } catch (error) {
    console.log(error);
    return ErrorHandler.handleException({ name: "Unauthorized" }, res);
  }
};

export { authMiddleware };
