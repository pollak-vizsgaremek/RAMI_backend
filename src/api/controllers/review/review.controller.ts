import { Request, Response } from "express";
import Review from "../../../core/models/rating.model";

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Hiba az értékelések lekérdezésekor:", error);
    res
      .status(500)
      .json({ error: "Szerver hiba az értékelések lekérdezésekor." });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    // Kinyerjük az új adatstruktúrát a kérésből
    const { user, instructor, rating, comment, details } = req.body;

    // Ellenőrzés: max 2 értékelés egy oktatóhoz egy felhasználótól
    const existingCount = await Review.countDocuments({ user, instructor });
    if (existingCount >= 2) {
      return res.status(400).json({
        error: "Egy oktatóhoz maximum 2 értékelést írhatsz!",
      });
    }

    // Létrehozzuk az értékelést
    const newReview = await Review.create({
      user,
      instructor,
      rating,
      comment,
      details, // Eltároljuk a 4 kategória pontjait is
    });

    res.status(201).json(newReview);
  } catch (error: any) {
    console.error("Hiba az értékelés létrehozásakor:", error.message || error);
    res
      .status(500)
      .json({
        error: error.message || "Szerver hiba az értékelés létrehozásakor.",
      });
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
    console.error("Hiba az értékelés törlésekor:", error);
    res.status(500).json({ error: "Szerver hiba az értékelés törlésekor." });
  }
};

export const getInstructorReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ instructor: id }).populate(
      "user",
      "name",
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Hiba az oktató értékeléseinek lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba." });
  }
};

export const getMyReviews = async (req: Request | any, res: Response) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId }).populate(
      "instructor",
      "name",
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Hiba a saját értékelések lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba." });
  }
};

export const toggleHelpfulReview = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const reviewId = req.params.id;
    const { userId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review)
      return res.status(404).json({ error: "Értékelés nem található." });

    const hasLiked = review.helpfulUsers.includes(userId);

    if (hasLiked) {
      review.helpfulUsers = review.helpfulUsers.filter(
        (id: any) => id.toString() !== userId.toString(),
      );
      review.helpfulCount -= 1;
    } else {
      review.helpfulUsers.push(userId);
      review.helpfulCount += 1;
    }

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    console.error("Hiba az értékelés kedvelésekor:", error);
    res.status(500).json({ error: "Szerver hiba." });
  }
};
