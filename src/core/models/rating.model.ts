import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Felhasználó ID kötelező!"],
      index: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: [true, "Oktató ID kötelező!"],
      index: true,
    },

    // A kiszámolt átlagos értékelés, amit az Admin panel is használ
    rating: {
      type: Number,
      required: [true, "Értékelés (átlag) kötelező!"],
      min: [1, "Minimum értékelés 1!"],
      max: [10, "Maximum értékelés 10!"],
    },

    // Szöveges értékelés (tapasztalat)
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Maximális hossz 1000 karakter!"],
    },

    // Részletes pontszámok elmentése (későbbi profil statisztikákhoz)
    details: {
      turelem: { type: Number, min: 1, max: 10 },
      szaktudas: { type: Number, min: 1, max: 10 },
      kommunikacio: { type: Number, min: 1, max: 10 },
      rugalmasag: { type: Number, min: 1, max: 10 },
    },

    helpfulCount: { type: Number, default: 0 },
    helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Rating", ratingSchema, "ratings");
