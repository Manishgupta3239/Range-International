import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { postRouter } from "./routes/postRoute.js";
import cron from "node-cron";
import axios from "axios";
import createToken from "./lib/createToken.js";
import { set } from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
let token = "";

if(token == ""){
    try {
    const response = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=refresh_token`
    );
    token = response.data.access_token;
    console.log("token",token);
  } catch (error) {
    console.log(error);
    res.status(400).json({message:"token not created"});
  }

}
// middlewares
app.use(cors());
app.use(express.json());

// api
app.use("/api/post", postRouter);
app.get("/api/token", async (req, res) => {
  try {
    const response = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=refresh_token`
    );
    token = response.data.access_token;
    res.status(200).json({message:"token created",token});
  } catch (error) {
    console.log(error);
    res.status(400).json({message:"token not created"});
  }
});

try {
  app.listen(PORT, () => {
    console.log(`connected to ${PORT}`);
  });
} catch (error) {
  console.log("ERROR IN connecting", error.message);
}
export default token;
