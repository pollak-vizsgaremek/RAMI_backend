import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../core/models/user.model";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Hozzáférés megtagadva - Token hiányzik" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ error: "Szerver hiba - JWT Secret hiányzik" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as DecodedToken;

    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: "Felhasználó nem található" });
      return;
    }

    // Check if user is admin (has "creator", "admin", or "moderator" role)
    if (!["creator", "admin", "moderator"].includes(user.role)) {
      res.status(403).json({
        error: "Hozzáférés megtagadva - Admin jogosultság szükséges",
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin token verification error:", error);
    res.status(401).json({
      error: "Hozzáférés megtagadva - Érvénytelen token",
    });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Hozzáférés megtagadva - Token hiányzik" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ error: "Szerver hiba - JWT Secret hiányzik" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as DecodedToken;

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: "Felhasználó nem található" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      error: "Hozzáférés megtagadva - Érvénytelen token",
    });
  }
};
