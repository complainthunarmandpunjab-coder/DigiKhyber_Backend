const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Challan = require("../models/Challan");

const generatePDF = async (userData, amount, userCourses) => {
  try {
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique challan number
    let challanNumber, existingChallan;
    let attempts = 0;
    do {
      const shortTime = Date.now().toString().slice(-5);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      challanNumber = shortTime + random;
      existingChallan = await Challan.findOne({ challanId: challanNumber });
      attempts++;
    } while (existingChallan && attempts < 10);

    const fileName = `challan-${challanNumber}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    const issueDate = new Date().toLocaleDateString("en-US");
    const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US");

    let courses = [];
    if (Array.isArray(userCourses) && userCourses.length > 0) {
      courses = userCourses.filter(Boolean);
    }
    if (courses.length === 0) courses = ["-"];

    const note = "All courses of Digikhyber are totally free of cost. Only processing charges will be paid by student and will be reimbursed after completion of final evaluation test according to the policy of Digikhyber.\n\nChallan payments can be made at any Bank of Punjab branch using the Cash Management Solution.";

    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 0 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const copies = [
        { x: 20,  label: "Bank Copy" },
        { x: 215, label: "Office Copy" },
        { x: 410, label: "Student Copy" },
      ];

      const colW = 190;
      const startY = 30;

      copies.forEach(({ x, label }) => {
        // Border
        doc.rect(x, startY, colW, 760).stroke();

        // Header row
        doc.fontSize(7).font("Helvetica-Bold")
          .text("DIGIKHYBER", x + 5, startY + 5, { width: colW - 10, align: "center" });
        doc.fontSize(6).font("Helvetica")
          .text(label, x + 5, startY + 16, { width: colW - 10, align: "center" });
        doc.fontSize(6).font("Helvetica")
          .text("www.digikhyber.pk", x + 5, startY + 25, { width: colW - 10, align: "center" });

        // Challan No box
        doc.rect(x + 5, startY + 34, colW - 10, 14).stroke();
        doc.fontSize(6).font("Helvetica-Bold")
          .text(`Challan No: ${challanNumber}`, x + 8, startY + 38);

        // Horizontal line
        doc.moveTo(x, startY + 50).lineTo(x + colW, startY + 50).stroke();

        // User details
        const detailY = startY + 54;
        const fields = [
          { label: "Name:", value: userData.fullName || "-" },
          { label: "Father Name:", value: userData.fatherName || "-" },
          { label: "Phone Number:", value: userData.mobile || "-" },
          { label: "Email:", value: userData.email || "-" },
        ];

        fields.forEach((f, i) => {
          const y = detailY + i * 16;
          doc.fontSize(6).font("Helvetica-Bold").text(f.label, x + 5, y);
          doc.fontSize(6).font("Helvetica").text(f.value, x + 55, y, { width: colW - 60, ellipsis: true });
          doc.moveTo(x + 55, y + 9).lineTo(x + colW - 5, y + 9).stroke();
        });

        // Dates
        const dateY = detailY + fields.length * 16 + 4;
        doc.fontSize(6).font("Helvetica-Bold").text("Issue Date:", x + 5, dateY);
        doc.fontSize(6).font("Helvetica").text(issueDate, x + 40, dateY);
        doc.fontSize(6).font("Helvetica-Bold").text("Due Date:", x + 100, dateY);
        doc.fontSize(6).font("Helvetica").text(dueDate, x + 130, dateY);

        // Fee Voucher header
        const tableY = dateY + 18;
        doc.rect(x + 5, tableY, colW - 10, 14).fillAndStroke("#0B5D3B", "#0B5D3B");
        doc.fontSize(7).font("Helvetica-Bold").fillColor("white")
          .text("Fee Voucher", x + 5, tableY + 3, { width: colW - 10, align: "center" });
        doc.fillColor("black");

        // Table headers
        const thY = tableY + 16;
        doc.rect(x + 5, thY, 20, 12).stroke();
        doc.rect(x + 25, thY, 115, 12).stroke();
        doc.rect(x + 140, thY, colW - 145, 12).stroke();
        doc.fontSize(5.5).font("Helvetica-Bold")
          .text("Sr.No", x + 6, thY + 3)
          .text("Course", x + 26, thY + 3)
          .text("Amount", x + 141, thY + 3);

        // Course rows
        let rowY = thY + 12;
        courses.forEach((course, idx) => {
          doc.rect(x + 5, rowY, 20, 11).stroke();
          doc.rect(x + 25, rowY, 115, 11).stroke();
          doc.rect(x + 140, rowY, colW - 145, 11).stroke();
          doc.fontSize(5).font("Helvetica")
            .text((idx + 1).toString(), x + 8, rowY + 3)
            .text(course.length > 28 ? course.substring(0, 28) + "..." : course, x + 27, rowY + 3)
            .text("0", x + 145, rowY + 3);
          rowY += 11;
        });

        // Processing fee row
        doc.rect(x + 5, rowY, 20, 11).stroke();
        doc.rect(x + 25, rowY, 115, 11).stroke();
        doc.rect(x + 140, rowY, colW - 145, 11).stroke();
        doc.fontSize(5).font("Helvetica-Bold")
          .text("Total", x + 8, rowY + 3)
          .text("Processing Fee", x + 27, rowY + 3)
          .text(amount.toString(), x + 141, rowY + 3);
        rowY += 11;

        // Total
        doc.fontSize(8).font("Helvetica-Bold")
          .text(`Total:  Rs. ${amount}`, x + 5, rowY + 6, { width: colW - 10, align: "right" });

        // Note
        const noteY = rowY + 24;
        doc.fontSize(5).font("Helvetica-Bold").text("Note:", x + 5, noteY);
        doc.fontSize(4.5).font("Helvetica")
          .text(note, x + 5, noteY + 8, { width: colW - 10, align: "left" });
      });

      doc.end();
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("✅ Digikhyber challan PDF saved:", filePath);
    return { filePath, fileName, challanNumber };

  } catch (error) {
    console.error("❌ PDF generation error:", error);
    return { challanNumber: "ERROR", error: error.message };
  }
};

module.exports = generatePDF;
