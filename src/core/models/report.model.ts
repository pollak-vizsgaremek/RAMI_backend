import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    email: {
      type: String,
      required: false,
      default: "Nem megadva",
    },
    category: {
      type: String,
      required: [true, "Kategória kötelező!"],
      enum: [
        "Technikai hiba",
        "Biztonsági probléma",
        "Felhasználói élmény",
        "Teljesítmény",
        "Funkció kérés",
        "Egyéb",
      ],
    },
    description: {
      type: String,
      required: [true, "Leírás kötelező!"],
      trim: true,
      maxlength: [500, "Maximum 500 karakter!"],
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    resolvedBy: {
      type: String,
      required: false,
    },
    resolution: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Report", reportSchema, "reports");
