import { NextFunction, Request, Response } from "express";
import { validate } from "../service/apiKey.service";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../models/User.model";
import Teacher from "../models/oktato.model";


export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token

    if (req.headers["authorization"] && req.headers["authorization"].startsWith("Bearer")) {
      token = req.headers["authorization"].split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = await jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById((decoded as any).userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    next();


  }catch (error) {
    console.error("Hiba az API kulcs ellenőrzésekor:", error);
    res.status(401).json({ message: "Hiba történt az API kulcs ellenőrzésekor." });
  }

};

export const authorize_school = async (req: Request, res: Response, next: NextFunction) => {
  let token

    if (req.headers["authorization"] && req.headers["authorization"].startsWith("Bearer")) {
      token = req.headers["authorization"].split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = await jwt.verify(token, process.env.JWT_SECRET!);

    const user = await Teacher.findById((decoded as any).userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    next();

  };