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

// if(token == ""){
//     token = createToken();
// }
// middlewares
app.use(cors());
app.use(express.json());

// setTimeout(() => {
//     cron.schedule("*/10 * * * *", async() => {
//     try{
//         const res = await axios.post("https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.89df4173347843c9188e4761ebea3d23.73fc2e4cf5f43ab24d22faf014328d60&client_secret=7f606f4851e64d48437dd2a965c974e79932df8eb4&client_id=1000.Y7C03TSOIAH5MGGO422CYCMKM71VTL&redirect_uri=https://crm.zoho.in/&grant_type=refresh_token");
//         token = res.data.access_token;
//         console.log(token);
//     }catch(error){
//         console.log(error);
//     }
//   console.log("Running task every 10 minutes:", new Date());
// });
//   }, 10000);

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
