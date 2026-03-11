import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middlewares/error.middlewares.js";
import session from "express-session";
import flash from "connect-flash";
import userRouter from "./routes/user.route.js";


import { ApiError } from "./utils/apiError.utils.js";
import { attachUser } from "./middlewares/auth.middleware.js";
;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}));
app.use(flash());
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.resolve('../public')));
app.use(attachUser);
app.use((req,res,next)=>{
  res.locals.messages = {
    error:req.flash("error"),
    success:req.flash("success")
  };
 next();
});

app.get("/", (req, res) => {
    res.render("home.ejs", { allBlog: [] });
});
app.use("/user",userRouter);

app.use((req, res, next) => {
  next(new ApiError(404, "Page not found!"));
});

app.use(errorMiddleware); 
export {app};