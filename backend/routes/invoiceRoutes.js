const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  downloadPDF
} = require('../controllers/invoiceController');

// Create new invoice
router.post('/create', createInvoice);

// Get all invoices
router.get('/all', getAllInvoices);

// Get single invoice
router.get('/:id', getInvoiceById);

// Download PDF
router.get('/download/:filename', downloadPDF);

module.exports = router;
