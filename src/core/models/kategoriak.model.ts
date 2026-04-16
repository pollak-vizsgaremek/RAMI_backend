import mongoose from "mongoose";

const kategoriakSchema = new mongoose.Schema({
    name: {
         type: String,
         required: [true, 'Kategória neve kötelező!'],
         trim: true,
         maxLength: 3,
         minlength: 1
        },
})