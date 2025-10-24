const express = require('express');
const router = express.Router();

const {
  createFinalInvoice,
  getAllFinalInvoices,
  getFinalInvoiceByNumber,
  streamPDF,
  deletePDF
} = require('../controllers/finalInvoiceController');

router.post('/create', createFinalInvoice);
router.get('/all', getAllFinalInvoices);
router.get('/pdf/:fileId', streamPDF);        // Stream PDF from GridFS
router.delete('/pdf/:fileId', deletePDF);     // Delete PDF from GridFS
router.get('/:invoiceNumber', getFinalInvoiceByNumber);

module.exports = router;
