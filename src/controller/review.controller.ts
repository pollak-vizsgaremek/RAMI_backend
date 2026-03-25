import mongoose from "mongoose";
import e, { Request, Response } from "express";
import Review from "../models/ertekeles.model";

export const getReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Szerver hiba az értékelések lekérdezésekor." });
        console.error("Hiba az értékelések lekérdezésekor:", error);
    }
};


export const createReview = async (req:Request, res: Response) => {
    try {
        const { user, instructor, rating} = req.body;
        const newReview = await Review.create({ user, instructor, rating });
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: "Szerver hiba az értékelés létrehozásakor." });
        console.error("Hiba az értékelés létrehozásakor:", error);
    }


};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ error: "Értékelés nem található." });
        }
        res.status(200).json({ message: "Értékelés sikeresen törölve." });
    } catch (error) {
        res.status(500).json({ error: "Szerver hiba az értékelés törlésekor." });
        console.error("Hiba az értékelés törlésekor:", error);
    }
};