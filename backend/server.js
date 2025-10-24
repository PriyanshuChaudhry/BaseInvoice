const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const { initGridFS } = require('./utils/gridfsHelper');
const invoiceRoutes = require('./routes/invoiceRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const proformaRoutes = require('./routes/proformaRoutes');
const finalInvoiceRoutes = require('./routes/finalInvoiceRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB and initialize GridFS
connectDB().then(() => {
  // Initialize GridFS after MongoDB connection is established
  initGridFS();
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

const app = express();

// Middleware
// Configure CORS for production
const allowedOrigins = [
  'http://localhost:3000', // Frontend development URL
  process.env.FRONTEND_URL // Vercel frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'invoices' directory (for local testing/development)
// This will be removed once Cloudinary is fully integrated and local PDF storage is deprecated.
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/proforma', proformaRoutes);
app.use('/api/finalinvoices', finalInvoiceRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'BaseInvoice API is running',
    version: '1.0.0',
    status: 'active'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Optional: Cleanup old local PDFs (can be removed once Cloudinary is fully integrated)
// This is a temporary measure for development/testing.
const cleanupLocalPdfs = () => {
  const invoiceDir = path.join(__dirname, 'invoices');
  const files = fs.readdirSync(invoiceDir);
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  files.forEach(file => {
    const filePath = path.join(invoiceDir, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtimeMs > thirtyDays) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old local PDF: ${file}`);
    }
  });
};

// Run cleanup once a day (for local development)
// setInterval(cleanupLocalPdfs, 24 * 60 * 60 * 1000);
