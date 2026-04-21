import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    code:{
        type: String,
        required: [true, 'Kategória kódja kötelező!'],
        trim: true,
        uppercase: true,
        maxLength: 3,
        minlength: 1,
        unique: true
    },
    name: {
         type: String,
         required: [true, 'Kategória neve kötelező!'],
         trim: true,
         maxLength:50,
         minlength: 1
        },
})

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema, 'categories');

export default Category;