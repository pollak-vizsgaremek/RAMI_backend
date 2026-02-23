import mongoose from "mongoose";

const ertekelesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Felhasználó ID kötelező!"]
    },
    oktato: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Oktato",
        required: [true, "Oktató ID kötelező!"]
    },
   
    ertekeles: {
        type: Number,
        required: [true, "Értékelés kötelező!"],
        min: [1, "Minimum értékelés 1!"],
        max: [5, "Maximum értékelés 5!"]
    },
    megjegyzes: {
        type: String,
        trim: true,
        maxlength: [500, "Maximális hossz 500 karakter!"]
    }
}, { timestamps: true });

export default mongoose.model("Ertekeles", ertekelesSchema);
