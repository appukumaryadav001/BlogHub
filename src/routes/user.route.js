import { Router } from "express";
import {
    getSignup,
    signup,
    getLogin,
    login,
    logout
} from "../controllers/user.controller.js";


import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/signup")
      .get(getSignup)
      .post(upload.single("avatar"),signup);

router.route("/login")
      .get(getLogin)
      .post(login);

router.route("/logout").get(logout);

export default router;
