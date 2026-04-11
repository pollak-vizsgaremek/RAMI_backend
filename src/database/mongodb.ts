import mongoose from "mongoose";
import dotenv from "dotenv";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL környezeti változó nincs beállítva!");

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("Sikeresen csatlakoztunk a MongoDB-hez!");
    } catch (error) {
        console.error("Hiba a MongoDB-hez való csatlakozáskor:", error);
        throw error; // Hiba dobása, hogy a hívó fél is kezelhesse
    }
};