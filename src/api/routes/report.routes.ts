import { Router } from "express";
import {
  createReport,
  getReports,
  updateReportStatus,
} from "../controllers/report/report.controller";

const reportRouter = Router();

// Public - anyone can submit a report
reportRouter.post("/create", createReport);

// Admin - get all reports
reportRouter.get("/", getReports);

// Admin - update report status
reportRouter.put("/:id/status", updateReportStatus);

export default reportRouter;
