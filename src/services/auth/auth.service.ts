import { type Response } from "express";
import bcrypt from "bcrypt";
import { findUserByUsername } from "@services/user/user";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { TAuthPayload } from "@interface/auth.interface";

const accessTokenSecret = process.env.AUTH_SECRET_ACCESS_TOKEN!;
const refreshTokenSecret = process.env.AUTH_SECRET_REFRESH_TOKEN!;

const validateUser = async (username: string, password: string) => {
  const user = await findUserByUsername(username, password);

  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }

  return null;
};

const generateToken = (user: User) => {
  const payload = {
    id: user.id,
    role: user.role
  } as TAuthPayload;

  return {
    accessToken: jwt.sign(payload, accessTokenSecret, { expiresIn: "30s" }),
    refreshToken: jwt.sign(payload, refreshTokenSecret, { expiresIn: "30d" })
  };
};

function verifyAcessToken(token: string) {
  try {
    const verify = jwt.verify(token, accessTokenSecret);

    return verify as jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null;
    }
  }
  // console.log(typeof verify);
}

const decodeToken = (token: string) => {
  return jwt.decode(token);
};

function verifyRefreshToken(
  token: string // refresh token,
) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, refreshTokenSecret, async (err, user) => {
      if (err) return reject(err);
      const tokens = generateToken(user as User);
      resolve(tokens);
    });
  });
}

export const cookieOpts = {
  httpOnly: false,
  path: "/",
  sameSite: "none",
  // secure: isProduction,
  // domain: isProduction ? `.${process.env.DOMAIN}` : "",
  domain: "",
  secure: true,
  maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // 10 year
} as const;

const clearCookies = (res: Response) => {
  res.clearCookie("id", cookieOpts);
  res.clearCookie("rid", cookieOpts);
};

export const sendAuthCookies = (res: Response, user: User) => {
  const { accessToken, refreshToken } = generateToken(user);
  res.cookie("id", accessToken, cookieOpts);
  res.cookie("rid", refreshToken, cookieOpts);
};

export {
  validateUser,
  generateToken,
  verifyRefreshToken,
  verifyAcessToken,
  decodeToken,
  clearCookies
};
