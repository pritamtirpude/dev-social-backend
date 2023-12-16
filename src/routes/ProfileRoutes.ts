import { Router } from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../controllers/profile/ProfileController";
import { check } from "express-validator";
import { handleInputErrors } from "../middlewares/inputErrors";

const profileRouter = Router();

profileRouter.post(
  "/createProfile",
  [
    check("firstName", "Please enter valid firstname")
      .exists()
      .matches(/^[a-zA-Z]+$/),
    check("lastName", "Please enter valid lastname")
      .exists()
      .matches(/^[a-zA-Z]+$/),
    check("email", "Please enter valid email").isEmail(),
  ],
  handleInputErrors,
  createProfile
);
profileRouter.put(
  "/profileUpdate/:id",
  [
    check("firstName", "Please enter valid firstname")
      .exists()
      .matches(/^[a-zA-Z]+$/),
    check("lastName", "Please enter valid lastname")
      .exists()
      .matches(/^[a-zA-Z]+$/),
    check("email", "Please enter valid email").isEmail(),
  ],
  handleInputErrors,
  updateProfile
);
profileRouter.get("/profileUser", getProfile);

export default profileRouter;
