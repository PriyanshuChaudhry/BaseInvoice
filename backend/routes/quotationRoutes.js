const express = require('express');
const router = express.Router();

const {
  createQuotation,
  getAllQuotations,
  getQuotationByNumber,
  streamPDF,
  deletePDF
} = require('../controllers/quotationController');

router.post('/create', createQuotation);
router.get('/all', getAllQuotations);
router.get('/pdf/:fileId', streamPDF);        // Stream PDF from GridFS
router.delete('/pdf/:fileId', deletePDF);     // Delete PDF from GridFS
router.get('/:quotationNumber', getQuotationByNumber);

module.exports = router;
