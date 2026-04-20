import mongoose from 'mongoose';

const passwordResetLogSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    event: {
      type: String,
      required: true,
      enum: ['forgot_request', 'forgot_throttled', 'email_sent', 'email_failed', 'token_invalid', 'password_reset_success'],
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
    },
    note: {
      type: String,
    },
    tokenHash: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

const PasswordResetLog = mongoose.models.PasswordResetLog || mongoose.model('PasswordResetLog', passwordResetLogSchema);

export default PasswordResetLog;
