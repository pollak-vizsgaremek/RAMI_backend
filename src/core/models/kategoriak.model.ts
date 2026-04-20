import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
         type: String,
         required: [true, 'Kategória neve kötelező!'],
         trim: true,
         maxLength: 100,
         minlength: 1
        },
})

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema, 'categories');

export default Category;