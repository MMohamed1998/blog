import fs, { fstatSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import blogModel from "../../../../database/models/Blog.model.js";
import { asyncHandler } from "../../../../utils/errorHandling.js";
import userModel from "../../../../database/models/User.model.js";
const __dirname = fileURLToPath(import.meta.url);

export const getBlog = asyncHandler(async (req, res, next) => {
  const blogs = await blogModel.find();
  if (blogs.length == 0) {
    return next(new Error("no blogs found", { cause: 404 }));
  }
  res.status(200).json({ message: "done", blogs });
});

export const getBlogByAuthor = asyncHandler(async (req, res, next) => {
  const author = req.params.authorId;
  const blogs = await blogModel.find({ author: author }).populate("author");
  if (blogs.length == 0) {
    return next(new Error("no blogs found", { cause: 404 }));
  }
  res.status(200).json({ message: "done", blogs });
});

export const addBlog = asyncHandler(async (req, res, next) => {
  const { title, body, tags } = req.body;
  const userId = req.user;

  const newBlog = await blogModel.create({ title, body, author: userId, tags });
  if (!newBlog) {
    return next(new Error("can not add blog", { cause: 404 }));
  }
  res.status(200).json({ message: "blog created successfully", newBlog });
});

export const blogPhoto = asyncHandler(async (req, res, next) => {
  const blogId = req.params.blogId;
  const userId = req.user;
  const blogPhoto = req.file;
  // console.log(blogPhoto)
  const blog = await blogModel.findById(blogId);
  if (!blog) {
    return next(new Error("No blog found with this Id!", { cause: 400 }));
  }
  if (blog.author != userId) {
    return next(new Error("you can only update your blog", { cause: 400 }));
  }
  if (blog.photo) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      `${blog.urlToUpdate}`
    );
    // console.log(oldImagePath)
    // console.log(fs.existsSync(oldImagePath))
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  const fullPath = blogPhoto.finalDest;
  const newBlog = await blogModel.findByIdAndUpdate(blog, {
    urlToUpdate: fullPath,
    photo: fullPath,
  });
  res
    .status(200)
    .json({ message: "User image updated successfully!", newBlog });
});

export const editBlog = asyncHandler(async (req, res, next) => {
  const { title, body, tags } = req.body;
  const blogId = req.params.blogId;
  const userId = req.user;
  const existBlog = await blogModel.findById(blogId);
  if (!existBlog) {
    return next(new Error("No blog found with this Id!", { cause: 400 }));
  }
  if (existBlog.author != userId) {
    return next(new Error("you can only update your blog", { cause: 400 }));
  }
  const blog = await blogModel.findByIdAndUpdate(blogId, {
    title,
    body,
    tags,
  });
  res.status(200).json({ message: "blog updated successfully", blog });
});

export const deleteBlog = asyncHandler(async (req, res, next) => {
  const blogId = req.params.blogId;
  const userId = req.user;
  const existBlog = await blogModel.findById(blogId);
  if (!existBlog) {
    return next(new Error("No blog found with this Id!", { cause: 400 }));
  }
  if (existBlog.author != userId) {
    return next(new Error("you can only delete your blog", { cause: 400 }));
  }
  const blog = await blogModel.findByIdAndDelete(blogId);
  res.status(200).json({ message: "blog deleted successfully", blog });
});

export const searchBlog = asyncHandler(async (req, res, next) => {
  const { search } = req.body;

  if (!search) {
    return next(new Error("search value must not be empty!", { cause: 400 }));
  }

  let result;
  const user = await userModel.findOne({
    userName: { $regex: search, $options: "i" },
  });

  if (!user) {
    result = await blogModel.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [search] } },
      ],
    });
  } else {
    result = await blogModel.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [search] } },
        { author: user._id },
      ],
    });
  }
  if(!result ||result.length==0){
    return res.status(404).json({message:"no results found!"})
  }

  res.status(200).json({ message: "Done", result });
});
