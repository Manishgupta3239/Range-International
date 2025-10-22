import axios from "axios";

const PostLeadVerification = async (req, res) => {
  try {
    const data = req.body;

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
    console.log("🕒 Zoho datetime:", Assign_Time1);
b
    const dataMap = {
      Dev_Id_Rem: 2,
      Sub_Campaign_Name: "6862703000002319408",
      Assign_Time: Assign_Time1,
      Dev_Id: 0,
      Owner: "6862703000001479150",
      Name: "Lead_Verification_Name1",
      Sub_Campaign_ID: "12121212",
      Campaign_Name: "6862703000002319393",
      Valid_Till: Assign_Time1, // <- Zoho datetime format
      Lead_Name: "6862703000007270332",
      Email: "manish@gmail.com",
      Status: ""
    };


// Build the payload
// const payload = {
//   data: dataList,
//   trigger: workflowList
// };


    const payload = { data: [dataMap] };

    const headers = {
      "Authorization": "Zoho-oauthtoken 1000.8fa286fd59eb5f7db847a53dd4354ae7.e13b91f563f4810803a1d75d2ae8cbf3",
      "Content-Type": "application/json"
    };

    const response = await axios.post(
      "https://www.zohoapis.com/crm/v8/Lead_Verifications",
      payload,
      { headers }
    );

    console.log("✅ Record created successfully:", JSON.stringify(response.data));
    res.status(201).json({ message: "mubarak hoooo" });

  } catch (error) {
    if (error.response) {
      console.error(" Zoho Error Status:", error.response.status);
      console.error(" Zoho Error Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(" Request Error:", error.message);
    }
    res.status(400).json({ error: "Zoho request failed" });
  }
};

export { PostLeadVerification };
