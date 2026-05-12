const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Hostinger requires From address to match Auth user exactly
    const authUser = process.env.FROM_EMAIL || "noreply@hunarmandpunjab.com";
    const authPass = process.env.SMTP_PASSWORD;
    
    let fromName = "Digikhyber";
    if (options.emailType === "admissions") {
      fromName = "Digikhyber Admissions";
    } else if (options.emailType === "contact") {
      fromName = "Digikhyber Support";
    }

    const fromEmail = authUser; // Force match

    console.log(`[EMAIL DEBUG] Host: ${process.env.SMTP_HOST}`);
    console.log(`[EMAIL DEBUG] Port: ${process.env.SMTP_PORT}`);
    console.log(`[EMAIL DEBUG] Auth User: ${authUser}`);
    console.log(`[EMAIL DEBUG] From: ${fromEmail}`);
    console.log(`[EMAIL DEBUG] To: ${options.email}`);
    console.log(`[EMAIL DEBUG] Password set: ${authPass ? 'YES' : 'NO'}`);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, // Always true for port 465 (SSL)
      auth: {
        user: authUser,
        pass: authPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify SMTP connection before sending
    await transporter.verify();
    console.log("[EMAIL DEBUG] SMTP connection verified successfully!");

    const message = {
      from: authUser,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(message);
    console.log("[EMAIL SUCCESS] MessageID:", info.messageId);
    console.log("[EMAIL SUCCESS] Accepted by:", info.accepted);

    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };

  } catch (error) {
    console.error("[EMAIL FAILED] Error code:", error.code);
    console.error("[EMAIL FAILED] Error message:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to send email",
    };
  }
};

module.exports = sendEmail;
