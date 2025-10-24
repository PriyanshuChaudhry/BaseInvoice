const ProformaInvoice = require('../models/ProformaInvoice');
const Quotation = require('../models/Quotation');
const { generatePDF } = require('../utils/pdfGenerator');
const { generateDocumentNumber, getFinancialYear } = require('../utils/documentHelpers');
const { uploadPDFToGridFS, getPDFFromGridFS, deletePDFFromGridFS } = require('../utils/gridfsHelper');

// Create proforma invoice from quotation
const createProformaInvoice = async (req, res) => {
  try {
    const { quotationNumber, bankDetails } = req.body;
    
    // Trim whitespace from quotation number
    const trimmedQuotationNumber = quotationNumber?.trim();
    
    // Fetch quotation data
    const quotation = await Quotation.findOne({ quotationNumber: trimmedQuotationNumber });
    
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
    
    // Generate PDF to a buffer first
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
    
    const pdfBuffer = await generatePDF(pdfData, null, true); // Pass null for filePath, true to return buffer

    // Upload PDF to GridFS
    const filename = `proforma_${proformaNumber.replace(/\//g, '_')}.pdf`;
    const uploadResult = await uploadPDFToGridFS(pdfBuffer, filename, {
      documentType: 'proforma',
      proformaNumber: proformaNumber
    });

    // Store GridFS file ID in database
    proformaInvoice.pdfGridFSId = uploadResult.fileId;
    proformaInvoice.pdfFilename = uploadResult.filename;
    proformaInvoice.pdfSize = uploadResult.size;
    await proformaInvoice.save();
    
    res.status(201).json({
      success: true,
      message: 'Proforma Invoice created successfully',
      proformaInvoice,
      proformaNumber,
      pdfGridFSId: uploadResult.fileId
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

// Stream PDF from GridFS (opens in browser)
const streamPDF = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log('Streaming PDF with fileId:', fileId);

    const { readStream, file } = await getPDFFromGridFS(fileId);
    console.log('File found:', file.filename, 'Size:', file.length);

    // Set headers to open in browser
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Content-Length': file.length
    });

    // Handle stream errors
    readStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error streaming PDF',
          error: error.message
        });
      }
    });

    // Pipe the read stream to response
    readStream.pipe(res);

  } catch (error) {
    console.error('Error streaming PDF:', error);
    if (!res.headersSent) {
      res.status(404).json({
        success: false,
        message: 'PDF not found',
        error: error.message
      });
    }
  }
};

// Delete PDF from GridFS
const deletePDF = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log('Deleting PDF with fileId:', fileId);

    // Delete from GridFS
    await deletePDFFromGridFS(fileId);

    // Update database to remove GridFS references
    await ProformaInvoice.updateOne(
      { pdfGridFSId: fileId },
      { 
        $unset: { 
          pdfGridFSId: "",
          pdfFilename: "",
          pdfSize: "" 
        }
      }
    );
    console.log('Database updated - GridFS references removed');

    res.status(200).json({
      success: true,
      message: 'PDF deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting PDF:', error);
    
    if (error.message === 'File not found in GridFS') {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting PDF',
      error: error.message
    });
  }
};

module.exports = {
  createProformaInvoice,
  getAllProformaInvoices,
  getProformaByNumber,
  streamPDF,
  deletePDF
};
