const Quotation = require('../models/Quotation');
const { generatePDF } = require('../utils/pdfGenerator');
const { generateDocumentNumber, getFinancialYear } = require('../utils/documentHelpers');
const { uploadPDFToGridFS, getPDFFromGridFS, deletePDFFromGridFS } = require('../utils/gridfsHelper');

// Create a new quotation
const createQuotation = async (req, res) => {
  try {
    const quotationData = req.body;

    // Generate quotation number automatically
    const quotationNumber = await generateDocumentNumber('quotation');
    const financialYear = getFinancialYear();

    // Prepare quotation document
    const quotation = new Quotation({
      ...quotationData,
      quotationNumber,
      financialYear
    });

    await quotation.save();

    // Generate PDF to a buffer first
    const pdfData = {
      documentType: 'quotation',
      documentNumber: quotationNumber,
      companyDetails: quotation.companyDetails,
      customerDetails: quotation.customerDetails,
      date: quotation.date,
      items: quotation.items,
      totals: quotation.totals
    };

    // Generate PDF as buffer
    const pdfBuffer = await generatePDF(pdfData, null, true); // Pass null for filePath, true to return buffer

    // Upload PDF to GridFS
    const filename = `quotation_${quotationNumber.replace(/\//g, '_')}.pdf`;
    const uploadResult = await uploadPDFToGridFS(pdfBuffer, filename, {
      documentType: 'quotation',
      quotationNumber: quotationNumber
    });

    // Store GridFS file ID in database
    quotation.pdfGridFSId = uploadResult.fileId;
    quotation.pdfFilename = uploadResult.filename;
    quotation.pdfSize = uploadResult.size;
    await quotation.save();

    res.status(201).json({
      success: true,
      message: 'Quotation created successfully',
      quotation,
      quotationNumber,
      pdfGridFSId: uploadResult.fileId
    });

  } catch (error) {
    console.error('Error creating quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating quotation',
      error: error.message
    });
  }
};

// Get all quotations
const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: quotations.length,
      quotations
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotations',
      error: error.message
    });
  }
};

// Get quotation by number
const getQuotationByNumber = async (req, res) => {
  try {
    const { quotationNumber } = req.params;
    const quotation = await Quotation.findOne({ quotationNumber });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      quotation
    });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotation',
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
    await Quotation.updateOne(
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
  createQuotation,
  getAllQuotations,
  getQuotationByNumber,
  streamPDF,
  deletePDF
};
