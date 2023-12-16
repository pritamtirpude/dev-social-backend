import { Router } from "express";
import { body } from "express-validator";

import {
  registerController,
  loginController,
} from "../controllers/auth/AuthController";
import { handleInputErrors } from "../middlewares/inputErrors";

const authRouter = Router();

authRouter.post(
  "/createaccount",
  body("email").trim().isEmail().withMessage("Not a valid e-mail address"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters is required."),
  handleInputErrors,
  registerController
);
authRouter.post(
  "/login",
  body("email").trim().isEmail().withMessage("Not a valid e-mail address"),
  loginController
);

export default authRouter;
