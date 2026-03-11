import { ApiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,_, next)=>{
    try{
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            throw new ApiError(401,"unauthorized request");
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password");

        if(!user){
            throw new ApiError(401,"Invalid Access Token");

        }

        req.user = user;
        next();


    }catch(error){
        throw new ApiError(401,error?.message|| "Invalid access token")
    }
});

export const attachUser = asyncHandler(async(req,res, next)=>{
    try{
      const token = req.cookies?.token;
      if(token){
        const userPayload = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = userPayload; 
        res.locals.user = userPayload;
      }else{
        res.locals.user = null;
      }
     }catch(err){
      res.locals.user = null;
     }
     next();
})