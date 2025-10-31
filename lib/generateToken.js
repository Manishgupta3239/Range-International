import axios from "axios";

const generateToken = async (token) => {
  try {
    const response = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${token}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=refresh_token`
    );
    let access_token = response.data.access_token;
    console.log("✅ Token generated:", access_token);
    return access_token;
  } catch (error) {
    console.error("❌ Failed to generate token:", error.response?.data || error.message);
    return null;
  }
};

export default generateToken;