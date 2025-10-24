const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Quotation = require('./models/Quotation');
const ProformaInvoice = require('./models/ProformaInvoice');
const FinalInvoice = require('./models/FinalInvoice');

dotenv.config();

const cleanupInvalidPDFs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get GridFSBucket to check which files exist
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'pdfs' });

    // Get all files in GridFS
    const gridfsFiles = await bucket.find({}).toArray();
    const validFileIds = new Set(gridfsFiles.map(f => f._id.toString()));
    console.log(`📁 Found ${validFileIds.size} valid PDFs in GridFS`);

    // Check and clean Quotations
    console.log('\n🔍 Checking Quotations...');
    const quotations = await Quotation.find({ pdfGridFSId: { $exists: true } });
    let quotationsFixed = 0;
    
    for (const quot of quotations) {
      if (quot.pdfGridFSId && !validFileIds.has(quot.pdfGridFSId)) {
        console.log(`❌ Invalid GridFS ID in quotation: ${quot.quotationNumber}`);
        quot.pdfGridFSId = undefined;
        quot.pdfFilename = undefined;
        quot.pdfSize = undefined;
        await quot.save();
        quotationsFixed++;
      }
    }
    console.log(`✅ Fixed ${quotationsFixed} quotations`);

    // Check and clean Proforma Invoices
    console.log('\n🔍 Checking Proforma Invoices...');
    const proformas = await ProformaInvoice.find({ pdfGridFSId: { $exists: true } });
    let proformasFixed = 0;
    
    for (const pf of proformas) {
      if (pf.pdfGridFSId && !validFileIds.has(pf.pdfGridFSId)) {
        console.log(`❌ Invalid GridFS ID in proforma: ${pf.proformaNumber}`);
        pf.pdfGridFSId = undefined;
        pf.pdfFilename = undefined;
        pf.pdfSize = undefined;
        await pf.save();
        proformasFixed++;
      }
    }
    console.log(`✅ Fixed ${proformasFixed} proforma invoices`);

    // Check and clean Final Invoices
    console.log('\n🔍 Checking Final Invoices...');
    const invoices = await FinalInvoice.find({ pdfGridFSId: { $exists: true } });
    let invoicesFixed = 0;
    
    for (const inv of invoices) {
      if (inv.pdfGridFSId && !validFileIds.has(inv.pdfGridFSId)) {
        console.log(`❌ Invalid GridFS ID in invoice: ${inv.invoiceNumber}`);
        inv.pdfGridFSId = undefined;
        inv.pdfFilename = undefined;
        inv.pdfSize = undefined;
        await inv.save();
        invoicesFixed++;
      }
    }
    console.log(`✅ Fixed ${invoicesFixed} final invoices`);

    console.log('\n✨ Cleanup complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Quotations fixed: ${quotationsFixed}`);
    console.log(`   - Proformas fixed: ${proformasFixed}`);
    console.log(`   - Invoices fixed: ${invoicesFixed}`);
    console.log(`   - Total fixed: ${quotationsFixed + proformasFixed + invoicesFixed}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

cleanupInvalidPDFs();
