import mongoose from "mongoose";

const ertekelesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Felhasználó ID kötelező!"],
      index: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Oktato",
      required: [true, "Oktató ID kötelező!"],
      index: true,
    },

    rating: [
      {
        patience: {
          type: Number,
          required: [true, "Értékelés kötelező!"],
          min: [1, "Minimum értékelés 1!"],
          max: [10, "Maximum értékelés 10!"],
        },
        teachingquality: {
          type: Number,
          required: [true, "Értékelés kötelező!"],
          min: [1, "Minimum értékelés 1!"],
          max: [10, "Maximum értékelés 10!"],
        },
        clarity: {
          type: Number,
          required: [true, "Értékelés kötelező!"],
          min: [1, "Minimum értékelés 1!"],
          max: [10, "Maximum értékelés 10!"],
        },
        review: {
          type: String,
          trim: true,
          maxlength: [200, "Maximális hossz 200 karakter!"],
        },
      },
    ],
    // Add these two lines to your existing schema!
    helpfulCount: { type: Number, default: 0 },
    helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default mongoose.model("Ertekeles", ertekelesSchema);
