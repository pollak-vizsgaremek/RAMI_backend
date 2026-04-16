import nodemailer, { Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Definíció, hogy a vezérlődből érkező objektumot felismerje a TS
interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
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
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Rate My Instructor" <noreply@sajatdomained.hu>',
    to: options.email,
    subject: options.subject,
    text: options.message, // A vezérlődben generált szöveges üzenet
    // Opcionálisan hozzáadhatsz HTML-t is, ha szebbé akarod tenni:
    html: options.message.replace(/\n/g, '<br>'), 
  };

  await transporter.sendMail(mailOptions);
};