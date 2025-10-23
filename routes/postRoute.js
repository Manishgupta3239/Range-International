import { Router } from "express";
import { PostLeadVerification , PostLeads} from "../controllers/PostLeadVerification.js";

export const postRouter = Router();

postRouter.post("/leadVerification",PostLeadVerification);
postRouter.post("/leads",PostLeads);