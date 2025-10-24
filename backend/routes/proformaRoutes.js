const express = require('express');
const router = express.Router();

const {
  createProformaInvoice,
  getAllProformaInvoices,
  getProformaByNumber,
  streamPDF,
  deletePDF
} = require('../controllers/proformaController');

router.post('/create', createProformaInvoice);
router.get('/all', getAllProformaInvoices);
router.get('/pdf/:fileId', streamPDF);        // Stream PDF from GridFS
router.delete('/pdf/:fileId', deletePDF);     // Delete PDF from GridFS
router.get('/:proformaNumber', getProformaByNumber);

module.exports = router;
