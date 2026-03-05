import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
      type:String,
      required:false,
      default:"/images/default-avatar.jpg"
    }
  },
  { timestamps: true },
);

userSchema.pre('save',async function(){
  if(!this.isModified("password")){
    return;
  }

  this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password,this.password);
}

userSchema.generateAccessToken = function(){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      fullName:this.fullName,
      avatar:this.avatar
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

const User = model("User",userSchema);
export {User};