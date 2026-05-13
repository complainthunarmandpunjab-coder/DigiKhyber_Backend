const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const authUser = process.env.SMTP_USER || process.env.FROM_EMAIL;
    const authPass = process.env.SMTP_PASSWORD;
    const fromName = "Digikhyber";
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: authUser,
        pass: authPass,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    console.log(`[EMAIL DEBUG] Using Nodemailer (Render Compatible)`);
    console.log(`[EMAIL DEBUG] From: "${fromName}" <${authUser}>`);
    console.log(`[EMAIL DEBUG] To: ${options.email}`);

    const mailOptions = {
      from: `"${fromName}" <${authUser}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[EMAIL SUCCESS] Message ID:", info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("[EMAIL FAILED] Error:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to send email",
    };
  }
};

module.exports = sendEmail;
