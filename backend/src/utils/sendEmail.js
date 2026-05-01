import nodemailer from "nodemailer";

export const sendNoticeEmail = async ({ to, notice }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `New notice: ${notice.title}`,
    text: `${notice.title}\n\n${notice.description}\n\nCategory: ${notice.category}`
  });
};

