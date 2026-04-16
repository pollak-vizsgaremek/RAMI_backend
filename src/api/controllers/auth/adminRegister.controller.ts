import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../../../core/models/user.model";

// Admin registration codes are managed by existing admins
// In production, you'd store these in a separate table or use a different auth method
const ADMIN_REGISTRATION_CODES: Map<
  string,
  {
    email: string;
    role: string;
    used: boolean;
    createdAt: Date;
    expiresAt: Date;
  }
> = new Map();

// Generate a secure registration code that existing admins can share
export const generateAdminRegistrationCode = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // This endpoint should only be accessible by existing admins
    // Check if requester is admin
    if (
      !req.user ||
      !["creator", "admin", "moderator"].includes(req.user.role)
    ) {
      return res.status(403).json({
        error: "Csak adminisztrátorok generálhatnak regisztrációs kódokat.",
      });
    }

    const { email, role = "admin", expiresIn = 24 } = req.body;

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        error: "Érvényes email cím szükséges.",
      });
    }

    // Validate role
    const allowedRoles = ["admin", "moderator", "creator"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error:
          "Érvénytelen szerepkör. Engedélyezett: admin, moderator, creator",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Ez az email cím már regisztrálva van.",
      });
    }

    // Generate secure random code
    const code = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000);

    // Store code
    ADMIN_REGISTRATION_CODES.set(code, {
      email,
      role,
      used: false,
      createdAt: new Date(),
      expiresAt,
    });

    res.status(200).json({
      message: "Regisztrációs kód sikeresen generálva.",
      code,
      email,
      role,
      expiresAt,
      expiresIn: `${expiresIn} óra`,
      note: "Oszd meg ezt a kódot az új adminisztrátor jelölttel. Csak egyszer használható.",
    });
  } catch (error) {
    console.error("Error generating admin code:", error);
    res.status(500).json({
      error: "Hiba a regisztrációs kód generálása során.",
    });
  }
};

// Register as admin using the provided code
export const registerAdmin = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { email, password, confirmPassword, name, registrationCode } =
      req.body;

    // Validate required fields
    if (!email || !password || !confirmPassword || !name || !registrationCode) {
      return res.status(400).json({
        error: "Minden mező kitöltése szükséges.",
      });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        error: "Érvénytelen email formátum.",
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "A jelszavak nem egyeznek.",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: "A jelszó legalább 6 karakter hosszú kell, hogy legyen.",
      });
    }

    // Validate registration code
    const codeData = ADMIN_REGISTRATION_CODES.get(registrationCode);

    if (!codeData) {
      return res.status(400).json({
        error: "Érvénytelen vagy nem létező regisztrációs kód.",
      });
    }

    // Check if code has expired
    if (new Date() > codeData.expiresAt) {
      ADMIN_REGISTRATION_CODES.delete(registrationCode);
      return res.status(400).json({
        error: "A regisztrációs kód lejárt.",
      });
    }

    // Check if code already used
    if (codeData.used) {
      return res.status(400).json({
        error: "Ezt a regisztrációs kódot már felhasználták.",
      });
    }

    // Check if email matches the code
    if (codeData.email !== email) {
      return res.status(400).json({
        error: "Az email cím nem egyezik a regisztrációs kóddal.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Ez az email cím már regisztrálva van.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: codeData.role || "admin",
      isVerified: true, // Admin registrations are auto-verified
    });

    await newAdmin.save();

    // Mark code as used
    codeData.used = true;

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "Szerver hiba - JWT Secret hiányzik",
      });
    }

    const signOptions: SignOptions = {};
    if (process.env.JWT_EXPIRES_IN) {
      signOptions.expiresIn = process.env.JWT_EXPIRES_IN as any;
    } else {
      signOptions.expiresIn = "1d" as any;
    }

    const token = jwt.sign(
      { userId: newAdmin._id },
      process.env.JWT_SECRET || "default-secret",
      signOptions,
    );

    res.status(201).json({
      message: "Admin sikeresen regisztrálva.",
      token,
      user: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({
      error: "Hiba az admin regisztrálása során.",
    });
  }
};

// Validate if code is valid (frontend can check before showing form)
export const validateRegistrationCode = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { code } = req.params;

    const codeData = ADMIN_REGISTRATION_CODES.get(code);

    if (!codeData) {
      return res.status(400).json({
        valid: false,
        error: "Érvénytelen vagy nem létező regisztrációs kód.",
      });
    }

    // Check if expired
    if (new Date() > codeData.expiresAt) {
      ADMIN_REGISTRATION_CODES.delete(code);
      return res.status(400).json({
        valid: false,
        error: "A regisztrációs kód lejárt.",
      });
    }

    // Check if already used
    if (codeData.used) {
      return res.status(400).json({
        valid: false,
        error: "Ezt a regisztrációs kódot már felhasználták.",
      });
    }

    res.status(200).json({
      valid: true,
      email: codeData.email,
      role: codeData.role,
      expiresAt: codeData.expiresAt,
      message: "Regisztrációs kód érvényes.",
    });
  } catch (error) {
    console.error("Error validating registration code:", error);
    res.status(500).json({
      error: "Hiba a regisztrációs kód ellenőrzése során.",
    });
  }
};

// Get all active registration codes (admin only)
export const getActiveRegistrationCodes = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Only admins can view codes
    if (
      !req.user ||
      !["creator", "admin", "moderator"].includes(req.user.role)
    ) {
      return res.status(403).json({
        error: "Csak adminisztrátorok tekinthetik meg a kódokat.",
      });
    }

    const codes = Array.from(ADMIN_REGISTRATION_CODES.entries()).map(
      ([code, data]) => ({
        code,
        email: data.email,
        role: data.role,
        used: data.used,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        isExpired: new Date() > data.expiresAt,
      }),
    );

    res.status(200).json({
      codes,
      total: codes.length,
      active: codes.filter((c) => !c.used && !c.isExpired).length,
    });
  } catch (error) {
    console.error("Error fetching codes:", error);
    res.status(500).json({
      error: "Hiba a kódok lekéréséhez.",
    });
  }
};

// Revoke a registration code (admin only)
export const revokeRegistrationCode = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Only admins can revoke codes
    if (
      !req.user ||
      !["creator", "admin", "moderator"].includes(req.user.role)
    ) {
      return res.status(403).json({
        error: "Csak adminisztrátorok vonhatnak vissza kódokat.",
      });
    }

    const { code } = req.params;

    if (!ADMIN_REGISTRATION_CODES.has(code)) {
      return res.status(404).json({
        error: "A regisztrációs kód nem található.",
      });
    }

    ADMIN_REGISTRATION_CODES.delete(code);

    res.status(200).json({
      message: "Regisztrációs kód sikeresen visszavonva.",
    });
  } catch (error) {
    console.error("Error revoking code:", error);
    res.status(500).json({
      error: "Hiba a kód visszavonása során.",
    });
  }
};
