import mongoose from 'mongoose';

const oktatoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Oktató neve kötelező!'],
        trim: true,
        maxLength: 60,
        minlength: 2
    },
    age:{
        type: Number,
        required: [true, 'Oktató életkora kötelező!'],
        match: [/^(1[89]|[2-9]\d)$/, 'Kérem, adjon meg egy érvényes életkort (18-99)!']
    },
    email: {
        type: String,
        required: [true, 'Oktató email címe kötelező!'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Kérem, adjon meg egy érvényes email címet!']
    },
    password: {
        type: String,
        required: [true, 'Oktató jelszava kötelező!'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Oktató telefonszáma kötelező!'],
        match: [
            /^(?:\+36|06)(?:1\d{7}|(?:20|21|30|31|50|70)\d{7}|(?:[2-9][2-9]|40|80|90)\d{6})$/,
            'Kérem, adjon meg egy érvényes magyar telefonszámot!'
        ]},
        hobbies: [{
            type: [String],
            required: false,

        }],
    schools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iskola',
        required: [true, 'Oktató iskolája kötelező!']
    },],
    experience: {
        type: Number,
        required: [true, 'Oktató tapasztalata kötelező!'],
        min: [0, 'Tapasztalat nem lehet negatív!'],
        max: [80, 'Kérem, adjon meg egy érvényes tapasztalati értéket (0-80)!']
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategoriak',
        required: [true, 'Oktató kategóriája kötelező!']
    }],

}, { timestamps: true });