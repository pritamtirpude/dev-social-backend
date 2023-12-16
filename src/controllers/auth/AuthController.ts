import { Request, Response, NextFunction } from "express";
import {
  attachCookiesToResponse,
  comparePassword,
  hashPassword,
} from "../../middlewares/auth";
import { StatusCodes } from "http-status-codes";
import prisma from "../../db";

const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailAlreadyExists) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email already exists.",
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
      },
    });

    attachCookiesToResponse({ res, user });

    res.status(StatusCodes.CREATED).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide email and password",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid Crendentials",
      });
      return;
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid Credentials",
      });
      return;
    }

    attachCookiesToResponse({ res, user });

    const authenticatedUser = { id: user.id, email: user.email };

    res.status(StatusCodes.OK).json({ user: authenticatedUser });
  } catch (error) {
    next(error);
  }
};

export { registerController, loginController };
