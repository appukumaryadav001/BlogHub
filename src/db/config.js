import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
         const conn = await mongoose.connect(`${process.env.MONGO_URL}`);

         console.log(`\n MongoDB connnect || DB HOST : ${conn.connection.host}`);
         
    }catch(error){
        console.log("MongoDB connection Error : ", error);
        process.exit(1);
        
    }
   


};

export default connectDB;

