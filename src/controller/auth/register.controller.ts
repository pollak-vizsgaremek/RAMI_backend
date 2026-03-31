import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    console.log("Regisztrációs adatok:", { name, email, password: "********" });

    const existingUser = await User.findOne({ email });
    console.log("Talált felhasználó:", existingUser);

    if (existingUser) {
      return res.status(409).json({ message: "Felhasználó már létezik!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res
        .status(500)
        .json({ message: "Hiba a felhasználó létrehozásakor!" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Internal server error: Missing JWT Secret" });
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any },
    );

    return res.status(201).json({
      success: true,
      message: "Sikeres regisztráció!",
      token: token,
    });
  } catch (error) {
    console.error("Hiba a regisztrációkor:", error);
    return res.status(500).json({ error: "Szerver hiba a regisztrációkor." });
  }
};
