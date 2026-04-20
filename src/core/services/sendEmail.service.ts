import nodemailer, { Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Definíció, hogy a vezérlődből érkező objektumot felismerje a TS
interface SendEmailOptions {
  email: string;
  subject: string;
  // Backwards-compatible: `message` is accepted as plain text
  message?: string;
  // Prefer explicit `text` and `html` when available
  text?: string;
  html?: string;
}

const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  secure: true,
  port: 465,
  auth: {
    user: 'resend', // Ez marad fixen 'resend'
    pass: process.env.RESEND_API_KEY, // A Resend-től kapott API kulcsod
  },
});

/**
 * A vezérlődben használt sendEmail függvény implementációja
 */
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  // Prefer explicit `text` and `html`. Fall back to `message` for compatibility.
  const htmlBody = options.html || (options.message ? options.message.replace(/\n/g, '<br>') : undefined);
  const textBody = options.text || options.message || (htmlBody ? htmlBody.replace(/<[^>]*>/g, '') : undefined);

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Rate My Instructor" <noreply@sajatdomained.hu>',
    to: options.email,
    subject: options.subject,
    text: textBody,
    html: htmlBody,
  };

  await transporter.sendMail(mailOptions);
};