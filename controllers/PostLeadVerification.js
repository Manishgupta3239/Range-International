import axios from "axios";
import { getToken } from "../lib/tokenManager.js";

const PostLeadVerification = async (req, res) => {
  try {
    const data = req.body;
    console.log("data from zoho", data);
    const token = getToken();

    // Get current date and subtract 12 hours 30 minutes
    const now = new Date();

    // current time (no subtraction of 12 hours or 30 minutes)
    const currentDate = new Date();

    // Format to Zoho datetime: YYYY-MM-DDTHH:mm:ss+hh:mm
    const formatZohoDatetime = (date) => {
      const pad = (n) => String(n).padStart(2, "0");

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours()); // 24-hour format
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());

      const tzOffset = -date.getTimezoneOffset(); // in minutes
      const sign = tzOffset >= 0 ? "+" : "-";
      const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
      const tzMinutes = pad(Math.abs(tzOffset) % 60);

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${tzHours}:${tzMinutes}`;
    };

    // Assign_Time in 24-hour format
    const Assign_Time1 = formatZohoDatetime(currentDate);

    // Valid_Till = Assign_Time + 1 minute
    const validTillDate = new Date(currentDate.getTime() + 1 * 60 * 1000); // add 1 min
    const valid_till = formatZohoDatetime(validTillDate);

    console.log("Assign_Time1:", Assign_Time1); // e.g., 2025-10-22T14:45:30+05:30
    console.log("Valid_Till:", valid_till); // e.g., 2025-10-22T14:46:30+05:30

    console.log(" Zoho datetime:", Assign_Time1);

    const dataMap = {
      Dev_Id_Rem: 2,
      Sub_Campaign_Name: `${data.data.Sub_Campaign_Name}`,
      Assign_Time: `${Assign_Time1}`,
      Dev_Id: data.data.Dev_Id,
      Owner: `${data.data.Lead_Verification_Owner}`,
      Name: `${data.data.Lead_Verification_Name}`,
      Sub_Campaign_ID: `${data.data.Sub_Campaign_ID}`,
      Campaign_Name: `${data.data.Campaign_id}`,
      Valid_Till: valid_till, // <- Zoho datetime format
      Lead_Name: `${data.data.Lead_Name}`,
      Email: `${data.data.Email}`,
      Agent_Phone_No: `${data.data.Agent_Phone_No}`,
      Agent_Name: `${data.data.Agent_Name}`,
      Status: `${data.data.Status}`,
    };

    const payload = { data: [dataMap], trigger: ["workflow"] };
    console.log("payload", payload);
    console.log("token in post lead verification =>", token);
    const headers = {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://www.zohoapis.com/crm/v8/Lead_Verifications",
      payload,
      { headers }
    );
    // console.log(response.data);
    console.log(
      "✅ Record created successfully:",
      JSON.stringify(response.data)
    );
    res.status(201).json({ message: "mubarak hoooo" });
  } catch (error) {
    if (error.response) {
      console.error("❌ Zoho Error Status:", error.response.status);
      console.error(
        "❌ Zoho Error Data:",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error("❌ Request Error:", error);
    }
    // console.log(error);
    res.status(400).json({ error: "Zoho request failed" });
  }
};

const PostLeads = async (req, res) => {
  try {
    console.log("hit hua post leads")
    const data = req.body;
    const token = getToken();
    console.log("lead ID from zoho", data);

    // Get current date and subtract 12 hours 30 minutes
    const now = new Date();

    // current time (no subtraction of 12 hours or 30 minutes)
    const currentDate = new Date();

    // Format to Zoho datetime: YYYY-MM-DDTHH:mm:ss+hh:mm
    const formatZohoDatetime = (date) => {
      const pad = (n) => String(n).padStart(2, "0");

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours()); // 24-hour format
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());

      const tzOffset = -date.getTimezoneOffset(); // in minutes
      const sign = tzOffset >= 0 ? "+" : "-";
      const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
      const tzMinutes = pad(Math.abs(tzOffset) % 60);

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${tzHours}:${tzMinutes}`;
    };

    // Assign_Time in 24-hour format
    const Assign_Time1 = formatZohoDatetime(currentDate);

    // Valid_Till = Assign_Time + 1 minute
    const validTillDate = new Date(currentDate.getTime() + 1 * 60 * 1000); // add 1 min
    const valid_till = formatZohoDatetime(validTillDate);

    console.log("Assign_Time1:", Assign_Time1); // e.g., 2025-10-22T14:45:30+05:30
    console.log("Valid_Till:", valid_till); // e.g., 2025-10-22T14:46:30+05:30

    console.log(" Zoho datetime:", Assign_Time1);


    // api to get the data
    const headers = {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v8/Leads/${data.data.lead_id}`,
      { headers }
    );

    console.log(
      "✅ Record fetched  successfully:",
      // response.data,
    );
    console.log("data=>",response.data.data);
    
    // code to send the data back
    const lead = response.data[0]; // shortcut for cleaner code
    // console.log("mobileeeeeeeeeeeeeee",response.data[0].Mobile)
    const dataMap = {
      owner: `${data.data.owner}`,
      Team_Leader:`${data.data.Team_Leader}`,
      Agent_Phone_No:`${data.data.Agent_Phone_No}`,
      Agent_Name:`${data.data.Agent_Name}`,
      // Mobile: `${lead.Mobile}`,
      Alternate_Mobile_Number: `${lead.Alternate_Mobile_Number}`,
      Full_Name1: `${lead.Full_Name1}`,
      Last_Name: `${lead.Last_Name}`,
      Email: `${lead.Email}`,
      Secondary_Email: `${lead.Secondary_Email}`,
      Dev_Id: `${lead.Dev_Id}`,
      Residency_Status: `${lead.Residency_Status}`,
      Occupation: `${lead.Occupation}`,
      Date_of_Birth: `${lead.Date_of_Birth}`,
      Nationality: `${lead.Nationality}`,
      Update_Till: `${lead.Update_Till}`,
      Days_Update_Till: `${lead.Days_Update_Till}`,
      Owner: `${lead.Owner}`,
      Campaign_ID: `${lead.Campaign_ID}`,
      Campaign_Manager: `${lead.Campaign_Manager}`,
      Campaign_Name: `${lead.Campaign_Name}`,
      Campaign_Source1: `${lead.Campaign_Source1}`,
      Campaign_Type: `${lead.Campaign_Type}`,
      Event_Date: `${lead.Event_Date}`,
      Sub_Campaign: `${lead.Sub_Campaign}`,
      Lead_Source: `${lead.Lead_Source}`,
      Lead_Status: `Open`,
      Lead_Sub_Status: `Unattended`,
      Targeted_Country: `${lead.Targeted_Country}`,
      Targeted_City: `${lead.Targeted_City}`,
      Targeted_State: `${lead.Targeted_State}`,
      RR_triggered: true,
      Country: `${lead.Country}`,
      Zip_Code: `${lead.Zip_Code}`,
      State: `${lead.State}`,
      Address: `${lead.Address}`,
      City: `${lead.City}`,
      Lead_Category: `${lead.Lead_Category}`,
      Choose: `${lead.Choose}`,
      List_of_Affliate: `${lead.List_of_Affliate}`,
      Lead_Priority: `${lead.Lead_Priority}`,
      Project_Name: `${lead.Project_Name}`,
      Developer_Name: `${lead.Developer_Name}`,
      Location: `${lead.Location}`,
      Size: `${lead.Size}`,
      Bedroom: `${lead.Bedroom}`,
      Requirement: `${lead.Requirement}`,
      Assign_Time: Assign_Time1,
      Original_Created_Time: `${lead.Original_Created_Time}`,
    };
    
    const payload = { data: [dataMap], trigger: ["workflow"] };
    console.log("payload", payload);
    console.log("token in post lead =>", token);
    const headers1 = {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    };
    
    const response1 = await axios.post(
      "https://www.zohoapis.com/crm/v8/Leads",
      payload,
      { headers1}
    );
    // console.log(response.data);
    console.log(
      "✅ Record created successfully:",
      JSON.stringify(response1.data)
    );
    
    res.status(201).json({ message: "record created successfully" });
    
  } catch (error) {
    if (error.response) {
      console.error("❌ Zoho Error Status:", error.response.status);
      console.error(
        "❌ Zoho Error Data:",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error("❌ Request Error:", error);
    }
    // console.log(error);
    res.status(400).json({ error: "Zoho request failed" });
  }

};

export { PostLeadVerification, PostLeads };