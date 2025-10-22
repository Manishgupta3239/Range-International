import axios from "axios";
import token from "../server.js";

const PostLeadVerification = async (req, res) => {
  try {
    const data = req.body;
  
    console.log("zoho",data.data.Lead_Verification_Name)

    // Get current date and subtract 12 hours 30 minutes
    const now = new Date();
    now.setHours(now.getHours() - 12);
    now.setMinutes(now.getMinutes() - 30);

    // Format to Zoho datetime: YYYY-MM-DDTHH:mm:ss+hh:mm
    const formatZohoDatetime = (date) => {
      const pad = (n) => String(n).padStart(2, "0");

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());

      // Timezone offset in minutes
      const tzOffset = -date.getTimezoneOffset();
      const sign = tzOffset >= 0 ? "+" : "-";
      const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
      const tzMinutes = pad(Math.abs(tzOffset) % 60);

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${tzHours}:${tzMinutes}`;
    };

    const Assign_Time1 = formatZohoDatetime(now);
    console.log(" Zoho datetime:", Assign_Time1);

    const dataMap = {
      Dev_Id_Rem: 2,
      Sub_Campaign_Name: `${data.data.Sub_Campaign_Name}`,
      Assign_Time: `${data.data.Assign_Time}`,
      Dev_Id: data.data.Dev_Id,
      Owner: `${data.data.Lead_Verification_Owner}`,
      Name: `${data.data.Lead_Verification_Name}`,
      Sub_Campaign_ID: `${data.data.Sub_Campaign_Name}`,
      Campaign_Name: `${data.data.Campaign_id}`,
      Valid_Till: data.data.Valid_Till, // <- Zoho datetime format
      Lead_Name: `${data.data.Lead_Name}`,
      Status: ""
    };

    
    const payload = { data: [dataMap] , trigger : ["Workflow"]};
    console.log("payload",payload);
    const headers = {
      "Authorization": `Zoho-oauthtoken 1000.8424b497104de3484b5749b71ddf6e40.e8f52767df3ce3b630eb02336c75bb65`,
      "Content-Type": "application/json"
    };

    const response = await axios.post(
      "https://www.zohoapis.com/crm/v8/Lead_Verifications",
      payload,
      { headers }
    );
    // console.log(response.data);
    console.log("✅ Record created successfully:", JSON.stringify(response.data));
    res.status(201).json({ message: "mubarak hoooo" });

  } catch (error) {
    if (error.response) {
      console.error("❌ Zoho Error Status:", error.response.status);
      console.error("❌ Zoho Error Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("❌ Request Error:", error);
    }
    // console.log(error);
    res.status(400).json({ error: "Zoho request failed" });
  }
};

export { PostLeadVerification };