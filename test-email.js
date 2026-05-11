require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('=== EMAIL TEST STARTING ===');
  console.log('SMTP Host:', process.env.SMTP_HOST);
  console.log('SMTP Port:', process.env.SMTP_PORT);
  console.log('From Email:', process.env.FROM_EMAIL);
  console.log('Admin Email:', process.env.ADMIN_EMAIL);
  console.log('Password Length:', process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.length : 'NOT SET');
  console.log('');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection VERIFIED! Sending test email...');

    const info = await transporter.sendMail({
      from: `"Digikhyber Test" <${process.env.FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Digikhyber - Email Test',
      html: '<h1>Email is working!</h1><p>This is a test email from Digikhyber portal.</p>',
    });

    console.log('✅ EMAIL SENT! MessageID:', info.messageId);
    console.log('Accepted by:', info.accepted);
  } catch (error) {
    console.error('❌ ERROR CODE:', error.code);
    console.error('❌ ERROR MESSAGE:', error.message);
    if (error.response) {
      console.error('❌ SMTP RESPONSE:', error.response);
    }
  }
}

testEmail();
