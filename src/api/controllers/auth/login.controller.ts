import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../core/models/user.model";

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Felhasználó nem található!" });
    }

    // --- NEW: BLOCK UNVERIFIED USERS ---
    if (user.isVerified === false) {
      return res.status(403).json({
        message:
          "Kérlek, először erősítsd meg az e-mail címedet a kiküldött linken!",
      });
    }
    // -----------------------------------

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Hibás jelszó!" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Internal server error: Missing JWT Secret" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any },
    );

    return res.json({
      token,
      email: user.email,
      name: user.name,
      role: user.role || "user",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Hiba a belépéskor:", error);
    return res.status(500).json({ error: "Szerver hiba a belépéskor." });
  }
};
