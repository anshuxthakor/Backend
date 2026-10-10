import postModel from "../models/post.model.js";
import sendFiles from "../services/storage.service.js";

export const createPostController = async (req, res) => {
  const { caption } = req.body;
  const file = req.file;
  if (!caption || !file) {
    return res.status(400).json({
      success: false,
      message: "Caption and image are required",
    });
  }
  const uploadImage = await sendFiles(file.buffer, file.originalname);
  console.log(uploadImage);
  // const post = await postModel.create({
  //   caption,
  //   imageUrl: uploadImage.url,
  // });
  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post: post,
  });
};
