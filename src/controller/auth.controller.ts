import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  User  from '../models/user.model';
import {connectDatabase} from '../service/dbConnection.service.ts';

const db = await connectDatabase();




export const register = async (req: Request, res: Response) => {
    console.log("Belépési kísérlet:", req.body);
  try {
    const { email, password } = req.body;

    // 1. Megnézzük, létezik-e már a felhasználó
    const existingUser = await db.collection('users').findOne({ email });
    console.log("Regisztrációs kísérlet email:", email);
    if (existingUser) return res.status(400).json({ message: "Ez az email már foglalt!" });

    // 2. Jelszó titkosítása (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Titkosított jelszó:", hashedPassword);

    // 3. Mentés az adatbázisba
    const newUser = new User({ email, password: hashedPassword });
    await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: "Sikeres regisztráció!" });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a regisztrációkor." });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
    console.log("Belépési kísérlet:", req.body);
  try {
    const { email, password } = req.body;

    // 1. Felhasználó megkeresése
    const user = await db.collection('users').findOne({ email });
    
    console.log("Talált felhasználó:", user);
    if (!user) return res.status(404).json({ message: "Felhasználó nem található!" });

    // 2. Jelszó ellenőrzése (bcrypt összehasonlítja a simát a titkosítottal)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Hibás jelszó!" });

    // 3. JWT Generálása (Ez a "VIP karszalag")
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'titkos_kulcs', 
      { expiresIn: '1d' } // 1 napig érvényes
    );

    // 4. Visszaküldjük a tokent a frontendnek
    res.json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a belépéskor." });
  }
};