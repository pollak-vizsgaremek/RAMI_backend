import mongoose from "mongoose";

const iskolaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Iskola neve kötelező!'],
    trim: true,
    maxLength: 100,
    minlength: 2
  },
  address: {
    type: String,
    required: [true, 'Iskola címe kötelező!'],
    trim: true,
    maxLength: 200,
    minlength: 5
  },
  zipCode: {
    type: String,
    required: [true, 'Irányítószám kötelező!'],
    match: [/^\d{4}$/, 'Kérem, adjon meg egy érvényes 4 számjegyű irányítószámot!']
  },
  
  elerhetosegek: [
    {
      phoneNumber: {
         type: String,
         required: false,
         match: [
         /^(?:\+36|06)(?:1\d{7}|(?:20|21|30|31|50|70)\d{7}|(?:[2-9][2-9]|40|80|90)\d{6})$/,
         'Kérem, adjon meg egy érvényes magyar telefonszámot!']
    },
      email: {
        type: String,
        trim: true,
        required: false,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Kérem, adjon meg egy érvényes email címet!']
      },
      
    }
  ],
    weboldal: {
        type: String,
        trim: true,
        required: false,
        lowercase: true,
        maxLength: 100,
        minlength: 6,
        match: [
            /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/,
            'Kérem, adjon meg egy érvényes weboldal URL-t!'
        ]
 },
    kepzesek: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kepzes',
        required: [true, 'Iskola képzései kötelező!']
    },
    instructors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Oktato',
            required: [true, 'Legalább egy oktató megadása kötelező!'],
            index: true
        }
    ]
}, { timestamps: true });

const Iskola = mongoose.model('Iskola', iskolaSchema);

export default Iskola;

