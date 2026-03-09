import { ApiError } from "../utils/apiError.utils.js";
import {asyncHandler} from "../utils/asyncHandler.utils.js";
import {User} from "../models/user.model.js";
import {uploadOncloudinary} from "../utils/cloudinary.utils.js";

const getSignup = (req,res)=>{
    res.render("signup.ejs");
};

const signup = asyncHandler( async(req, res)=>{
    // get user  fullName,email,password,avatar ,
     //validation - not empty
     // chechk if user already exist : email
     //check for image , check for avatar 
     //create user object - create entry in db
     // remove password field from response
     //check for user creation 
     // redirect

     const {fullName,email,password} = req.body;

     if(
        [fullName,email,password].some((field)=>{
        return field?.trim()==="";
     })){
        throw new ApiError(400,"All Fields are required");
     }

     const existUser = await User.findOne({email});
     if(existUser){
        throw new ApiError(400, "user with email aleady exists");
     }

     let avatarLocalPath;
     if(req.files?.avatar?.[0]){
        avatarLocalPath = req.files.avatar[0].path;
     }


     let avatarUrl;
     if(avatarLocalPath){
      const uploadedAvatar = await uploadOncloudinary(avatarLocalPath);

      avatarUrl=uploadedAvatar?.url;
     }

     const user = await User.create({
        fullName,
        email,
        password,
        ...(avatarUrl && {avatar:avatarUrl})
        
     });


     if(!user){
    throw new ApiError(500, "User creation failed!");
}
    const token =user.generateAccessToken();

    if(!token){
    throw new ApiError(500, "Token generation failed!");
}
    const options = {
      httpOnly:true,
      secure:true,
      expires:new Date(Date.now()+7*24*60*60*1000)
    }

    return res
    .cookie("token",token,options)
    .redirect("/home");
   
});

const getLogin = (req,res)=>{
   res.render("login.ejs")
}

const login = asyncHandler(async(req,res)=>{
   // email and password req.body
   // find user 
   // password check
   // generate token
   // redirect

   const {email,password} = req.body;

   if(!email){
      throw new ApiError(400,"email is required")
   }
   if(!password){
    throw new ApiError(400, "password is required");
   }
   const user = await User.findOne({email});
   if(!user){
      throw new ApiError(404,"user does not exist");
   }

   const isPasswordValid = await user.isPasswordCorrect(password);

   if(!isPasswordValid){
      throw new ApiError(401,"password incorrect")
   }

   const token = user.generateAccessToken();
  if(!token){
   throw new ApiError(500,"Token generation failed")
  }

  const options = {
      httpOnly:true,
      secure:true,
      expires:new Date(Date.now()+7*24*60*60*1000)
    }

    return res
    .cookie("token",token,options)
    .redirect("/home");
})
export {
   getSignup,
   signup,
   getLogin,
   login

}