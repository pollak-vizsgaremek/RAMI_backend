import Instructor from "../models/instructor.model";
import Review from "../models/rating.model";

/**
 * Recalculates the average rating and review count for ALL instructors.
 * Called by a cron job every hour and also once on server startup.
 */
export const recalculateAllRatings = async () => {
  try {
    console.log("[CRON] Átlagértékelések újraszámítása...");

    // Aggregate: group reviews by instructor, calculate avg of details fields
    const pipeline = await Review.aggregate([
      {
        $group: {
          _id: "$instructor",
          count: { $sum: 1 },
          avgTurelem: { $avg: "$details.turelem" },
          avgSzaktudas: { $avg: "$details.szaktudas" },
          avgKommunikacio: { $avg: "$details.kommunikacio" },
          avgRugalmasag: { $avg: "$details.rugalmasag" },
        },
      },
    ]);

    // Build a map of instructorId -> { averageRating, reviewCount }
    const ratingsMap: Record<string, { averageRating: number; reviewCount: number }> = {};
    for (const item of pipeline) {
      const avg =
        ((item.avgTurelem || 0) +
          (item.avgSzaktudas || 0) +
          (item.avgKommunikacio || 0) +
          (item.avgRugalmasag || 0)) /
        4;
      ratingsMap[item._id.toString()] = {
        averageRating: Math.round(avg * 10) / 10, // 1 decimal
        reviewCount: item.count,
      };
    }

    // Get all instructors
    const allInstructors = await Instructor.find({}, "_id");

    // Update each instructor
    const bulkOps = allInstructors.map((inst) => {
      const data = ratingsMap[inst._id.toString()] || {
        averageRating: 0,
        reviewCount: 0,
      };
      return {
        updateOne: {
          filter: { _id: inst._id },
          update: {
            $set: {
              averageRating: data.averageRating,
              reviewCount: data.reviewCount,
            },
          },
        },
      };
    });

    if (bulkOps.length > 0) {
      await Instructor.bulkWrite(bulkOps);
    }

    console.log(
      `[CRON] ${allInstructors.length} oktató értékelése frissítve. (${pipeline.length} oktatónak van értékelése)`,
    );
  } catch (error) {
    console.error("[CRON] Hiba az átlagértékelések újraszámításakor:", error);
  }
};
