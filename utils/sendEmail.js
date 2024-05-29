import nodeMailer from "nodemailer";
export const sendEmail = async (email, subject, content) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      requireTLS: true,
      secure: false,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: content,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};
