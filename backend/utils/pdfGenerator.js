const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = (invoiceData, filePath, returnBuffer = false) => {
  const watermarkPath = "./public/logo.PNG";
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      let stream;

      if (returnBuffer) {
        stream = new (require('stream').PassThrough)();
      } else {
        stream = fs.createWriteStream(filePath);
      }
      doc.pipe(stream);

      // ==============================
      // Optional Watermark / Logo
      // ==============================
      if (watermarkPath) {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
        const logoWidth = 450; // Adjust for size
        const centerX = (pageWidth - logoWidth) / 2;
        const centerY = (pageHeight - logoWidth) / 2;

        // Draw watermark on first page
        doc.opacity(0.1); // lighter and more professional
        doc.image(watermarkPath, centerX, centerY, { width: logoWidth });
        doc.opacity(1);

        // Automatically add watermark when new pages are added
        doc.on("pageAdded", () => {
          const pw = doc.page.width;
          const ph = doc.page.height;
          const w = 450; // same width as above
          const cx = (pw - w) / 2;
          const cy = (ph - w) / 2;
          doc.opacity(0.07);
          doc.image(watermarkPath, cx, cy, { width: w });
          doc.opacity(1);
        });
      }

      // ==============================
      // Header: Company Name & Address
      // ==============================
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .fillColor("#1E90FF") // blue color
        .text(invoiceData.companyDetails.companyName, { align: "center" });

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("black")
        .text(
          `${invoiceData.companyDetails.addressLine}\n${
            invoiceData.companyDetails.city
          }, ${invoiceData.companyDetails.state}${
            invoiceData.companyDetails.pincode
              ? " - " + invoiceData.companyDetails.pincode
              : ""
          }`,
          { align: "center" }
        )
        .moveDown(0.2)
        .text(
          `Con: ${invoiceData.companyDetails.contactNumber} | Email: ${invoiceData.companyDetails.email}`,
          { align: "center" }
        );

      doc.moveDown(0.8);

      // ==============================
      // Document Title (Dynamic based on type)
      // ==============================
      const documentTitle = {
        'quotation': 'QUOTATION',
        'proforma': 'PROFORMA INVOICE',
        'invoice': 'TAX INVOICE'
      }[invoiceData.documentType] || 'QUOTATION';

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#1E90FF") // blue
        .text(documentTitle, { align: "center", underline: true });

      doc.fillColor("black"); // reset color

      doc.moveDown(0.5);

      // ==============================
      // Document Number & Date (Dynamic)
      // ==============================
      const dateString = new Date(
        invoiceData.date || invoiceData.quotationDetails?.date
      ).toLocaleDateString("en-GB");

      const docLabel = {
        'quotation': 'Quotation #',
        'proforma': 'Proforma #',
        'invoice': 'Invoice #'
      }[invoiceData.documentType] || 'Document #';

      const docNumber = invoiceData.documentNumber || invoiceData.quotationDetails?.quotationNumber;

      const quotationY = doc.y;
      doc.fontSize(9).font("Helvetica");
      doc.text(
        `${docLabel}: ${docNumber}`,
        50,
        quotationY
      );
      doc.text(`Date: ${dateString}`, 400, quotationY);

      doc.moveDown(0.5);

      // ==============================
      // PO Details (For Invoice only)
      // ==============================
      if (invoiceData.documentType === 'invoice' && invoiceData.poDetails) {
        if (invoiceData.poDetails.poNumber || invoiceData.poDetails.poDate) {
          const poY = doc.y;
          if (invoiceData.poDetails.poNumber) {
            doc.text(`PO Number: ${invoiceData.poDetails.poNumber}`, 50, poY);
          }
          if (invoiceData.poDetails.poDate) {
            const poDate = new Date(invoiceData.poDetails.poDate).toLocaleDateString("en-GB");
            doc.text(`PO Date: ${poDate}`, 400, poY);
          }
          doc.moveDown(0.5);
        }
      }

      // ==============================
      // Horizontal line below info
      // ==============================
      doc
        .strokeColor("#000000")
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();

      doc.moveDown(0.8);

      // ==============================
      // Kind Attention Section
      // ==============================
      doc.fontSize(10).font("Helvetica-Bold").text("Kind Attention", 50);

      doc
        .fontSize(9)
        .font("Helvetica")
        .text(invoiceData.customerDetails.customerName, 50);
      doc
        .font("Helvetica-Bold")
        .text(invoiceData.customerDetails.customerCompanyName, 50);

      const customerAddress = [
        invoiceData.customerDetails.addressLine,
        `${invoiceData.customerDetails.city}, ${
          invoiceData.customerDetails.state
        }${
          invoiceData.customerDetails.pincode
            ? " - " + invoiceData.customerDetails.pincode
            : ""
        }`,
        `Contact No: ${invoiceData.customerDetails.contactNumber}`,
      ];
      doc.font("Helvetica").text(customerAddress.join("\n"), 50);

      doc.moveDown(1.5);

      // =================================================================
      // TABLE LOGIC (Items)
      // =================================================================
      const tableTop = doc.y;
      const startX = 50;
      const availableWidth = doc.page.width - startX - doc.page.margins.right;

      // Base columns
      const baseColumns = [
        { id: "s_no", header: "S.No", width: 30, align: "center" },
        { id: "particulars", header: "PARTICULARS", width: 130, align: "left" },
        { id: "hsnCode", header: "HSN Code", width: 45, align: "center" },
        { id: "quantity", header: "Qty", width: 30, align: "center" },
        { id: "unit", header: "Unit", width: 30, align: "center" },
        { id: "rate", header: "Rate", width: 50, align: "right" },
        { id: "amount", header: "Taxable Amt", width: 65, align: "right" },
      ];

      // GST columns dynamically
      const gstColumns = [];
      if (invoiceData.items.some((item) => item.cgst > 0)) {
        gstColumns.push({
          header: "CGST",
          rate_id: "cgst",
          rate_width: 25,
          amt_width: 35,
        });
      }
      if (invoiceData.items.some((item) => item.sgst > 0)) {
        gstColumns.push({
          header: "SGST",
          rate_id: "sgst",
          rate_width: 25,
          amt_width: 35,
        });
      }
      if (invoiceData.items.some((item) => item.igst > 0)) {
        gstColumns.push({
          header: "IGST",
          rate_id: "igst",
          rate_width: 25,
          amt_width: 35,
        });
      }

      const finalAmountColumn = {
        id: "totalAmount",
        header: "Amount",
        width: 65,
        align: "right",
      };
      let columns = [...baseColumns];
      gstColumns.forEach((gst) => {
        columns.push({
          header: gst.header,
          isGstHeader: true,
          width: gst.rate_width + gst.amt_width,
        });
      });
      columns.push(finalAmountColumn);

      // Adjust particulars width if table is too wide
      const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
      if (totalWidth > availableWidth) {
        const overflow = totalWidth - availableWidth;
        const particularsCol = baseColumns.find((c) => c.id === "particulars");
        if (particularsCol) particularsCol.width -= overflow;
      }

      // Draw table header
      const headerY = tableTop;
      const headerHeight1 = 15;
      const headerHeight2 = 12;
      const totalHeaderHeight = headerHeight1 + headerHeight2;
      doc.lineWidth(0.5);
      doc
        .rect(
          startX,
          headerY,
          columns.reduce((sum, c) => sum + c.width, 0),
          totalHeaderHeight
        )
        .fillAndStroke("#dcecff", "#000");

      doc.fillColor("#000").font("Helvetica-Bold").fontSize(8);
      let currentX = startX;

      // Base columns header
      baseColumns.forEach((col) => {
        doc.rect(currentX, headerY, col.width, totalHeaderHeight).stroke();
        doc.text(col.header, currentX, headerY + 8, {
          width: col.width,
          align: "center",
        });
        currentX += col.width;
      });

      // GST headers
      gstColumns.forEach((gst) => {
        const totalGstWidth = gst.rate_width + gst.amt_width;
        doc.rect(currentX, headerY, totalGstWidth, headerHeight1).stroke();
        doc.text(gst.header, currentX, headerY + 4, {
          width: totalGstWidth,
          align: "center",
        });

        doc.fontSize(7);
        doc
          .rect(
            currentX,
            headerY + headerHeight1,
            gst.rate_width,
            headerHeight2
          )
          .stroke();
        doc.text("Rate%", currentX, headerY + headerHeight1 + 3, {
          width: gst.rate_width,
          align: "center",
        });
        doc
          .rect(
            currentX + gst.rate_width,
            headerY + headerHeight1,
            gst.amt_width,
            headerHeight2
          )
          .stroke();
        doc.text(
          "Amt",
          currentX + gst.rate_width,
          headerY + headerHeight1 + 3,
          { width: gst.amt_width, align: "center" }
        );

        currentX += totalGstWidth;
        doc.fontSize(8);
      });

      doc
        .rect(currentX, headerY, finalAmountColumn.width, totalHeaderHeight)
        .stroke();
      doc.text(finalAmountColumn.header, currentX, headerY + 8, {
        width: finalAmountColumn.width,
        align: "center",
      });

      // Draw table rows
      let currentY = headerY + totalHeaderHeight;
      doc.font("Helvetica").fontSize(8).fillColor("#000");

      const drawCell = (text, x, y, width, height, align, isNumber = false) => {
        doc.text(text, x + 3, y + 5, {
          width: width - 6,
          align,
          lineBreak: !isNumber,
        });
        doc.rect(x, y, width, height).stroke();
      };

      invoiceData.items.forEach((item, i) => {
        const rowHeight = Math.max(
          20,
          doc.heightOfString(item.particulars, {
            width: baseColumns.find((c) => c.id === "particulars").width - 6,
          }) + 10
        );
        let x = startX;

        drawCell(
          (i + 1).toString(),
          x,
          currentY,
          baseColumns[0].width,
          rowHeight,
          baseColumns[0].align
        );
        x += baseColumns[0].width;
        drawCell(
          item.particulars,
          x,
          currentY,
          baseColumns[1].width,
          rowHeight,
          baseColumns[1].align
        );
        x += baseColumns[1].width;
        drawCell(
          item.hsnCode || "",
          x,
          currentY,
          baseColumns[2].width,
          rowHeight,
          baseColumns[2].align
        );
        x += baseColumns[2].width;
        drawCell(
          item.quantity.toString(),
          x,
          currentY,
          baseColumns[3].width,
          rowHeight,
          baseColumns[3].align
        );
        x += baseColumns[3].width;
        drawCell(
          item.unit,
          x,
          currentY,
          baseColumns[4].width,
          rowHeight,
          baseColumns[4].align
        );
        x += baseColumns[4].width;
        drawCell(
          item.rate.toFixed(2),
          x,
          currentY,
          baseColumns[5].width,
          rowHeight,
          baseColumns[5].align,
          true
        );
        x += baseColumns[5].width;
        drawCell(
          item.amount.toFixed(2),
          x,
          currentY,
          baseColumns[6].width,
          rowHeight,
          baseColumns[6].align,
          true
        );
        x += baseColumns[6].width;

        gstColumns.forEach((gst) => {
          const rate = item[gst.rate_id] || 0;
          const amt = (item.amount * rate) / 100;
          drawCell(
            rate ? rate.toString() : "0",
            x,
            currentY,
            gst.rate_width,
            rowHeight,
            "center",
            true
          );
          x += gst.rate_width;
          drawCell(
            amt.toFixed(2),
            x,
            currentY,
            gst.amt_width,
            rowHeight,
            "right",
            true
          );
          x += gst.amt_width;
        });

        const totalItemAmount =
          item.amount +
          (item.cgst ? (item.amount * item.cgst) / 100 : 0) +
          (item.sgst ? (item.amount * item.sgst) / 100 : 0) +
          (item.igst ? (item.amount * item.igst) / 100 : 0);

        drawCell(
          totalItemAmount.toFixed(2),
          x,
          currentY,
          finalAmountColumn.width,
          rowHeight,
          finalAmountColumn.align,
          true
        );
        currentY += rowHeight;
      });

      // Draw totals
      const totalsLabelWidth =
        baseColumns.reduce((s, c) => s + c.width, 0) +
        gstColumns.reduce((s, c) => s + c.rate_width + c.amt_width, 0);
      const totalsValueWidth = finalAmountColumn.width;

      doc.font("Helvetica-Bold").fontSize(9);

      const drawTotalRow = (label, value, highlight = false) => {
        const rowY = currentY;
        const rowHeight = 20;

        if (highlight) {
          doc
            .fillColor("#dcecff")
            .rect(
              startX,
              rowY,
              columns.reduce((sum, c) => sum + c.width, 0),
              rowHeight
            )
            .fill();
          doc.fillColor("#000");
        }

        doc.rect(startX, rowY, totalsLabelWidth, rowHeight).stroke();
        doc.text(label, startX, rowY + 6, {
          width: totalsLabelWidth - 10,
          align: "right",
        });

        doc
          .rect(startX + totalsLabelWidth, rowY, totalsValueWidth, rowHeight)
          .stroke();
        doc.text(value.toFixed(2), startX + totalsLabelWidth + 3, rowY + 6, {
          width: totalsValueWidth - 6,
          align: "right",
          lineBreak: false,
        });

        currentY += rowHeight;
      };

      drawTotalRow("Taxable Amount", invoiceData.totals.taxableAmount);
      if (invoiceData.totals.totalCGST > 0)
        drawTotalRow("CGST Amount", invoiceData.totals.totalCGST);
      if (invoiceData.totals.totalSGST > 0)
        drawTotalRow("SGST Amount", invoiceData.totals.totalSGST);
      if (invoiceData.totals.totalIGST > 0)
        drawTotalRow("IGST Amount", invoiceData.totals.totalIGST);
      drawTotalRow("Grand Total", invoiceData.totals.grandTotal, true);

      // =================================================================
      // BANK DETAILS & DISPATCH DETAILS - SIDE BY SIDE
      // =================================================================
      const hasBankDetails = (invoiceData.documentType === 'proforma' || invoiceData.documentType === 'invoice') && 
                             invoiceData.bankDetails && invoiceData.bankDetails.bankName;
      const hasDispatchDetails = invoiceData.documentType === 'invoice' && invoiceData.dispatchDetails &&
                                 (invoiceData.dispatchDetails.deliveryType || invoiceData.dispatchDetails.dispatchDate || invoiceData.dispatchDetails.courierName);

      if (hasBankDetails || hasDispatchDetails) {
        doc.moveDown(1.5);
        const detailsY = doc.y;
        const leftX = 50;
        const rightX = 310; // Right column starts at middle of page
        
        let bankHeight = 0;
        let dispatchHeight = 0;

        // Bank Details - Left Side
        if (hasBankDetails) {
          doc.fontSize(11).font("Helvetica-Bold").fillColor("#1E90FF").text("Bank Details:", leftX, detailsY);
          doc.fillColor("black");
          doc.fontSize(9).font("Helvetica");
          let yOffset = 20;
          if (invoiceData.bankDetails.beneficiaryName) {
            doc.text(`Beneficiary Name: ${invoiceData.bankDetails.beneficiaryName}`, leftX, detailsY + yOffset);
            yOffset += 15;
          }
          doc.text(`Bank Name: ${invoiceData.bankDetails.bankName}`, leftX, detailsY + yOffset);
          yOffset += 15;
          doc.text(`Account Number: ${invoiceData.bankDetails.accountNumber}`, leftX, detailsY + yOffset);
          yOffset += 15;
          doc.text(`IFSC Code: ${invoiceData.bankDetails.ifscCode}`, leftX, detailsY + yOffset);
          yOffset += 15;
          if (invoiceData.bankDetails.branch) {
            doc.text(`Branch: ${invoiceData.bankDetails.branch}`, leftX, detailsY + yOffset);
            yOffset += 15;
          }
          bankHeight = yOffset;
        }

        // Dispatch Details - Right Side
        if (hasDispatchDetails) {
          doc.fontSize(11).font("Helvetica-Bold").fillColor("#1E90FF").text("Dispatch Details:", rightX, detailsY);
          doc.fillColor("black");
          doc.fontSize(9).font("Helvetica");
          let yOffset = 20;
          if (invoiceData.dispatchDetails.deliveryType) {
            doc.text(`Delivery Type: ${invoiceData.dispatchDetails.deliveryType}`, rightX, detailsY + yOffset);
            yOffset += 15;
          }
          if (invoiceData.dispatchDetails.dispatchDate) {
            const dispatchDate = new Date(invoiceData.dispatchDetails.dispatchDate).toLocaleDateString("en-GB");
            doc.text(`Dispatch Date: ${dispatchDate}`, rightX, detailsY + yOffset);
            yOffset += 15;
          }
          if (invoiceData.dispatchDetails.courierName) {
            doc.text(`Courier: ${invoiceData.dispatchDetails.courierName}`, rightX, detailsY + yOffset);
            yOffset += 15;
          }
          dispatchHeight = yOffset;
        }

        // Move cursor down after both sections - use the taller of the two
        const maxHeight = Math.max(bankHeight, dispatchHeight);
        doc.y = detailsY + maxHeight;
      }

      // =================================================================
      // FOOTER: Horizontal Line + Terms + Signature + Thank You
      // =================================================================
      
      // Calculate approximate space needed for signature block (signature + thank you)
      const signatureBlockHeight = 100; // Approximate height for signature section + thank you
      
      doc.moveDown(1);
      // Horizontal line
      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();
      doc.moveDown(0.5);

      // Terms & Conditions
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("black")
        .text("Terms & Conditions:", 50);
      doc.moveDown(0.5);
      doc.fontSize(9).font("Helvetica");
      const terms = [
        "1. All rates are ex-works.",
        "2. All taxes & cartage will be charged extra as actual.",
        "3. Supply of materials will start within 4–5 days after receiving confirmed purchase order along with advance payment.",
        "4. Unloading & proper storage of materials at site will be in your scope.",
        "5. Payment terms: 100% advance along with confirmed commercial purchase order.",
        "6. Please revert back for any clarification.",
      ];
      terms.forEach((term) => {
        doc.text(term, { indent: 10 });
        doc.moveDown(0.2);
      });

      doc.moveDown(1);
      doc.text(
        "We trust you will find our offer in order. Should you require any further information, please feel free to contact us.",
        { width: 500 }
      );

      // Check if signature block will fit on current page
      doc.moveDown(1);
      if (doc.y + signatureBlockHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }
      
      // Signature left-aligned
      const bottomY = doc.y;
      doc.fontSize(10).font("Helvetica-Bold").fillColor("black");
      doc.text("Thanks and Regards,", 50, bottomY);
      doc.text(
        `For ${invoiceData.companyDetails.companyName}`,
        50,
        bottomY + 15
      );
      doc.font("Helvetica").fontSize(9);
      doc.text(
        `${invoiceData.companyDetails.city}, ${invoiceData.companyDetails.state}`,
        50,
        bottomY + 30
      );

      // Centered Thank You
      doc.moveDown(1);
      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor("#2e8b57")
        .text("Thank You For Your Business!", { align: "center" });

      doc.fillColor("black");
      doc.end();

      if (returnBuffer) {
        const buffers = [];
        stream.on('data', buffers.push.bind(buffers));
        stream.on('end', () => resolve(Buffer.concat(buffers)));
        stream.on('error', reject);
      } else {
        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generatePDF };
