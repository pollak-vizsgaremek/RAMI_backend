import Instructor from "../models/instructor.model";
import User from "../models/user.model";

export const nominateInstructor = async (
  userId: string,
  instructorId: string,
) => {
  try {
    // Ellenőrizzük, hogy a user létezik-e
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Felhasználó nem található.");
    }

    // Ellenőrizzük, hogy az oktató létezik-e
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      throw new Error("Oktató nem található.");
    }

    // Ellenőrizzük, hogy nincs-e már megjelölve
    if (
      instructor.nominated_by &&
      instructor.nominated_by.includes(userId as any)
    ) {
      throw new Error("Már megjelölted ezt az oktatót.");
    }

    // Hozzáadunk a nominated_by tömbéhez (duplikátum védelem: $addToSet)
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      instructorId,
      { $addToSet: { nominated_by: userId } },
      { new: true },
    );

    return updatedInstructor;
  } catch (error) {
    throw error;
  }
};
