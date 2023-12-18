import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const comparePassword = async (
  password: string,
  hashPassword: string
) => {
  return await bcrypt.compare(password, hashPassword);
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const createJwtToken = ({ user }) => {
  const token = jwt.sign(user, process.env.JWT_SECRET_KEY);

  return token;
};

export const attachCookiesToResponse = ({ res, user }) => {
  const token = createJwtToken({ user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: false,
    sameSite: "none",
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export const authMiddleware = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Authentication Invalid",
    });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Authentication Invalid",
    });
    return;
  }
};
