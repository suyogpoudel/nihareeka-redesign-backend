import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const sendContactEmail = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "No request body received" });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.GOOGLE_EMAIL_HOST,
      port: Number(process.env.GOOGLE_EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.GOOGLE_EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    console.table({
      host: process.env.GOOGLE_EMAIL_HOST,
      port: process.env.GOOGLE_EMAIL_PORT,
      user: process.env.GOOGLE_EMAIL_USER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    });

    const mailOptions = {
      from: `"Nihareeka Website" <${process.env.GOOGLE_EMAIL_USER}>`,
      to: process.env.GOOGLE_EMAIL_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `[Contact Form] ${subject}`,
      text: `New contact form submission\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #1a73e8; text-align: center;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">${message}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">This message was sent via your website contact form.</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to send message. Please try again later.",
    });
  }
};
