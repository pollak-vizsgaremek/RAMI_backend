import { Request, Response } from "express";
import Instructor from "../../../core/models/instructor.model";

export const getLeaderboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const top30 = await Instructor.find({ averageRating: { $gt: 0 } })
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(30)
      .select("name city averageRating reviewCount schools profileImage");

    return res.status(200).json(top30);
  } catch (error) {
    console.error("Hiba a ranglista lekérésekor:", error);
    return res.status(500).json({ error: "Szerver hiba." });
  }
};

export const getTopInstructor = async (req: Request, res: Response): Promise<any> => {
  try {
    const top = await Instructor.findOne({ averageRating: { $gt: 0 } })
      .sort({ averageRating: -1, reviewCount: -1 })
      .select("name city averageRating reviewCount schools _id profileImage");

    if (!top) {
      return res.status(404).json({ message: "Nincs értékelt oktató." });
    }

    return res.status(200).json(top);
  } catch (error) {
    console.error("Hiba a legjobb oktató lekérésekor:", error);
    return res.status(500).json({ error: "Szerver hiba." });
  }
};
