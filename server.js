import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { postRouter } from "./routes/postRoute.js";
import generateToken from "./lib/generateToken.js";
import { setToken } from "./lib/tokenManager.js";
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(express.json());

// generate and set token immediately
(async () => {
  const token = await generateToken();
  setToken(token);
  console.log("Initial Zoho token generated");
})();

// api routes
app.use("/api/post", postRouter);
// app.get("/api/token", async (req, res) => {
//   const token = await generateToken();
//   if (token) {
//     setToken(token);
//     console.log("🔁 Zoho token refreshed:", token);
//     res.status(200).json({ message: "Token created", token });
//   } else {
//     res.status(400).json({ message: "Token not created" });
//   }
// });


const refreshZohoToken = async () => {
  try {
    const token = await generateToken();

    if (token) {
      setToken(token); // store in memory or DB
      console.log("🔁 Zoho token refreshed:", token);
    } else {
      console.error("❌ Token not generated");
    }
  } catch (error) {
    console.error("⚠️ Token refresh failed:", error.message);
  }
};

// Schedule job to run every 10 minutes
cron.schedule("*/10 * * * *", () => {
  console.log("⏰ Running Zoho token refresh cron job...");
  refreshZohoToken();
});


// server
try {
  app.listen(PORT, () => {
    console.log(`connected to ${PORT}`);
  });
} catch (error) {
  console.log("ERROR in connecting", error.message);
}