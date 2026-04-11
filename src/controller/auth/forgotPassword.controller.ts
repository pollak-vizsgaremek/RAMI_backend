import { Request, Response } from "express";
import crypto from "crypto";
import User from "../../models/user.model";
import {sendEmail} from "../../service/sendEmail.service";


export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "If an account exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    const message = `Kértél egy jelszó visszaállítást. Kattints az alábbi linkre az új jelszó megadásához:\n\n${resetUrl}\n\nA link 10 percig érvényes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Jelszó visszaállítás",
        message: message,
      });
      return res.status(200).json({ message: "E-mail elküldve!" });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Hiba az e-mail küldésekor." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Szerver hiba." });
  }
};
