import axios from "axios";

const generateToken = async () => {
  try {
    const response = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=refresh_token`
    );
    let token = response.data.access_token;
    console.log("✅ Token generated:", token);
    return token;
  } catch (error) {
    console.error("❌ Failed to generate token:", error.response?.data || error.message);
    return null;
  }
};

export default generateToken;