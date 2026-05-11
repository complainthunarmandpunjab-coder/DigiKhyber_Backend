function getAdmissionNotificationEmailHtml({
  userName,
  rollNumber,
  email,
  mobile,
  cnic,
  admissionType,
  courses,
  submissionTime,
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>New Admission Application</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; margin-top: 20px;">
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #079560;">New Admission Application Received!</h2>
            <p style="font-size: 16px; color: #333;">A new application has been submitted through the portal.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #555;">Candidate Details:</h3>
              <p><strong>Name:</strong> ${userName}</p>
              <p><strong>Roll Number:</strong> ${rollNumber}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Mobile:</strong> ${mobile}</p>
              <p><strong>CNIC:</strong> ${cnic}</p>
              <p><strong>Type:</strong> ${admissionType}</p>
              <p><strong>Courses:</strong> ${courses.join(', ')}</p>
              <p><strong>Time:</strong> ${submissionTime}</p>
            </div>
            
            <p style="font-size: 14px; color: #777;">This is an automated notification from Digikhyber Portal.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = getAdmissionNotificationEmailHtml;
