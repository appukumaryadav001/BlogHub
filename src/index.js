import "dotenv/config";
import connectDB from "./db/config.js";

import {app} from "./app.js"
const port = process.env.PORT || 3000;

connectDB()
.then(()=>{
     app.listen(port,()=>{
    console.log(`Server Started at PORT ${port}`);  
})
})
.catch((err)=>{
    console.log("MONGO DB connection failed !! ",err);  
});
