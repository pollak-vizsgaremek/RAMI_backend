import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username is requried!'],
    trim: true,
    maxLength: 60,
    minlength:2
  },
  email: {
    type: String,
    required: [true, "User Email is requried"],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'User Password is required!'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    match: [
      /^(?:\+36|06)(?:1\d{7}|(?:20|21|30|31|50|70)\d{7}|(?:[2-9][2-9]|40|80|90)\d{6})$/,
      'Please use a valid Hungarian phone number.'
    ],
    default: null,
  },

  role: {
    required: false,
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user',
  },

}, { timestamps: true });

const User =mongoose.models.User || mongoose.model('User', userSchema);   

export default User;