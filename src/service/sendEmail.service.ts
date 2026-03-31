import nodemailer from "nodemailer";

// 1. Define the shape of your options object
interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

// 2. Apply the EmailOptions type to the parameter
const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: Number(process.env.EMAIL_PORT) || 587, // Wrapped in Number() for TS
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Your App Name" <noreply@yourapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
