import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import jwt from "jsonwebtoken";

const app = express();


//mongodb+srv://admin:123@cluster0.hvu2xco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


app.use(bodyParser.json())


app.use((req,res,next)=>{
    const tokenString = req.header("Authorization")
    if(tokenString != null){
        const token = tokenString.replace("Bearer ","")
        

        jwt.verify(token,"cbc-batch-five#@2025",
            (err,decoded)=>{
                if(decoded != null){
                    req.user = decoded
                  
                    next()
                }else{
                    console.log("Invalid token")
                    res.status(403).json({
                        message : "Invalid token"
                    })
                }
            }
        )
    }else{
        next()
    }
    
    //next()
})

mongoose.connect("mongodb+srv://admin:123@cluster0.hvu2xco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Connected to the database")

}).catch(()=>{
    console.log("Connection Error...")
})



//api hadapu student route ekata main line ekata connect karanne methan



app.use("/products",productRouter)

app.use("/users",userRouter)





app.listen(3000,()=>{
    console.log("server is running on port 3000");
}
)