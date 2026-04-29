import { Request, Response } from "express";
import School from "../../../core/models/school.model";

export const getSchoolNames = async (req: Request, res: Response) => {
  try {
    const schools = await School.find().select("_id name").sort({ name: 1 });
    const result = schools.map((s) => ({ id: s._id, name: s.name }));
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching school names:", error);
    return res.status(500).json({ error: "Hiba az iskolák lekérésekor." });
  }
};

export default getSchoolNames;

import User from "../../../core/models/user.model";
import bcrypt from "bcryptjs";

export const publicRegisterSchool = async (req: Request, res: Response) => {
  try {
    const {
      name,
      address,
      zipCode,
      elerhetosegek,
      webpage,
      categories,
      instructors,
      userEmail,
      userPassword,
    } = req.body;

    if (!userEmail || !userPassword) {
      return res.status(400).json({ error: "Az iskola regisztrációjához meg kell adni a kezelő email címét és jelszavát!" });
    }

    const adminUser = await User.findOne({ email: userEmail.toLowerCase().trim() });
    if (!adminUser) {
      return res.status(404).json({ error: "A megadott email címmel nem található felhasználó!" });
    }

    if (!adminUser.isVerified) {
      return res.status(400).json({ error: "A megadott felhasználói fiók még nincs hitelesítve (email visszaigazolás hiányzik)!" });
    }

    const isMatch = await bcrypt.compare(userPassword, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Helytelen jelszó!" });
    }

    const school = new School({
      name,
      address,
      zipCode,
      elerhetosegek,
      webpage,
      categories,
      instructors,
    });

    await school.save();

    adminUser.role = "school";
    adminUser.managedSchool = school._id;
    await adminUser.save();

    return res.status(201).json({ id: school._id, message: "Iskola sikeresen regisztrálva." });
  } catch (error: any) {
    console.error("Error public registering school:", error);
    if (error && error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ error: "Hiba az iskola regisztrációja során." });
  }
};

export const registerSchool = async (req: Request, res: Response) => {
  try {
    const {
      name,
      address,
      zipCode,
      elerhetosegek,
      webpage,
      categories,
      instructors,
      adminEmail,
    } = req.body;

    if (!adminEmail) {
      return res.status(400).json({ error: "Az iskola regisztrációjához meg kell adni a kezelő email címét!" });
    }

    const adminUser = await User.findOne({ email: adminEmail.toLowerCase().trim() });
    if (!adminUser) {
      return res.status(404).json({ error: "A megadott email címmel nem található felhasználó!" });
    }

    if (!adminUser.isVerified) {
      return res.status(400).json({ error: "A megadott felhasználói fiók még nincs hitelesítve (email visszaigazolás hiányzik)!" });
    }

    const school = new School({
      name,
      address,
      zipCode,
      elerhetosegek,
      webpage,
      categories,
      instructors,
    });

    await school.save();

    adminUser.role = "school";
    adminUser.managedSchool = school._id;
    await adminUser.save();

    return res.status(201).json({ id: school._id, message: "Iskola sikeresen regisztrálva." });
  } catch (error: any) {
    console.error("Error registering school:", error);
    if (error && error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ error: "Hiba az iskola regisztrációja során." });
  }
};

export const getSchools = async (req: Request, res: Response) => {
  try {
    const schools = await School.find()
      .populate("categories", "name")
      .populate("instructors", "name")
      .sort({ name: 1 });
    return res.status(200).json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return res.status(500).json({ error: "Hiba az iskolák lekérésekor." });
  }
};

export const getSchoolById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const school = await School.findById(id)
      .populate("categories", "name")
      .populate("instructors", "name");
      
    if (!school) {
      return res.status(404).json({ error: "Iskola nem található." });
    }
    
    return res.status(200).json(school);
  } catch (error) {
    console.error("Error fetching school by id:", error);
    return res.status(500).json({ error: "Hiba az iskola lekérésekor." });
  }
};

export const updateSchool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: "Nincs bejelentkezve!" });
    }

    const isAdmin = ["creator", "admin", "moderator"].includes(user.role);
    const isSchoolManager = user.role === "school" && user.managedSchool?.toString() === id;

    if (!isAdmin && !isSchoolManager) {
      return res.status(403).json({ error: "Nincs jogosultságod ennek az iskolának a szerkesztéséhez!" });
    }

    const school = await School.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!school) {
      return res.status(404).json({ error: "Iskola nem található." });
    }

    return res.status(200).json({ message: "Iskola sikeresen frissítve.", school });
  } catch (error: any) {
    console.error("Error updating school:", error);
    if (error && error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ error: "Hiba az iskola frissítése során." });
  }
};

export const deleteSchool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const school = await School.findByIdAndDelete(id);

    if (!school) {
      return res.status(404).json({ error: "Iskola nem található." });
    }

    return res.status(200).json({ message: "Iskola sikeresen törölve." });
  } catch (error) {
    console.error("Error deleting school:", error);
    return res.status(500).json({ error: "Hiba az iskola törlése során." });
  }
};
