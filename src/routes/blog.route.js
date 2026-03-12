import {Router} from "express";
import { getAddBlog,addBlog,getBlogById } from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
import {verifyJWT} from "../middlewares/auth.middleware.js";

router.route("/add-newBlog").get(verifyJWT,getAddBlog);
router.route("/").post(verifyJWT,upload.single("coverImageURL"),addBlog);
router.route("/:blogId").get(getBlogById);



export default router;