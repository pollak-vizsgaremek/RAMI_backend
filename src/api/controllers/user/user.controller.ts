import { Request, Response } from "express";
import User from "../../../core/models/user.model";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználók lekérésekor." });
    console.error("Hiba a felhasználók lekérésekor:", error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó lekérésekor." });
    console.error("Hiba a felhasználó lekérésekor:", error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba a felhasználó frissítésekor." });
    console.error("Hiba a felhasználó frissítésekor:", error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }
    res.status(200).json({ message: "Felhasználó sikeresen törölve." });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó törlésekor." });
    console.error("Hiba a felhasználó törlésekor:", error);
  }
};

export const nominateInstructor = async (req: Request, res: Response) => {
  try {
    const { instructorId } = req.body;
    const userId = req.params.id;

    if (!instructorId) {
      return res.status(400).json({ error: "Oktató ID szükséges." });
    }

    // Import a service-ből
    const { nominateInstructor: nominateService } =
      await import("../../../core/services/instructor.service");

    const updatedInstructor = await nominateService(userId, instructorId);

    res.status(200).json({
      message: "Sikeresen megjelölted az oktatót.",
      instructor: updatedInstructor,
    });
  } catch (error: any) {
    console.error("Hiba az oktató megjelölésekor:", error);

    if (
      error.message.includes("nem található") ||
      error.message.includes("Már megjelöltél")
    ) {
      return res.status(400).json({ error: error.message });
    }

    res
      .status(500)
      .json({ error: "Szerver hiba az oktató megjelölésekor." });
  }
};

export const getUserInstructors = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "instructors",
      select: "name email phoneNumber city experience isVerified approvalStatus",
      populate: { path: "schools", select: "name" },
    });

    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }

    const instructors = user.instructors || [];
    return res.status(200).json(instructors);
  } catch (error) {
    console.error("Hiba az oktatók lekérésekor:", error);
    return res.status(500).json({ error: "Szerver hiba az oktatók lekérésekor." });
  }
};


