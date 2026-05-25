const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Challan = require("../models/Challan");

const LOGO_PATH = path.join(__dirname, "../images/logo.png");
const BOP_LOGO_PATH = path.join(__dirname, "../images/bop-logo.png");

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

    const now = new Date();
    const due = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fmt = (d) => {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = d.getFullYear();
      return `${dd} / ${mm} / ${yy}`;
    };
    const issueDate = fmt(now);
    const dueDate = fmt(due);

    let courses = (Array.isArray(userCourses) ? userCourses : []).filter(Boolean);
    if (courses.length === 0) courses = ["General IT Program"];

    await new Promise((resolve, reject) => {
      // A4 Landscape
      const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Page dimensions: 841.89 x 595.28
      const pageW = 841.89;
      const pageH = 595.28;
      const margin = 6;
      const gap = 4;
      const colW = (pageW - margin * 2 - gap * 2) / 3; // ~274
      const colH = pageH - margin * 2;

      const copies = [
        { x: margin,                       label: "BANK COPY",    barColor: "#2d6a2d",  barBg: "#2d6a2d"  },
        { x: margin + colW + gap,          label: "OFFICE COPY",  barColor: "#1a3565",  barBg: "#1a3565"  },
        { x: margin + (colW + gap) * 2,    label: "STUDENT COPY", barColor: "#1a6b6b",  barBg: "#1a6b6b"  },
      ];

      copies.forEach(({ x, label, barColor }) => {
        let y = margin;

        // ── Outer border ──
        doc.rect(x, y, colW, colH).lineWidth(0.6).stroke("#aaaaaa");

        // ── Challan No box (top right) ──
        const challanBoxW = 110;
        const challanBoxH = 16;
        doc.rect(x + colW - challanBoxW - 4, y + 3, challanBoxW, challanBoxH)
          .lineWidth(0.5).stroke("#888888");
        doc.fontSize(6).font("Helvetica-Bold").fillColor("#333333")
          .text("Challan No:", x + colW - challanBoxW, y + 7, { width: 35, align: "left" });
        doc.fontSize(6.5).font("Helvetica-Bold").fillColor("#0B5D3B")
          .text(challanNumber, x + colW - challanBoxW + 36, y + 7, { width: 70, align: "left" });

        y += 22;

        // ── Logo row ──
        const logoH = 38;
        // DigiKhyber logo (left)
        if (fs.existsSync(LOGO_PATH)) {
          doc.image(LOGO_PATH, x + 6, y, { height: logoH, fit: [50, logoH] });
        }
        // Title (center)
        doc.fontSize(10).font("Helvetica-Bold").fillColor("#0B5D3B")
          .text("DIGIKHYBER", x + 58, y + 4, { width: colW - 116, align: "center" });
        doc.fontSize(6.5).font("Helvetica").fillColor("#444444")
          .text("TRAINING PROGRAM", x + 58, y + 17, { width: colW - 116, align: "center" });
        // Bank of Punjab logo (right)
        if (fs.existsSync(BOP_LOGO_PATH)) {
          doc.image(BOP_LOGO_PATH, x + colW - 52, y, { height: logoH, fit: [44, logoH] });
        } else {
          // Placeholder if BOP logo not found
          doc.rect(x + colW - 52, y + 2, 44, 32).lineWidth(0.5).stroke("#888888");
          doc.fontSize(5).font("Helvetica-Bold").fillColor("#1a3565")
            .text("BANK OF", x + colW - 52, y + 8, { width: 44, align: "center" });
          doc.fontSize(5).font("Helvetica-Bold").fillColor("#1a3565")
            .text("PUNJAB", x + colW - 52, y + 16, { width: 44, align: "center" });
        }

        y += logoH + 4;

        // ── Tagline ──
        doc.moveTo(x + 8, y).lineTo(x + colW / 2 - 40, y).lineWidth(0.4).stroke("#aaaaaa");
        doc.moveTo(x + colW / 2 + 40, y).lineTo(x + colW - 8, y).lineWidth(0.4).stroke("#aaaaaa");
        doc.fontSize(5.5).font("Helvetica").fillColor("#777777")
          .text("EMPOWERING SKILLS, BUILDING FUTURES", x + 4, y - 3, { width: colW - 8, align: "center" });

        y += 10;

        // ── Copy label bar ──
        doc.rect(x + 4, y, colW - 8, 18).fillColor(barColor).fill();
        doc.fontSize(8).font("Helvetica-Bold").fillColor("#ffffff")
          .text(label, x + 4, y + 4, { width: colW - 8, align: "center" });
        // Copy icon
        doc.fillColor("#ffffff").fontSize(10);

        y += 24;

        // ── User details (no colons) ──
        const fields = [
          { label: "Name",         value: userData.fullName  || "-" },
          { label: "Father Name",  value: userData.fatherName || "-" },
          { label: "Phone Number", value: userData.mobile    || "-" },
          { label: "Email",        value: userData.email     || "-" },
        ];

        fields.forEach((f, i) => {
          const fy = y + i * 16;
          doc.fontSize(6).font("Helvetica-Bold").fillColor("#333333")
            .text(f.label, x + 6, fy + 2, { width: 55 });
          doc.moveTo(x + 62, fy + 8).lineTo(x + colW - 6, fy + 8).lineWidth(0.3).stroke("#cccccc");
          doc.fontSize(6).font("Helvetica").fillColor("#111111")
            .text(f.value, x + 64, fy + 2, { width: colW - 72, ellipsis: true });
        });

        y += fields.length * 16 + 6;

        // ── Date row ──
        doc.rect(x + 4, y, colW - 8, 18).lineWidth(0.4).stroke("#dddddd");
        doc.fontSize(5.5).font("Helvetica-Bold").fillColor("#333333")
          .text("Issue Date", x + 8, y + 2);
        doc.fontSize(6).font("Helvetica").fillColor("#0B5D3B")
          .text(issueDate, x + 8, y + 9);
        doc.moveTo(x + colW / 2, y + 2).lineTo(x + colW / 2, y + 16).lineWidth(0.3).stroke("#dddddd");
        doc.fontSize(5.5).font("Helvetica-Bold").fillColor("#333333")
          .text("Due Date", x + colW / 2 + 4, y + 2);
        doc.fontSize(6).font("Helvetica").fillColor("#c0392b")
          .text(dueDate, x + colW / 2 + 4, y + 9);

        y += 24;

        // ── Fee table ──
        // Header bar
        doc.rect(x + 4, y, colW - 8, 16).fillColor("#0B5D3B").fill();
        const srW = 22, amtW = 48, courseW = colW - 8 - srW - amtW;
        doc.fontSize(6).font("Helvetica-Bold").fillColor("#ffffff")
          .text("Sr. No", x + 6, y + 4, { width: srW, align: "center" })
          .text("Course / Program", x + 6 + srW, y + 4, { width: courseW, align: "center" })
          .text("Amount (PKR)", x + 6 + srW + courseW, y + 4, { width: amtW, align: "center" });

        y += 16;

        // Draw 5 course rows
        const maxRows = 5;
        for (let r = 0; r < maxRows; r++) {
          const rowBg = r % 2 === 0 ? "#f9f9f9" : "#ffffff";
          doc.rect(x + 4, y, colW - 8, 13).fillColor(rowBg).fill();
          doc.rect(x + 4, y, colW - 8, 13).lineWidth(0.3).stroke("#dddddd");
          // vertical dividers
          doc.moveTo(x + 4 + srW, y).lineTo(x + 4 + srW, y + 13).stroke("#dddddd");
          doc.moveTo(x + 4 + srW + courseW, y).lineTo(x + 4 + srW + courseW, y + 13).stroke("#dddddd");

          const course = courses[r];
          doc.fontSize(5.5).font("Helvetica").fillColor("#333333")
            .text(String(r + 1), x + 6, y + 3, { width: srW, align: "center" });
          if (course) {
            const courseText = course.length > 32 ? course.substring(0, 32) + "…" : course;
            doc.fontSize(5.5).font("Helvetica").fillColor("#222222")
              .text(courseText, x + 8 + srW, y + 3, { width: courseW - 4 });
            doc.fontSize(5.5).font("Helvetica").fillColor("#0B5D3B")
              .text("Free", x + 6 + srW + courseW, y + 3, { width: amtW, align: "center" });
          }
          y += 13;
        }

        // Total row
        doc.rect(x + 4, y, colW - 8, 14).fillColor("#eaf4ee").fill();
        doc.rect(x + 4, y, colW - 8, 14).lineWidth(0.3).stroke("#0B5D3B");
        doc.fontSize(6.5).font("Helvetica-Bold").fillColor("#333333")
          .text("TOTAL", x + 8, y + 3, { width: colW - 8 - amtW - 12, align: "right" });
        doc.fontSize(6.5).font("Helvetica-Bold").fillColor("#0B5D3B")
          .text(`PKR ${amount.toLocaleString()}`, x + 4 + srW + courseW, y + 3, { width: amtW, align: "center" });

        y += 20;

        // ── Note ──
        doc.rect(x + 4, y, colW - 8, 12).fillColor(barColor).fill();
        doc.fontSize(6).font("Helvetica-Bold").fillColor("#ffffff")
          .text("Note:", x + 8, y + 2);

        y += 14;

        const notes = [
          "All courses under Digikhyber scholarship are 100% free of cost.",
          "Processing fee will be reimbursed upon achieving above 85% in final evaluation.",
          "Challan is valid only for the due date mentioned above.",
          "Please deposit the fee at any Bank of Punjab (BOP) branch.",
          "Keep this receipt safe for future reference.",
        ];
        notes.forEach((n) => {
          doc.fontSize(5).font("Helvetica").fillColor("#333333")
            .text(`• ${n}`, x + 6, y, { width: colW - 12 });
          y += 9;
        });

        y += 6;

        // ── Footer ──
        doc.moveTo(x + 4, y).lineTo(x + colW - 4, y).lineWidth(0.4).stroke("#cccccc");
        y += 5;
        doc.fontSize(5.5).font("Helvetica").fillColor("#0B5D3B")
          .text("🌐  www.digikhyber.pk", x + 6, y);
        doc.fontSize(5.5).font("Helvetica").fillColor("#0B5D3B")
          .text("📞  091-111-344-777", x + colW / 2, y);
        y += 12;
        doc.rect(x + 4, y, colW - 8, 14).fillColor("#f0f7f2").fill();
        doc.fontSize(5.5).font("Helvetica").fillColor("#333333")
          .text("Thank you for being a part of ", x + 6, y + 3, { continued: true })
          .font("Helvetica-Bold").fillColor("#0B5D3B")
          .text("Digikhyber Training Program.", { width: colW - 12 });
      });

      doc.end();
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("✅ Challan PDF saved:", filePath);
    return { filePath, fileName, challanNumber };

  } catch (error) {
    console.error("❌ PDF generation error:", error);
    return { challanNumber: "ERROR", error: error.message };
  }
};

module.exports = generatePDF;
