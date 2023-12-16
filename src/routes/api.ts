import { Router } from "express";

import linksRouter from "./LinksRoutes";
import profileRouter from "./ProfileRoutes";

const api = Router();

api.use("/links", linksRouter);
api.use("/profile", profileRouter);

export default api;
