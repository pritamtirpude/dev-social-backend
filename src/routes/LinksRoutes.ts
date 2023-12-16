import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middlewares/inputErrors";
import {
  createLinks,
  deleteLink,
  getAllLinks,
} from "../controllers/links/LinksController";

const linksRouter = Router();

linksRouter.get("/userLinks", getAllLinks);
linksRouter.post(
  "/createLinks",
  body("platform").isString().withMessage("Please enter valid platform"),
  body("link").isString().withMessage("Please enter valid link"),
  handleInputErrors,
  createLinks
);
linksRouter.delete("/deleteLink/:id", deleteLink);

export default linksRouter;
