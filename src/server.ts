import express from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/not-found";
import errorHandler from "./middlewares/error-hanlder";
import authRouter from "./routes/AuthRoutes";
import { authMiddleware } from "./middlewares/auth";
import api from "./routes/api";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.get("/", (req, res) => {
  res.status(StatusCodes.OK);
  res.json({ message: "Developer Social Links Services are running" });
});

app.use("/auth", authRouter);
app.use("/api/v1/", authMiddleware, api);

app.use(notFound);
app.use(errorHandler);

export default app;
