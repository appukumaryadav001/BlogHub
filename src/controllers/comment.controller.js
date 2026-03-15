import { Comment } from "../models/comment.model";
import {User} from "../models/user.model.js";
import {Blog} from "../models/blog.model.js";

import {ApiError} from "../utils/apiError.utils.js";
import {asyncHandler} from "../utils/asyncHandler.utils.js";

const addComment = asyncHandler( async (req,res)=>{
         const {content} = req.body;
         const {blogId} = req.params;
           if(!req.user){
            throw new ApiError(401,"Unauthrozied");
         }
         if(!content){
            req.flash("error","content is required");
           return res.redirect(`/blog/${blogId}`);
         }

         

       
         const blog = await Blog.findById(blogId);
         if(!blog){
            throw new ApiError(404,"blog not found");
         }
         const comment = await Comment.create({
            content,
            blogId:blog._id,
            createdBy:req.user._id,
         });

     if(!comment){
            req.flash("error","comment created faild");
           return res.redirect(`/blog/${blogId}`);
         }
  return res
  .redirect(`/blog/${blogId}`);
});

export {
    addComment,
}
