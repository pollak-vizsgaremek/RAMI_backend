import { Router } from "express";
import {
  createReport,
  getReports,
  updateReportStatus,
} from "../controllers/report/report.controller";

const reportRouter = Router();


reportRouter.post("/create", createReport);


reportRouter.get("/", getReports);


reportRouter.put("/:id/status", updateReportStatus);

export default reportRouter;
