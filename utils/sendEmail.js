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
    const port = parseInt(process.env.SMTP_PORT) || 2525;
    const isSecure = port === 465;

    console.log(`[EMAIL DEBUG] Host: ${process.env.SMTP_HOST}`);
    console.log(`[EMAIL DEBUG] Port: ${port}`);
    console.log(`[EMAIL DEBUG] Secure: ${isSecure}`);
    console.log(`[EMAIL DEBUG] Auth User: ${authUser}`);
    console.log(`[EMAIL DEBUG] From: "${fromName}" <${fromEmail}>`);
    console.log(`[EMAIL DEBUG] To: ${options.email}`);
    console.log(`[EMAIL DEBUG] Subject: ${options.subject}`);
    console.log(`[EMAIL DEBUG] Password set: ${authPass ? 'YES' : 'NO'}`);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: isSecure,
      auth: {
        user: authUser,
        pass: authPass,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify SMTP connection before sending
    await transporter.verify();
    console.log("[EMAIL DEBUG] SMTP connection verified successfully!");

    const message = {
      from: `"${fromName}" <${authUser}>`,
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
    if (error.response) {
      console.error("[EMAIL FAILED] SMTP Response:", error.response);
    }
    console.error("[EMAIL FAILED] Full Error:", error);
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      message: "Failed to send email",
    };
  }
};

module.exports = sendEmail;
