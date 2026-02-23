import mongoose from "mongoose";
import { time } from "node:console";

const jogosultsagokSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Jogosultság neve kötelező!'],
        trim: true,
        maxLength: 50,
        minlength: 2
    },
    description: {
        type: String,
        required: [true, 'Jogosultság leírása kötelező!'],
        trim: true,
        maxLength: 300,
    }
    

}, { timestamps: true });

export default mongoose.model("Jogosultsagok", jogosultsagokSchema);