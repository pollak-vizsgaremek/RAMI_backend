import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Added crypto
import User from "../../models/user.model";
import sendEmail from "../../service/sendEmail.service"; // Import your email service!

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Felhasználó már létezik!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Generate a random verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 2. Create the user as UNVERIFIED
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: verificationToken,
    });

    if (!newUser) {
      return res
        .status(500)
        .json({ message: "Hiba a felhasználó létrehozásakor!" });
    }

    // 3. Create the verification link
    const verifyUrl = `http://localhost:3300/api/v1/auth/verify/${verificationToken}`;
    const message = `Kedves ${name}!\n\nKöszönjük, hogy regisztráltál a Rate My Instructor oldalra.\nKérlek, kattints az alábbi linkre a fiókod aktiválásához:\n\n${verifyUrl}\n\nHa nem te regisztráltál, kérlek hagyd figyelmen kívül ezt az e-mailt.`;

    // 4. Send the email using your existing service
    try {
      await sendEmail({
        email: newUser.email,
        subject: "Fiók aktiválása - Rate My Instructor",
        message: message,
      });

      // Tell frontend to show a success message but DO NOT return a JWT token!
      return res.status(201).json({
        success: true,
        message: "Sikeres regisztráció! Kérlek erősítsd meg az e-mail címedet.",
      });
    } catch (emailError) {
      console.error("Hiba az email küldésekor:", emailError);
      return res
        .status(500)
        .json({ message: "Hiba történt a megerősítő e-mail elküldésekor." });
    }
  } catch (error) {
    console.error("Hiba a regisztrációkor:", error);
    return res.status(500).json({ error: "Szerver hiba a regisztrációkor." });
  }
};

// --- NEW FUNCTION: VERIFY THE EMAIL LINK ---
export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { token } = req.params;

    // Find the user with this exact token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .send(
          "<h1>Hiba!</h1><p>A megerősítő link érvénytelen vagy már felhasználták.</p>",
        );
    }

    // Activate the user and remove the token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Redirect the user back to your React frontend!
    res.redirect("http://localhost:5173/?verified=true");
  } catch (error) {
    console.error("Hiba a verifikációkor:", error);
    res.status(500).send("Szerver hiba a megerősítés során.");
  }
};
