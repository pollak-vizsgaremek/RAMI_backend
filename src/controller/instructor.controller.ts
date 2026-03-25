import { Request, Response } from "express";
import Oktato from "../models/oktato.model";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const oktatok = await Oktato.find();
    res.status(200).json(oktatok);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználók lekérésekor." });
    console.error("Hiba a felhasználók lekérésekor:", error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await Oktato.findById(req.params.id);
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
    const user = await Oktato.findByIdAndUpdate(req.params.id, req.body, {
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
    const user = await Oktato.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }
    res.status(200).json({ message: "Felhasználó sikeresen törölve." });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó törlésekor." });
    console.error("Hiba a felhasználó törlésekor:", error);
  }
};
