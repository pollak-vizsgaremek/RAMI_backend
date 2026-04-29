import { Request, Response } from "express";
import crypto from "crypto";
import User from "../../../core/models/user.model";
import Instructor from "../../../core/models/instructor.model";
import PasswordResetLog from "../../../core/models/passwordResetLog.model";
import { sendEmail } from "../../../core/services/sendEmail.service";
import * as dotenv from "dotenv";

dotenv.config();


export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    const ip = (req.ip || req.headers['x-forwarded-for'] || '').toString();
    const userAgent = (req.get('User-Agent') || '').toString();

    // Rate limit / per-email throttling using logs in DB
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10); // default 1 hour
    const maxPerEmail = parseInt(process.env.RATE_LIMIT_MAX_EMAIL || '5', 10);

    const since = new Date(Date.now() - windowMs);
    const recentCount = await PasswordResetLog.countDocuments({
      email,
      event: 'forgot_request',
      createdAt: { $gte: since },
    });

    if (recentCount >= maxPerEmail) {
      await PasswordResetLog.create({ email, event: 'forgot_throttled', ip, userAgent, status: 'throttled' });
      return res.status(429).json({ message: 'Too many password reset requests. Please try again later.' });
    }

    await PasswordResetLog.create({ email, event: 'forgot_request', ip, userAgent, status: 'received' });

    // Search both User and Instructor collections
    let account: any = await User.findOne({ email });
    let isInstructor = false;
    if (!account) {
      account = await Instructor.findOne({ email });
      isInstructor = true;
    }

    if (!account) {
      // Do not reveal whether the user exists. We've already logged the request.
      return res
        .status(200)
        .json({ message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    account.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expireMinutes = parseInt(process.env.RESET_TOKEN_EXPIRE_MINUTES || "60", 10);
    account.passwordResetExpires = new Date(Date.now() + expireMinutes * 60 * 1000);
    await account.save();

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl.replace(/\/$/, "")}/reset-password?token=${resetToken}`;

    const htmlMessage = `
      <p>Kértél egy jelszó visszaállítást. Kattints a lenti gombra az új jelszó megadásához.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#1f6feb;color:#fff;border-radius:6px;text-decoration:none;">Jelszó visszaállítása</a></p>
      <p>Ha a gomb nem működik, használd ezt a linket:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>A link ${expireMinutes} percig érvényes.</p>
    `;

    const textMessage = `Kértél egy jelszó visszaállítást. Nyisd meg az alábbi linket a jelszó visszaállításához:\n\n${resetUrl}\n\nA link ${expireMinutes} percig érvényes.`;

    try {
      await sendEmail({
        email: account.email,
        subject: "Jelszó visszaállítás",
        text: textMessage,
        html: htmlMessage,
      });
      await PasswordResetLog.create({ email: account.email, event: 'email_sent', ip, userAgent, status: 'success' });
      return res.status(200).json({ message: "E-mail elküldve!" });
    } catch (emailError) {
      account.passwordResetToken = undefined;
      account.passwordResetExpires = undefined;
      await account.save();
      await PasswordResetLog.create({ email: account.email, event: 'email_failed', ip, userAgent, status: 'failed', note: String(emailError) });
      return res.status(500).json({ message: "Hiba az e-mail küldésekor." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Szerver hiba." });
  }
};
