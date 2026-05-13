const { Resend } = require('resend');

const sendEmail = async (options) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromName = "Digikhyber";
    
    // IMPORTANT: If domain is not verified in Resend, you MUST use 'onboarding@resend.dev'
    const fromEmail = "onboarding@resend.dev"; 

    console.log(`[EMAIL DEBUG] Using Resend API`);
    console.log(`[EMAIL DEBUG] From: "${fromName}" <${fromEmail}>`);
    console.log(`[EMAIL DEBUG] To: ${options.email}`);
    console.log(`[EMAIL DEBUG] Subject: ${options.subject}`);

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [options.email],
      subject: options.subject,
      html: options.html || options.message,
      text: options.message,
    });

    if (error) {
      console.error("[EMAIL FAILED] Resend Error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to send email via Resend",
      };
    }

    console.log("[EMAIL SUCCESS] Resend Message ID:", data.id);
    return {
      success: true,
      messageId: data.id,
      message: "Email sent successfully via Resend",
    };

  } catch (error) {
    console.error("[EMAIL FAILED] Full Error:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to send email",
    };
  }
};

module.exports = sendEmail;
