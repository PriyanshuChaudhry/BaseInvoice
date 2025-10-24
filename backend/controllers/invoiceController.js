const Invoice = require('../models/Invoice');
const { generatePDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

// Create a new invoice and generate PDF
const createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;

    // Save to database
    const invoice = new Invoice(invoiceData);
    await invoice.save();

    // Generate PDF - sanitize filename to remove invalid characters
    const sanitizedQuotationNumber = invoiceData.quotationDetails.quotationNumber.replace(/[/\\:*?"<>|]/g, '_');
    const fileName = `invoice_${sanitizedQuotationNumber}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../invoices', fileName);

    await generatePDF(invoiceData, filePath);

    // Update invoice with PDF path
    invoice.pdfPath = filePath;
    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice: invoice,
      pdfPath: fileName
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    
    // Handle duplicate quotation number error
    if (error.code === 11000 && error.keyPattern && error.keyPattern['quotationDetails.quotationNumber']) {
      return res.status(400).json({
        success: false,
        message: `Quotation number "${error.keyValue['quotationDetails.quotationNumber']}" already exists. Please use a unique quotation number.`,
        error: 'Duplicate quotation number'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating invoice',
      error: error.message
    });
  }
};

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices: invoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoices',
      error: error.message
    });
  }
};

// Get single invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      invoice: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice',
      error: error.message
    });
  }
};

// Download PDF
const downloadPDF = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../invoices', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({
          success: false,
          message: 'Error downloading file'
        });
      }
    });
  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading PDF',
      error: error.message
    });
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  downloadPDF
};
