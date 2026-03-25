import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  User  from '../models/user.model';
import mongoose from 'mongoose';
import dotenv from 'dotenv';



export const register = async (req: Request, res: Response, next: Function) => {
  
   const session = await mongoose.startSession();
   

  try { 
    const { name, email, password } = req.body;
    console.log("Regisztrációs adatok:", { name, email, password: "********" });
    const existingUser: any = await User.findOne({ email });
    console.log("Talált felhasználó:", existingUser);
    
    if (existingUser){
      const error = new Error("Felhasználó már létezik!");
      return res.status(409).json({ message: error.message });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    
    const newUser = await User.create([{name:name,email:email, password: hashedPassword }], { session });
    if (!newUser) {
      const error = new Error("Hiba a felhasználó létrehozásakor!");
      return res.status(500).json({ message: error.message });
    }
    if (process.env.JWT_SECRET === undefined || process.env.JWT_expires_IN === undefined){
      return res.status(500).json({ message: "internal server error" });
    } 

    const token = jwt.sign({usingId: newUser[0]._id}, process.env.JWT_SECRET as any , { expiresIn: process.env.JWT_EXPIRES_IN as any || '1d' });

    res.status(201).json({
      success: true, 
      message: "Sikeres regisztráció!" });
      token: token
      
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a regisztrációkor." });
    console.error("Hiba a regisztrációkor:", error);
  }
};

//LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "Felhasználó nem található!" });

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Hibás jelszó!" });

   
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET as any, 
      { expiresIn: process.env.JWT_EXPIRES_IN as any || '1d' } 
    );

    res.json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a belépéskor." });
  }
};