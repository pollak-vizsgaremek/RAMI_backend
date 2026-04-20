import mongoose from 'mongoose';

const instructorRequestSchema = new mongoose.Schema(
  {
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    event: { type: String, enum: ['nominated', 'accepted', 'rejected'], required: true },
    ip: { type: String },
    userAgent: { type: String },
    note: { type: String },
  },
  { timestamps: true },
);

const InstructorRequest = mongoose.models.InstructorRequest || mongoose.model('InstructorRequest', instructorRequestSchema);

export default InstructorRequest;
