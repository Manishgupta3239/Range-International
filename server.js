import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import axios from "axios";
import generateToken from "./lib/generateToken.js";
import { setToken } from "./lib/tokenManager.js";
import { postRouter } from "./routes/postRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Define all your refresh tokens and their variable IDs
const refreshTokens = [
  {
    name: "MAIN",
    refreshToken: process.env.ZOHO_REFRESH_TOKEN,
    variableId: "6862703000008907051",
    value: ""
  },
  {
    name: "WIDGET",
    refreshToken: process.env.ZOHO_WIDGET_TOKEN,
    variableId: "6862703000008907053",
    value: ""
  },
  {
    name: "EVENT",
    refreshToken: process.env.ZOHO_EVENT_TOKEN,
    variableId: "6862703000008907055",
    value: ""
  }
];

// Function to update all variables in one go
async function updateAllVariablesInCRM(variableUpdates) {
  const url = "https://www.zohoapis.com/crm/v8/settings/variables";

  const body = {
    variables: variableUpdates.map(v => ({
      id: v.variableId,
      value: v.value,
    })),
  };

  try {
    const response = await axios.put(url, body, {
      headers: {
        Authorization: `Zoho-oauthtoken ${refreshTokens[0].value}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Variables updated successfully:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Error updating variables:");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Helper function to delay between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to refresh all tokens and update Zoho variables
const refreshZohoTokens = async () => {
  console.log("🔁 Starting Zoho token refresh...");

  for (const item of refreshTokens) {
    try {
      console.log(`🕐 Refreshing token for ${item.name}...`);
      const newAccessToken = await generateToken(item.refreshToken);
      item.value = newAccessToken;
      console.log(`✅ ${item.name} token refreshed`);

      // 🔸 Delay 3 seconds between each token refresh
      await delay(3000);
      console.log("delay of 3 seconds")

    } catch (error) {
      console.error(`⚠️ ${item.name} token refresh failed:`, error.message);
    }
  }

  // Update all variables together after refreshing tokens
  await updateAllVariablesInCRM(refreshTokens);
};

// Run once at startup
(async () => {
  await refreshZohoTokens();
  setToken(refreshTokens[0].value);
})();

// Schedule every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("⏰ Running Zoho token refresh cron job...");
  refreshZohoTokens();
});

// Express setup
app.use(cors());
app.use(express.json());
app.use("/api/post", postRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

















// old code
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cron from "node-cron";
// import axios from "axios";
// import { postRouter } from "./routes/postRoute.js";
// import generateToken from "./lib/generateToken.js"; // Your token generator
// import { setToken } from "./lib/tokenManager.js";    // Store tokens if needed

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // List of Zoho refresh tokens
// const refreshTokens = [
//   process.env.ZOHO_REFRESH_TOKEN,
//   process.env.ZOHO_WIDGET_TOKEN,
//   process.env.ZOHO_EVENT_TOKEN,
//   process.env.ZOHO_EXTRA_TOKEN,
// ];

// // Variables payload to update in CRM
// const variablesPayload = {
//   variables: [
//     { id: "692969000000981112", value: "9" },
//     { id: "692969000000983066", description: "This is a new description" },
//     { id: "692969000000981114", api_name: "NewAPI" }
//   ]
// };

// // Function to refresh tokens
// const refreshAccessTokens = async () => {
//   const accessTokens = [];

//   for (const [index, refreshToken] of refreshTokens.entries()) {
//     try {
//       const accessToken = await generateToken(refreshToken); // Your function
//       if (accessToken) {
//         accessTokens.push(accessToken);
//         console.log(`✅ Access token #${index + 1} refreshed`);
//       } else {
//         console.error(`❌ Failed to generate access token #${index + 1}`);
//       }
//     } catch (error) {
//       console.error(`⚠️ Error refreshing token #${index + 1}:`, error.message);
//     }
//   }

//   return accessTokens;
// };

// // Function to update CRM variables using an access token
// const updateCRMVariables = async (accessToken) => {
//   try {
//     const response = await axios.put(
//       "https://www.zohoapis.com/crm/v8/settings/variables",
//       variablesPayload,
//       {
//         headers: {
//           "Authorization": `Zoho-oauthtoken ${accessToken}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );
//     console.log("✅ CRM variables updated:", response.data);
//   } catch (error) {
//     console.error("❌ Error updating variables:", error.response?.data || error.message);
//   }
// };

// // Combined function: refresh tokens and update CRM variables
// const refreshAndUpdate = async () => {
//   console.log("⏰ Running token refresh and CRM update job...");
//   const accessTokens = await refreshAccessTokens();

//   for (const token of accessTokens) {
//     await updateCRMVariables(token);
//   }
// };

// // Run immediately on server start
// refreshAndUpdate();

// // Schedule cron job every 10 minutes
// cron.schedule("*/10 * * * *", refreshAndUpdate);

// // API routes
// app.use("/api/post", postRouter);

// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });
