const FinalInvoice = require('../models/FinalInvoice');
const Quotation = require('../models/Quotation');
const ProformaInvoice = require('../models/ProformaInvoice');
const { generatePDF } = require('../utils/pdfGenerator');
const { generateDocumentNumber, getFinancialYear } = require('../utils/documentHelpers');
const { uploadPDFToGridFS, getPDFFromGridFS, deletePDFFromGridFS } = require('../utils/gridfsHelper');

// Create final invoice from quotation
const createFinalInvoice = async (req, res) => {
  try {
    const { quotationNumber, bankDetails, dispatchDetails, poDetails } = req.body;
    console.log('Creating final invoice for quotation:', quotationNumber);
    console.log('Request body:', req.body);
    
    // Trim whitespace from quotation number
    const trimmedQuotationNumber = quotationNumber?.trim();
    
    // Fetch quotation data
    const quotation = await Quotation.findOne({ quotationNumber: trimmedQuotationNumber });
    
    if (!quotation) {
      console.log('Quotation not found. Searching for:', trimmedQuotationNumber);
      // Try to find any quotations to help debug
      const allQuotations = await Quotation.find({}).select('quotationNumber');
      console.log('Available quotations:', allQuotations.map(q => q.quotationNumber));
      
      return res.status(404).json({
        success: false,
        message: `Quotation not found: "${trimmedQuotationNumber}". Available quotations: ${allQuotations.map(q => q.quotationNumber).join(', ')}`
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
      dispatchDetails: dispatchDetails || {},
      poDetails: poDetails || {}
    });
    
    await finalInvoice.save();
    
    // Generate PDF to a buffer first
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
      poDetails: finalInvoice.poDetails,
      quotationNumber: quotation.quotationNumber,
      proformaNumber: proforma?.proformaNumber
    };
    
    const pdfBuffer = await generatePDF(pdfData, null, true); // Pass null for filePath, true to return buffer

    // Upload PDF to GridFS
    const filename = `invoice_${invoiceNumber.replace(/\//g, '_')}.pdf`;
    const uploadResult = await uploadPDFToGridFS(pdfBuffer, filename, {
      documentType: 'invoice',
      invoiceNumber: invoiceNumber
    });

    // Store GridFS file ID in database
    finalInvoice.pdfGridFSId = uploadResult.fileId;
    finalInvoice.pdfFilename = uploadResult.filename;
    finalInvoice.pdfSize = uploadResult.size;
    await finalInvoice.save();
    
    res.status(201).json({
      success: true,
      message: 'Final Invoice created successfully',
      finalInvoice,
      invoiceNumber,
      pdfGridFSId: uploadResult.fileId
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
    await FinalInvoice.updateOne(
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
  createFinalInvoice,
  getAllFinalInvoices,
  getFinalInvoiceByNumber,
  streamPDF,
  deletePDF
};
