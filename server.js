import express from "express"
import dotenv from 'dotenv';
import cors from 'cors';
import { postRouter } from "./routes/postRoute.js";
import ConnectionDb from "./mongodb/connect.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(express.json());


// api
app.use("/api/post",postRouter);


try{
    await ConnectionDb(process.env.MONGO_DB_URI);
    app.listen(PORT, ()=>{
        console.log(`connected to ${PORT}`);
    })
}catch(error){
    console.log("ERROR IN connecting",error.message);
}