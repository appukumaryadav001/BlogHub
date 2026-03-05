import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.resolve('../public')));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());




export {app};