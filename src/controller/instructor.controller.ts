import { Request, Response } from "express";
import Oktato from "../models/instructor.model";

// We import it THIS way so TypeScript is forced to run the file and register the schema,
// even if we don't directly call "Iskola.find()" in this file!
import "../models/school.model";

// GET ALL
export const getInstructors = async (req: Request, res: Response) => {
  try {
    const oktatok = await Oktato.find().populate("schools", "name");
    res.status(200).json(oktatok);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználók lekérésekor." });
    console.error("Hiba a felhasználók lekérésekor:", error);
  }
};

// GET BY ID
export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const instructor = await Oktato.findById(req.params.id).populate(
      "schools",
      "name",
    );
    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó lekérésekor." });
    console.error("Hiba a felhasználó lekérésekor:", error);
  }
};

// UPDATE
export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await Oktato.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba a felhasználó frissítésekor." });
    console.error("Hiba a felhasználó frissítésekor:", error);
  }
};

// DELETE
export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await Oktato.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }
    res.status(200).json({ message: "Oktató sikeresen törölve." });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó törlésekor." });
    console.error("Hiba a felhasználó törlésekor:", error);
  }
};

// SEARCH FUNCTION 
export const searchInstructors = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const searchQuery = req.query.q as string;

    if (!searchQuery) {
      return res.status(200).json([]);
    }

    const instructors = await Oktato.find({
      name: { $regex: searchQuery, $options: "i" },
    })
      .select("name schools _id")
      .populate("schools", "name") 
      .limit(10);

    return res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba keresés közben." });
    console.error("Hiba az oktatók keresésekor:", error);
  }
};
