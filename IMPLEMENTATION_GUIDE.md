# 🚀 Invoice Generator Extension - Complete Implementation Guide

## ✅ Completed Steps

### 1. Models Created
- ✅ `Counter.js` - Auto-incrementing counters
- ✅ `Quotation.js` - Quotation model
- ✅ `ProformaInvoice.js` - Proforma Invoice model  
- ✅ `FinalInvoice.js` - Final Invoice model

### 2. Helper Functions Created
- ✅ `documentHelpers.js` - Financial year & document number generation

### 3. Controllers Created
- ✅ `quotationController.js` - Quotation operations

---

## 📝 Remaining Implementation Steps

### STEP 5: Create Proforma Invoice Controller

**File: `backend/controllers/proformaController.js`**

```javascript
const ProformaInvoice = require('../models/ProformaInvoice');
const Quotation = require('../models/Quotation');
const { generatePDF } = require('../utils/pdfGenerator');
const { generateDocumentNumber, getFinancialYear } = require('../utils/documentHelpers');
const path = require('path');
const fs = require('fs');

// Create proforma invoice from quotation
const createProformaInvoice = async (req, res) => {
  try {
    const { quotationNumber, bankDetails } = req.body;

    // Fetch quotation data
    const quotation = await Quotation.findOne({ quotationNumber });
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Generate proforma number
    const proformaNumber = await generateDocumentNumber('proforma');
    const financialYear = getFinancialYear();

    // Create proforma invoice with quotation data
    const proformaInvoice = new ProformaInvoice({
      proformaNumber,
      financialYear,
      quotationNumber: quotation.quotationNumber,
      quotationId: quotation._id,
      companyDetails: quotation.companyDetails,
      customerDetails: quotation.customerDetails,
      date: new Date(),
      items: quotation.items,
      totals: quotation.totals,
      bankDetails: bankDetails || {}
    });

    await proformaInvoice.save();

    // Generate PDF
    const sanitizedNumber = proformaNumber.replace(/[/\\:*?"<>|]/g, '_');
    const fileName = `proforma_${sanitizedNumber}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../invoices', fileName);

    const pdfData = {
      documentType: 'proforma',
      documentNumber: proformaNumber,
      companyDetails: proformaInvoice.companyDetails,
      customerDetails: proformaInvoice.customerDetails,
      date: proformaInvoice.date,
      items: proformaInvoice.items,
      totals: proformaInvoice.totals,
      bankDetails: proformaInvoice.bankDetails,
      quotationNumber: quotation.quotationNumber
    };

    await generatePDF(pdfData, filePath);

    proformaInvoice.pdfPath = filePath;
    await proformaInvoice.save();

    res.status(201).json({
      success: true,
      message: 'Proforma Invoice created successfully',
      proformaInvoice,
      proformaNumber,
      pdfPath: fileName
    });

  } catch (error) {
    console.error('Error creating proforma invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating proforma invoice',
      error: error.message
    });
  }
};

// Get all proforma invoices
const getAllProformaInvoices = async (req, res) => {
  try {
    const proformaInvoices = await ProformaInvoice.find()
      .populate('quotationId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: proformaInvoices.length,
      proformaInvoices
    });
  } catch (error) {
    console.error('Error fetching proforma invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching proforma invoices',
      error: error.message
    });
  }
};

// Get proforma invoice by number
const getProformaByNumber = async (req, res) => {
  try {
    const { proformaNumber } = req.params;
    const proforma = await ProformaInvoice.findOne({ proformaNumber })
      .populate('quotationId');

    if (!proforma) {
      return res.status(404).json({
        success: false,
        message: 'Proforma Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      proforma
    });
  } catch (error) {
    console.error('Error fetching proforma invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching proforma invoice',
      error: error.message
    });
  }
};

module.exports = {
  createProformaInvoice,
  getAllProformaInvoices,
  getProformaByNumber
};
```

---

### STEP 6: Create Final Invoice Controller

**File: `backend/controllers/finalInvoiceController.js`**

```javascript
const FinalInvoice = require('../models/FinalInvoice');
const Quotation = require('../models/Quotation');
const ProformaInvoice = require('../models/ProformaInvoice');
const { generatePDF } = require('../utils/pdfGenerator');
const { generateDocumentNumber, getFinancialYear } = require('../utils/documentHelpers');
const path = require('path');
const fs = require('fs');

// Create final invoice from quotation
const createFinalInvoice = async (req, res) => {
  try {
    const { quotationNumber, bankDetails, dispatchDetails } = req.body;

    // Fetch quotation data
    const quotation = await Quotation.findOne({ quotationNumber });
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Optionally fetch proforma if exists
    const proforma = await ProformaInvoice.findOne({ quotationNumber });

    // Generate invoice number
    const invoiceNumber = await generateDocumentNumber('invoice');
    const financialYear = getFinancialYear();

    // Create final invoice
    const finalInvoice = new FinalInvoice({
      invoiceNumber,
      financialYear,
      quotationNumber: quotation.quotationNumber,
      quotationId: quotation._id,
      proformaNumber: proforma?.proformaNumber,
      proformaId: proforma?._id,
      companyDetails: quotation.companyDetails,
      customerDetails: quotation.customerDetails,
      date: new Date(),
      items: quotation.items,
      totals: quotation.totals,
      bankDetails: bankDetails || proforma?.bankDetails || {},
      dispatchDetails: dispatchDetails || {}
    });

    await finalInvoice.save();

    // Generate PDF
    const sanitizedNumber = invoiceNumber.replace(/[/\\:*?"<>|]/g, '_');
    const fileName = `invoice_${sanitizedNumber}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../invoices', fileName);

    const pdfData = {
      documentType: 'invoice',
      documentNumber: invoiceNumber,
      companyDetails: finalInvoice.companyDetails,
      customerDetails: finalInvoice.customerDetails,
      date: finalInvoice.date,
      items: finalInvoice.items,
      totals: finalInvoice.totals,
      bankDetails: finalInvoice.bankDetails,
      dispatchDetails: finalInvoice.dispatchDetails,
      quotationNumber: quotation.quotationNumber,
      proformaNumber: proforma?.proformaNumber
    };

    await generatePDF(pdfData, filePath);

    finalInvoice.pdfPath = filePath;
    await finalInvoice.save();

    res.status(201).json({
      success: true,
      message: 'Final Invoice created successfully',
      finalInvoice,
      invoiceNumber,
      pdfPath: fileName
    });

  } catch (error) {
    console.error('Error creating final invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating final invoice',
      error: error.message
    });
  }
};

// Get all final invoices
const getAllFinalInvoices = async (req, res) => {
  try {
    const finalInvoices = await FinalInvoice.find()
      .populate('quotationId')
      .populate('proformaId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: finalInvoices.length,
      finalInvoices
    });
  } catch (error) {
    console.error('Error fetching final invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching final invoices',
      error: error.message
    });
  }
};

// Get final invoice by number
const getFinalInvoiceByNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const invoice = await FinalInvoice.findOne({ invoiceNumber })
      .populate('quotationId')
      .populate('proformaId');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Error fetching final invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching final invoice',
      error: error.message
    });
  }
};

module.exports = {
  createFinalInvoice,
  getAllFinalInvoices,
  getFinalInvoiceByNumber
};
```

---

### STEP 7: Create Routes

**File: `backend/routes/quotationRoutes.js`**

```javascript
const express = require('express');
const router = express.Router();
const {
  createQuotation,
  getAllQuotations,
  getQuotationByNumber,
  downloadPDF
} = require('../controllers/quotationController');

router.post('/create', createQuotation);
router.get('/all', getAllQuotations);
router.get('/:quotationNumber', getQuotationByNumber);
router.get('/download/:filename', downloadPDF);

module.exports = router;
```

**File: `backend/routes/proformaRoutes.js`**

```javascript
const express = require('express');
const router = express.Router();
const {
  createProformaInvoice,
  getAllProformaInvoices,
  getProformaByNumber
} = require('../controllers/proformaController');

router.post('/create', createProformaInvoice);
router.get('/all', getAllProformaInvoices);
router.get('/:proformaNumber', getProformaByNumber);

module.exports = router;
```

**File: `backend/routes/finalInvoiceRoutes.js`**

```javascript
const express = require('express');
const router = express.Router();
const {
  createFinalInvoice,
  getAllFinalInvoices,
  getFinalInvoiceByNumber
} = require('../controllers/finalInvoiceController');

router.post('/create', createFinalInvoice);
router.get('/all', getAllFinalInvoices);
router.get('/:invoiceNumber', getFinalInvoiceByNumber);

module.exports = router;
```

---

### STEP 8: Update server.js

Add these lines to `backend/server.js`:

```javascript
const quotationRoutes = require('./routes/quotationRoutes');
const proformaRoutes = require('./routes/proformaRoutes');
const finalInvoiceRoutes = require('./routes/finalInvoiceRoutes');

// Add after existing routes
app.use('/api/quotations', quotationRoutes);
app.use('/api/proforma', proformaRoutes);
app.use('/api/finalinvoices', finalInvoiceRoutes);
```

---

### STEP 9: Update PDF Generator

The PDF generator needs to handle different document types. Update `backend/utils/pdfGenerator.js`:

Add at the beginning of the `generatePDF` function:

```javascript
const generatePDF = (invoiceData, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Determine document title
      const documentTitle = {
        'quotation': 'QUOTATION',
        'proforma': 'PROFORMA INVOICE',
        'invoice': 'TAX INVOICE'
      }[invoiceData.documentType] || 'QUOTATION';

      // Header
      doc.fontSize(18).font("Helvetica-Bold").text(invoiceData.companyDetails.companyName, { align: "center" });
      doc.fontSize(9).font("Helvetica").text(
          `${invoiceData.companyDetails.addressLine}\n${invoiceData.companyDetails.city}, ${invoiceData.companyDetails.state}${invoiceData.companyDetails.pincode ? " - " + invoiceData.companyDetails.pincode : ""}`,
          { align: "center" }
        ).moveDown(0.2).text(`Tel: ${invoiceData.companyDetails.contactNumber} | Email: ${invoiceData.companyDetails.email}`, {
          align: "center",
        });
      doc.moveDown(0.8);
      
      // Document Title
      doc.fontSize(14).font("Helvetica-Bold").text(documentTitle, { align: "center", underline: true });
      doc.moveDown(0.8);
      
      const dateString = new Date(invoiceData.date).toLocaleDateString("en-GB");
      doc.fontSize(9).font("Helvetica");
      const quotationY = doc.y;
      
      // Document Number
      const docLabel = {
        'quotation': 'Quotation #',
        'proforma': 'Proforma #',
        'invoice': 'Invoice #'
      }[invoiceData.documentType] || 'Document #';
      
      doc.text(docLabel, 50, quotationY);
      doc.text(`: ${invoiceData.documentNumber}`, 120, quotationY);
      doc.text(`Date`, 400, quotationY);
      doc.text(`: ${dateString}`, 430, quotationY);
      
      // ... (rest of your existing PDF code for table, etc.)
      
      // ADD BANK DETAILS FOR PROFORMA AND INVOICE
      if (invoiceData.documentType === 'proforma' || invoiceData.documentType === 'invoice') {
        if (invoiceData.bankDetails && invoiceData.bankDetails.bankName) {
          doc.moveDown(2);
          const bankY = doc.y;
          doc.fontSize(11).font("Helvetica-Bold").text("Bank Details:", 50, bankY);
          doc.fontSize(9).font("Helvetica");
          doc.text(`Bank Name: ${invoiceData.bankDetails.bankName}`, 50, bankY + 20);
          doc.text(`Account Number: ${invoiceData.bankDetails.accountNumber}`, 50, bankY + 35);
          doc.text(`IFSC Code: ${invoiceData.bankDetails.ifscCode}`, 50, bankY + 50);
          doc.text(`Branch: ${invoiceData.bankDetails.branch}`, 50, bankY + 65);
        }
      }
      
      // ADD DISPATCH DETAILS FOR INVOICE ONLY
      if (invoiceData.documentType === 'invoice' && invoiceData.dispatchDetails) {
        doc.moveDown(1);
        const dispatchY = doc.y;
        if (invoiceData.dispatchDetails.deliveryType) {
          doc.fontSize(9).font("Helvetica");
          doc.text(`Delivery Type: ${invoiceData.dispatchDetails.deliveryType}`, 50, dispatchY);
          if (invoiceData.dispatchDetails.dispatchDate) {
            const dispatchDate = new Date(invoiceData.dispatchDetails.dispatchDate).toLocaleDateString("en-GB");
            doc.text(`Dispatch Date: ${dispatchDate}`, 50, dispatchY + 15);
          }
        }
      }
      
      // ... (rest of signature and footer code)
```

---

## 🎨 Frontend Implementation

Continue in next message due to length...
