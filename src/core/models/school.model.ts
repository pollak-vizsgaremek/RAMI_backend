import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Iskola neve kötelező!"],
      trim: true,
      maxLength: 100,
      minlength: 2,
    },
    address: {
      type: String,
      required: [true, "Iskola címe kötelező!"],
      trim: true,
      maxLength: 200,
      minlength: 5,
    },
    zipCode: {
      type: String,
      required: [true, "Irányítószám kötelező!"],
      match: [
        /^\d{4}$/,
        "Kérem, adjon meg egy érvényes 4 számjegyű irányítószámot!",
      ],
    },

    elerhetosegek: [
      {
        phoneNumber: {
          type: String,
          required: false,
          match: [
            /^(?:\+36|06)(?:1\d{7}|(?:20|21|30|31|50|70)\d{7}|(?:[2-9][2-9]|40|80|90)\d{6})$/,
            "Kérem, adjon meg egy érvényes magyar telefonszámot!",
          ],
        },
        email: {
          type: String,
          trim: true,
          required: false,
          lowercase: true,
          match: [
            /^\S+@\S+\.\S+$/,
            "Kérem, adjon meg egy érvényes email címet!",
          ],
        },
      },
    ],
    webpage: {
      type: String,
      trim: true,
      required: false,
      lowercase: true,
      maxLength: 100,
      minlength: 0,
      match: [
        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/,
        "Kérem, adjon meg egy érvényes weboldal URL-t!",
      ],
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Iskola képzései kötelező!"],
      },
    ],
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
        required: false,
        index: true,
      },
    ],
  },
  { timestamps: true },
);

const School = mongoose.model("Iskola", schoolSchema, "schools");

export default School;
