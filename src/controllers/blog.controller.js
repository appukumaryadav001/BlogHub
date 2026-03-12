import {Blog} from "../models/blog.model.js";
import {ApiError} from "../utils/apiError.utils.js";
import {asyncHandler} from "../utils/asyncHandler.utils.js";
import { uploadOncloudinary } from "../utils/cloudinary.utils.js";
import { isValidObjectId } from "mongoose";


const getAddBlog = (req,res)=>{
    res.render("addBlog");
};
const addBlog = asyncHandler (async (req , res)=>{
    const {title,body} = req.body;

    if(!title || !body){
        req.flash("error","title and body are required");
       return  res.redirect("/blog");
    }
     
    let coverImageURLLocalPath;
    if(req.file){
        coverImageURLLocalPath = req.file.path;
    }

    let coverImageUrl;
    if(coverImageURLLocalPath){
        const uploadedCoverImage = await uploadOncloudinary(coverImageURLLocalPath);

        coverImageUrl = uploadedCoverImage?.url;
    }
    const blog = await Blog.create({
        title,
        body,
        createdBy:req.user?._id,
        coverImageURL:coverImageUrl || ""

    });

    if(!blog){
        throw new ApiError (500,"Blog creation failed");
    }
   
req.flash("success","Blog created successfully");
return res.redirect("/");
    
    
});

const getBlogById = asyncHandler (async (req,res)=>{
      const {blogId} = req.params;

      if(!isValidObjectId(blogId)){
        req.flash("error","invalid blogId");
        return res.redirect("/");
      }

      const blog = await Blog.findById(blogId).populate("createdBy");
      if(!blog){
        req.flash("error","blog not found");
        return res.redirect("/");
      }

      return res.render("blog",{blog});
});

export {
    getAddBlog,
    addBlog,
    getBlogById,
}