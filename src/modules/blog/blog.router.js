
import * as blogController from './controller/blog.js'
import * as authController from '../auth/controller/registration.js'
import {fileUpload,fileValidation} from '../../../utils/multer.js'
import { Router } from "express";
import auth from '../../middleware/auth.js';
const router = Router()


router.get('/',blogController.getBlog)
router.get('/:authorId',auth(),blogController.getBlogByAuthor)
router.post('/search',auth(),blogController.searchBlog)
router.post('/',auth(),blogController.addBlog)
router.put(
    "/blogPhoto/:blogId",auth(),
    fileUpload("blogs/blogImages", fileValidation.image).single("image"),
    blogController.blogPhoto
  );
  router.put("/updateBlog/:blogId",auth(),blogController.editBlog);
  router.delete("/deleteBlog/:blogId",auth(),blogController.deleteBlog);



export default router