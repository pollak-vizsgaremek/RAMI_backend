import { Request, Response } from "express";
import School from "../../../core/models/school.model";

export const getSchoolNames = async (req: Request, res: Response) => {
  try {
    const schools = await School.find().select("_id name").sort({ name: 1 });
    const result = schools.map((s) => ({ id: s._id, name: s.name }));
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching school names:", error);
    return res.status(500).json({ error: "Hiba az iskolák lekérésekor." });
  }
};

export default getSchoolNames;
