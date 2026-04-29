import { Request, Response } from "express";
import Instructor from "../../../core/models/instructor.model";
import User from "../../../core/models/user.model";
import InstructorRequest from "../../../core/models/instructorRequest.model";

import "../../../core/models/school.model";

export const getInstructors = async (req: Request, res: Response) => {
  try {
    const oktatok = await Instructor.find().populate("schools", "name");
    res.status(200).json(oktatok);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználók lekérésekor." });
    console.error("Hiba a felhasználók lekérésekor:", error);
  }
};

export const getCitiesWithInstructorsCount = async (req: Request, res: Response) => {
  try {
    const citiesCount = await Instructor.aggregate([
      { $match: { city: { $exists: true, $ne: "" } } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $project: { _id: 0, name: "$_id", count: 1 } }
    ]);
    res.status(200).json(citiesCount);
  } catch (error) {
    res.status(500).json({ error: "Hiba a városok aggregációjakor." });
    console.error("Hiba a városok aggregációjakor:", error);
  }
};

export const nominateInstructor = async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required in body.' });
    }

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) return res.status(404).json({ error: 'Oktató nem található.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Felhasználó nem található.' });

    if (!instructor.nominated_by) instructor.nominated_by = [];
    const already = instructor.nominated_by.find((id: any) => id.toString() === userId.toString());
    if (!already) {
      instructor.nominated_by.push(user._id);
      await instructor.save();
    }

    await InstructorRequest.create({ instructor: instructor._id, user: user._id, event: 'nominated', ip: req.ip || '', userAgent: req.get('User-Agent') || '' });

    return res.status(200).json({ message: 'Nomination recorded.' });
  } catch (error) {
    console.error('Error nominating instructor:', error);
    return res.status(500).json({ error: 'Szerver hiba a jelölés során.' });
  }
};

export const acceptStudent = async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.id;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId is required in body.' });

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) return res.status(404).json({ error: 'Oktató nem található.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Felhasználó nem található.' });

    if (!instructor.students) instructor.students = [];
    const alreadyStudent = instructor.students.find((id: any) => id.toString() === userId.toString());
    if (!alreadyStudent) {
      instructor.students.push(user._id);
    }

    if (instructor.nominated_by && instructor.nominated_by.length) {
      instructor.nominated_by = instructor.nominated_by.filter((id: any) => id.toString() !== userId.toString());
    }

    await instructor.save();

    if (!user.instructors) user.instructors = [];
    const alreadyLinked = user.instructors.find((id: any) => id.toString() === instructorId.toString());
    if (!alreadyLinked) {
      user.instructors.push(instructor._id);
      await user.save();
    }

    await InstructorRequest.create({ instructor: instructor._id, user: user._id, event: 'accepted', ip: req.ip || '', userAgent: req.get('User-Agent') || '' });

    return res.status(200).json({ message: 'Student accepted and linked.' });
  } catch (error) {
    console.error('Error accepting student:', error);
    return res.status(500).json({ error: 'Szerver hiba a jóváhagyás során.' });
  }
};

export const checkNominationStatus = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return res.status(404).json({ error: 'Oktató nem található.' });
    }

    const isStudent = (instructor.students || []).some(
      (sId: any) => sId.toString() === userId
    );
    const isPending = (instructor.nominated_by || []).some(
      (nId: any) => nId.toString() === userId
    );

    let status = 'none';
    if (isStudent) status = 'confirmed';
    else if (isPending) status = 'pending';

    return res.status(200).json({ status });
  } catch (error) {
    console.error('Error checking nomination status:', error);
    return res.status(500).json({ error: 'Szerver hiba.' });
  }
};

export const getMyStudents = async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.id;

    const instructor = await Instructor.findById(instructorId)
      .populate('students', 'name email')
      .populate('nominated_by', 'name email');

    if (!instructor) {
      return res.status(404).json({ error: 'Oktató nem található.' });
    }

    return res.status(200).json({
      students: instructor.students || [],
      pendingNominations: instructor.nominated_by || [],
    });
  } catch (error) {
    console.error('Error fetching my students:', error);
    return res.status(500).json({ error: 'Szerver hiba a tanulók lekérésekor.' });
  }
};

export const rejectStudent = async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.id;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId is required in body.' });

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) return res.status(404).json({ error: 'Oktató nem található.' });

    if (instructor.nominated_by && instructor.nominated_by.length) {
      instructor.nominated_by = instructor.nominated_by.filter(
        (id: any) => id.toString() !== userId.toString()
      );
      await instructor.save();
    }

    await InstructorRequest.create({
      instructor: instructor._id,
      user: userId,
      event: 'rejected',
      ip: req.ip || '',
      userAgent: req.get('User-Agent') || '',
    });

    return res.status(200).json({ message: 'Jelölés elutasítva.' });
  } catch (error) {
    console.error('Error rejecting student:', error);
    return res.status(500).json({ error: 'Szerver hiba az elutasítás során.' });
  }
};

export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate(
      "schools",
      "name",
    );
    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó lekérésekor." });
    console.error("Hiba a felhasználó lekérésekor:", error);
  }
};

export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba a felhasználó frissítésekor." });
    console.error("Hiba a felhasználó frissítésekor:", error);
  }
};

export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }
    res.status(200).json({ message: "Oktató sikeresen törölve." });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó törlésekor." });
    console.error("Hiba a felhasználó törlésekor:", error);
  }
};

export const searchInstructors = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const searchQuery = req.query.q as string;

    if (!searchQuery) {
      return res.status(200).json([]);
    }

    const instructors = await Instructor.find({
      name: { $regex: searchQuery, $options: "i" },
    })
      .select("name schools _id profileImage")
      .populate("schools", "name")
      .limit(10);

    return res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba keresés közben." });
    console.error("Hiba az oktatók keresésekor:", error);
  }
};

export const uploadInstructorProfileImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({ error: "Kép adatai kötelezők!" });
    }

    const sizeInBytes = Buffer.byteLength(profileImage, "utf8");
    if (sizeInBytes > 2_800_000) {
      return res.status(400).json({ error: "A kép mérete maximum 2MB lehet!" });
    }

    const instructor = await Instructor.findByIdAndUpdate(
      id,
      { profileImage },
      { new: true, select: "profileImage name email" }
    );

    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }

    return res.status(200).json({ message: "Profilkép sikeresen feltöltve!", profileImage: instructor.profileImage });
  } catch (error) {
    console.error("Hiba a profilkép feltöltésekor:", error);
    return res.status(500).json({ error: "Szerver hiba a profilkép feltöltésekor." });
  }
};

