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

    const safe = (value) => (value ? value : ""); // helper function

    const dataMap = {
      Dev_Id_Rem: 2,
      Sub_Campaign_Name: safe(data.data.Sub_Campaign_Name),
      Assign_Time: safe(Assign_Time1),
      Dev_Id: safe(data.data.Dev_Id),
      Owner: safe(data.data.Lead_Verification_Owner),
      Name: safe(data.data.Lead_Verification_Name),
      Sub_Campaign_ID: safe(data.data.Sub_Campaign_ID),
      Campaign_Name: safe(data.data.Campaign_id),
      Campaign:safe(data.data.Campaign),
      Valid_Till: safe(valid_till),
      Lead_Name: safe(data.data.Lead_Name),
      Email: safe(data.data.Email),
      Agent_Phone_No: safe(data.data.Agent_Phone_No),
      Agent_Name: safe(data.data.Agent_Name),
      Status: safe(data.data.Status),
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
    console.log(headers);
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v8/Leads/${data.data.lead_id}`,
      { headers }
    );

    console.log("✅ Record fetched  successfully:");

    // code to send the data back
    const lead = response.data.data[0]; // shortcut for cleaner code
    const safe = (value) => (value ? value : ""); // helper function

    // map subform data dynamically (if available)
    const assignedTimeline = Array.isArray(lead.Assigned_Agent_Timeline)
      ? lead.Assigned_Agent_Timeline.map((item) => ({
        Modified_Time: safe(item.Modified_Time),
        Created_Time: safe(item.Created_Time),
        Assigned_Time: safe(item.Assigned_Time),
        Lead_Sub_Status: safe(item.Lead_Sub_Status),
        Lead_Status: safe(item.Lead_Status),
        Assigned_To: safe(item.Assigned_To),
        Comments_by_agents: safe(item.Comments_by_agents),
        Assigned_By: safe(item.Assigned_By),
        Lead_Category: safe(item.Lead_Category),
        // Optional nested objects (Parent_Id, layout, etc.)
        Parent_Id: {
          name: safe(item?.Parent_Id?.name),
          id: safe(item?.Parent_Id?.id),
        },
        $layout_id: {
          display_label: safe(item?.$layout_id?.display_label),
          name: safe(item?.$layout_id?.name),
          id: safe(item?.$layout_id?.id),
        },
      }))
      : [];

    // main Zoho payload
    const dataMap = {
      Owner: safe(data.data.owner),
      Team_Leader: safe(data.data.Team_Leader),
      Agent_Phone_No: safe(data.data.Agent_Phone_No),
      Agent_Name: safe(data.data.Agent_Name),
      Alternate_Mobile_Number: safe(lead.Alternate_Mobile_Number),
      Full_Name1: safe(lead.Full_Name1),
      Last_Name: safe(lead.Last_Name),
      Mobile1: safe(lead.Mobile1),
      Mobile: safe(lead.Mobile),
      Email: safe(lead.Email),
      Email1: safe(lead.Email1),
      Secondary_Email: safe(lead.Secondary_Email),
      Dev_Id: safe(lead.Dev_Id),
      Residency_Status: safe(lead.Residency_Status),
      Occupation: safe(lead.Occupation),
      Date_of_Birth: safe(lead.Date_of_Birth),
      Nationality: safe(lead.Nationality),
      Update_Till: safe(lead.Update_Till),
      Days_Update_Till: safe(lead.Days_Update_Till),
      Campaign_ID: safe(lead.Campaign_ID),
      Campaign_Manager: safe(lead?.Campaign_Manager?.id),
      Campaign_Name: safe(lead?.Campaign_Name?.id),
      Campaign_Source1: safe(lead.Campaign_Source1),
      Campaign_Type: safe(lead.Campaign_Type),
      Event_Date: safe(lead.Event_Date),
      Sub_Campaign: safe(lead?.Sub_Campaign?.id),
      Lead_Source: safe(lead.Lead_Source),
      Lead_Status: "Open",
      Lead_Sub_Status: "Unattended",
      Targeted_Country: safe(lead.Targeted_Country),
      Targeted_City: safe(lead.Targeted_City),
      Targeted_State: safe(lead.Targeted_State),
      RR_triggered: true,
      Country: safe(lead.Country),
      Zip_Code: safe(lead.Zip_Code),
      State: safe(lead.State),
      Address: safe(lead.Address),
      City: safe(lead.City),
      Lead_Category: safe(lead.Lead_Category),
      Choose: safe(lead.Choose),
      List_of_Affliate: safe(lead.List_of_Affliate),
      Lead_Priority: safe(lead.Lead_Priority),
      Project_Name: safe(lead?.Project_Name?.id),
      Developer_Name: safe(lead?.Developer_Name?.id),
      Location: safe(lead.Location),
      Bedroom: safe(lead.Bedroom),
      Requirement: safe(lead.Requirement),
      Assign_Time: safe(Assign_Time1),
      Original_Created_Time: safe(lead.Original_Created_Time),

      // ✅ embed subform here
      Assigned_Agent_Timeline: assignedTimeline,
    };


    const payload = { data: [dataMap], trigger: ["workflow"] };
    console.log("payload", payload);
    console.log("token in post lead =>", token);

    const response1 = await axios.post(
      "https://www.zohoapis.com/crm/v8/Leads",
      payload,
      { headers }
    );
    console.log("✅ Record created successfully:", JSON.stringify(response1.data));

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