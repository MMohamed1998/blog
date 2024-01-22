
import { validation } from '../../middleware/validation.js';
import * as authController from './controller/registration.js'
import { Router } from "express";
import * as validators from './auth.validation.js'
import auth from '../../middleware/auth.js';
const router = Router()


router.post('/signup',validation(validators.signup),authController.signup)
router.post('/login',validation(validators.login),authController.login)
router.put("/addFollower/:followingId",auth(),authController.addFollower);
router.put("/deleteFollower/:followingId",auth(),authController.deleteFollower);
router.get("/",auth(),authController.getAllUsers);
router.get("/:userId",auth(),authController.getOneUser);


export default router