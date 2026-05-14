function getTestPassedEmailHtml({
  userName,
  testScore,
  rollNumber,
  challanNumber,
  bannerUrl,
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Congratulations! You Have Passed the Admission Test</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1c1e; margin-top: 20px; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
        <tr>
          <td style="text-align: center; background-color: #ffffff; padding: 10px;">
            <img src="https://digikhyber.vercel.app/images/digikhyber-banner.png" alt="Digikhyber" style="width: 100%; max-width: 500px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px;">
            <h1 style="color: #ffffff; font-size: 28px; margin-bottom: 5px; text-align: center;">💰 Your Challan is Ready!</h1>
            <h2 style="color: #cccccc; font-size: 20px; margin-top: 0; font-weight: normal; text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px;">Processing Fee Payment Details</h2>
            
            <p style="font-size: 18px; color: #ffffff; margin-top: 30px;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #bbbbbb; line-height: 1.6;">
              Congratulations! You have successfully cleared the Digikhyber Admission Test with a score of <strong>${testScore}%</strong>. Your challan has been generated successfully. Please find the details below for the payment of your processing fee to claim your Scholarship Card.
            </p>

            <div style="background-color: #25282c; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #444;">
              <h3 style="color: #ffffff; margin-top: 0; font-size: 18px; border-bottom: 1px solid #444; padding-bottom: 10px;">Challan Details:</h3>
              <table width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td style="color: #aaaaaa; font-size: 15px;">Roll Number:</td>
                  <td style="color: #3498db; font-size: 15px; font-weight: bold; text-align: right;">${rollNumber}</td>
                </tr>
                <tr>
                  <td style="color: #aaaaaa; font-size: 15px;">Challan Number:</td>
                  <td style="color: #2ecc71; font-size: 15px; font-weight: bold; text-align: right;">${challanNumber}</td>
                </tr>
                <tr>
                  <td style="color: #aaaaaa; font-size: 15px;">Amount:</td>
                  <td style="color: #2ecc71; font-size: 15px; font-weight: bold; text-align: right;">PKR 3250</td>
                </tr>
                <tr>
                  <td style="color: #aaaaaa; font-size: 15px;">Payment Type:</td>
                  <td style="color: #ffffff; font-size: 15px; text-align: right;">Processing Fee</td>
                </tr>
                <tr>
                  <td style="color: #aaaaaa; font-size: 15px;">Status:</td>
                  <td style="color: #e74c3c; font-size: 15px; font-weight: bold; text-align: right;">Pending Payment</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #1e2a24; border: 1px solid #2d5a43; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #2ecc71; margin-top: 0; font-size: 18px;">📋 Payment Instructions:</h3>
              <ul style="font-size: 15px; color: #cccccc; padding-left: 20px; line-height: 1.8;">
                <li>Login to your dashboard to download the PDF Challan.</li>
                <li>Visit any branch of the designated bank or use Online Apps.</li>
                <li>Pay the exact amount of <strong>PKR 3250</strong>.</li>
                <li>Your Scholarship Card will be issued automatically after payment confirmation.</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://digikhyber.org.pk/login" style="background-color: #079560; color: #ffffff; padding: 15px 35px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                Login to Dashboard
              </a>
            </div>

            <p style="font-size: 14px; color: #777777; text-align: center; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
              Thank you for choosing Digikhyber!<br />
              <strong>Team Digikhyber</strong>
            </p>
          </td>
        </tr>
      </table>
      <div style="text-align: center; padding: 20px; color: #555555; font-size: 12px;">
        © 2026 Digikhyber. All rights reserved.
      </div>
    </body>
    </html>
    `;
}

module.exports = getTestPassedEmailHtml;
