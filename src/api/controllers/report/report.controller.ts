import { Request, Response } from "express";
import Report from "../../../core/models/report.model";

export const createReport = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user, email, category, description } = req.body;

    if (!category || !description) {
      return res.status(400).json({ error: "Kategória és leírás kötelező!" });
    }

    const newReport = await Report.create({
      user: user || undefined,
      email: email || "Nem megadva",
      category,
      description,
    });

    return res.status(201).json({
      message: "Hibajelentés sikeresen elküldve!",
      report: newReport,
    });
  } catch (error: any) {
    console.error("Hiba a hibajelentés létrehozásakor:", error);
    return res.status(500).json({
      error: error.message || "Szerver hiba a hibajelentés létrehozásakor.",
    });
  }
};

export const getReports = async (req: Request, res: Response): Promise<any> => {
  try {
    const reports = await Report.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Hiba a hibajelentések lekérésekor:", error);
    return res.status(500).json({ error: "Szerver hiba." });
  }
};

export const updateReportStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    const report = await Report.findByIdAndUpdate(
      id,
      { status, resolution },
      { new: true },
    );

    if (!report) {
      return res.status(404).json({ error: "Hibajelentés nem található." });
    }

    return res.status(200).json({ message: "Státusz frissítve.", report });
  } catch (error) {
    console.error("Hiba a státusz frissítésekor:", error);
    return res.status(500).json({ error: "Szerver hiba." });
  }
};
