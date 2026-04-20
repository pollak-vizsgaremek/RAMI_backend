import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../../../core/models/user.model";
import PasswordResetLog from "../../../core/models/passwordResetLog.model";

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // 1. Grab the token (from the URL) and the new password (from the frontend form)
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Hiányzó token vagy új jelszó!" });
    }

    // 2. Hash the provided token so we can compare it to the hashed version in our database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 3. Find the user with this exact token, ensuring the token hasn't expired yet
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Checks if expiration time is greater than right now
    });

    if (!user) {
      await PasswordResetLog.create({ email: '', event: 'token_invalid', ip: req.ip || '', userAgent: req.get('User-Agent') || '', status: 'invalid' });
      return res
        .status(400)
        .json({ message: "A token érvénytelen vagy lejárt!" });
    }

    // 4. Hash the user's new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Clear the reset token fields so this link can never be used again
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 6. Save the updated user to the database
    await user.save();

    await PasswordResetLog.create({ email: user.email, event: 'password_reset_success', ip: req.ip || '', userAgent: req.get('User-Agent') || '', status: 'success' });

    return res.status(200).json({
      message: "A jelszó sikeresen frissítve! Most már bejelentkezhetsz.",
    });
  } catch (error) {
    console.error("Hiba a jelszó visszaállításakor:", error);
    return res
      .status(500)
      .json({ message: "Szerver hiba a jelszó visszaállításakor." });
  }
};
