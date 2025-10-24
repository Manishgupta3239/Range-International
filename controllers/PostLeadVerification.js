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
      `https://www.zohoapis.com/crm/v8/Leads/${data.data.leadId}`,
      { headers }
    );

    console.log(
      "✅ Record fetched  successfully:",
      JSON.stringify(response.data),
      response
    );
    
    res.status(201).json({ message: "data fetched" });

    // code to send the data back
    // const dataMap = {
    //   Dev_Id_Rem: 2,
    //   Mobile: `${data.data.Mobile}`,
    //   Alternate_Mobile_Number: `${data.data.Alternate_Mobile_Number}`,
    //   Full_Name1: `${data.data.Full_Name1}`,
    //   Last_Name: `${data.data.Last_Name}`,
    //   Email: `${data.data.Email}`,
    //   Secondary_Email: `${data.data.Secondary_Email}`,
    //   Dev_Id: `${data.data.Dev_Id}`,
    //   Residency_Status: `${data.data.Residency_Status}`,
    //   Occupation: `${data.data.Occupation}`,
    //   Date_of_Birth: `${data.data.Date_of_Birth}`,
    //   Nationality: `${data.data.Nationality}`,
    //   Update_Till: `${data.data.Update_Till}`,
    //   Days_Update_Till: `${data.data.Days_Update_Till}`,
    //   Owner: `${data.data.Owner}`,
    //   Campaign_ID: `${data.data.Campaign_ID}`,
    //   Campaign_Manager: `${data.data.Campaign_Manager}`,
    //   Campaign_Name: `${data.data.Campaign_Name}`,
    //   Campaign_Source1: `${data.data.Campaign_Source1}`,
    //   Campaign_Type: `${data.data.Campaign_Type}`,
    //   Event_Date: `${data.data.Event_Date}`,
    //   Sub_Campaign: `${data.data.Sub_Campaign}`,
    //   Lead_Source: `${data.data.Lead_Source}`,
    //   Lead_Status: `${data.data.Lead_Status}`,
    //   Lead_Sub_Status: `${data.data.Lead_Sub_Status}`,
    //   Targeted_Country: `${data.data.Targeted_Country}`,
    //   Targeted_City: `${data.data.Targeted_City}`,
    //   Targeted_State: `${data.data.Targeted_State}`,
    //   RR_triggered: true,
    //   Country: `${data.data.Country}`,
    //   Zip_Code: `${data.data.Zip_Code}`,
    //   State: `${data.data.State}`,
    //   Address: `${data.data.Address}`,
    //   City: `${data.data.City}`,
    //   Lead_Category: `${data.data.Lead_Category}`,
    //   Choose: `${data.data.Choose}`,
    //   List_of_Affliate: `${data.data.List_of_Affliate}`,
    //   Final_Status_Of_Lead: `${data.data.Final_Status_Of_Lead}`,
    //   Lead_Priority: `${data.data.Lead_Priority}`,
    //   Spam_Lead1: `${data.data.Spam_Lead1}`,
    //   After_Comments: `${data.data.After_Comments}`,
    //   Comments: `${data.data.Comments}`,
    //   Project_Name: `${data.data.Project_Name}`,
    //   Developer_Name: `${data.data.Developer_Name}`,
    //   Location: `${data.data.Location}`,
    //   Size: `${data.data.Size}`,
    //   Bedroom: `${data.data.Bedroom}`,
    //   Requirement: `${data.data.Requirement}`,
    //   Assign_Time: Assign_Time1,
    //   Original_Created_Time: `${data.data.Original_Created_Time}`,
    // };
    
    // const payload = { data: [dataMap], trigger: ["workflow"] };
    // console.log("payload", payload);
    // console.log("token in post lead =>", token);
    // const headers = {
      //   Authorization: `Zoho-oauthtoken ${token}`,
      //   "Content-Type": "application/json",
      // };
      
      // const response1 = await axios.post(
        //   "https://www.zohoapis.com/crm/v8/Lead",
        //   payload,
        //   { headers }
        // );
        // // console.log(response.data);
        // console.log(
          //   "✅ Record created successfully:",
          //   JSON.stringify(response.data)
          // );
          
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

  res.status(200).json(body);
};

export { PostLeadVerification, PostLeads };