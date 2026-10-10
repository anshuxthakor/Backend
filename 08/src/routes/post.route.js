import express from "express";
import { createPostController } from "../controllers/post.controller.js";
import upload from "../config/multer.config.js";

const postRouter = express.Router();

postRouter.post("/create", upload.single("image"), createPostController);

export default postRouter;
