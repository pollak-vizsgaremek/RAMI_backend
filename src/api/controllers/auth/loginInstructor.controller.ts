import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Instructor from "../../../core/models/instructor.model";

export const loginInstructor = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const instructor = await Instructor.findOne({ email });

    if (!instructor) {
      return res.status(404).json({ message: "Oktató nem található ezzel az email címmel!" });
    }

    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Hibás jelszó!" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Internal server error: Missing JWT Secret" });
    }

    const token = jwt.sign(
      { userId: instructor._id, isInstructor: true },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any },
    );

    return res.json({
      token,
      email: instructor.email,
      name: instructor.name,
      role: "instructor",
      user: {
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        role: "instructor",
        instructorId: instructor._id,
      },
    });
  } catch (error) {
    console.error("Hiba az oktatói belépéskor:", error);
    return res.status(500).json({ error: "Szerver hiba a belépéskor." });
  }
};
