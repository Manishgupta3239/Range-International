import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { postRouter } from "./routes/postRoute.js";
import generateToken from "./lib/generateToken.js";
import { setToken } from "./lib/tokenManager.js";

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

app.get("/api/token", async (req, res) => {
  const token = await generateToken();
  if (token) {
    setToken(token);
    console.log("🔁 Zoho token refreshed:", token);
    res.status(200).json({ message: "Token created", token });
  } else {
    res.status(400).json({ message: "Token not created" });
  }
});

// server
try {
  app.listen(PORT, () => {
    console.log(`connected to ${PORT}`);
  });
} catch (error) {
  console.log("ERROR in connecting", error.message);
}


// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { postRouter } from "./routes/postRoute.js";
// import generateToken from "./lib/generateToken.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;
// let token = "";

// // middlewares
// app.use(cors());
// app.use(express.json());

// // cron


// // accessing token immediatly
// (async () => {
//   token = await generateToken();
//   console.log("Initial Zoho token generated");
// })();

// // api
// app.use("/api/post", postRouter);


// app.get("/api/token", async (req, res) => {
//   token = await generateToken();
//   if (token) {
//     console.log("🔁 Zoho token refreshed:", token);
//     res.status(200).json({ message: "Token created", token });
//   } else {
//     res.status(400).json({ message: "Token not created" });
//   }
// });


// // return updated token
// function updatedToken() {
//   return token;
// }

// // server
// try {
//   app.listen(PORT, () => {
//     console.log(`connected to ${PORT}`);
//   });
// } catch (error){
//   console.log("ERROR IN connecting", error.message);
// }

// export default updatedToken;






// try {
  //   const response = await axios.post(
  //     `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=refresh_token`
  //   );
  //   token = response.data.access_token;
  //   console.log("token genereated using cron org" , token);
  //   res.status(200).json({message:"token created",token});
  // } catch (error) {
  //   console.log(error);
  //   res.status(400).json({message:"token not created"});
  // }










//   import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { postRouter } from "./routes/postRoute.js";
// import cron from "node-cron";
// import axios from "axios";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;
// let token = "";

// const generateToken = async () => {
//   try {
//     const response = await axios.post(
//       `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=refresh_token`
//     );
//     token = response.data.access_token;
//     console.log("✅ Token generated:", token);
//     return token;
//   } catch (error) {
//     console.error("❌ Failed to generate token:", error.response?.data || error.message);
//     return null;
//   }
// };

// (async () => {
//   await generateToken();
// })();

// function abc(){
//   return token;
// }

// // middlewares
// app.use(cors());
// app.use(express.json());

// // api
// app.use("/api/post", postRouter);
// app.get("/api/token", async (req, res) => {
//   try {
//     const response = await axios.post(
//       `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=refresh_token`
//     );
//     token = response.data.access_token;
//     console.log("token genereated using cron org" , token);
//     res.status(200).json({message:"token created",token});
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({message:"token not created"});
//   }
//   // const newToken = await generateToken();
//   // if (newToken) res.status(200).json({ message: "Token created", token: newToken });
//   // else res.status(400).json({ message: "Token not created" });
// });

// try {
//   app.listen(PORT, () => {
//     console.log(`connected to ${PORT}`);
//   });
// } catch (error) {
//   console.log("ERROR IN connecting", error.message);
// }
// export default abc;