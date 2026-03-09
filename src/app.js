import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middlewares/error.middlewares.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.resolve('../public')));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());




app.use((req, res, next) => {
  next(new ApiError(404, "Page not found!"));
});

app.use(errorMiddleware); 
export {app};