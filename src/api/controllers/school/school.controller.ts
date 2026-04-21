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

export const registerSchool = async (req: Request, res: Response) => {
  try {
    const {
      name,
      address,
      zipCode,
      elerhetosegek,
      webpage,
      categories,
      instructors,
    } = req.body;

    const school = new School({
      name,
      address,
      zipCode,
      elerhetosegek,
      webpage,
      categories,
      instructors,
    });

    await school.save();

    return res.status(201).json({ id: school._id, message: "Iskola sikeresen regisztrálva." });
  } catch (error: any) {
    console.error("Error registering school:", error);
    if (error && error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ error: "Hiba az iskola regisztrációja során." });
  }
};
