export const errorMiddleware = (err,req,res,next)=>{
    let statusCode = err.statusCode || 500;
    let message = err.message || "something went wrong";
    res.status(statusCode).render("error.ejs",{statusCode,message})
};