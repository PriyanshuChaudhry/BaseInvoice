# Invoice Generator - Backend

Express.js backend server with MongoDB integration and PDF generation capabilities.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/invoice_generator
NODE_ENV=development
```

3. Ensure MongoDB is running on your system

4. Start the server:
```bash
npm start
# or with auto-reload
npm run dev
```

## API Endpoints

- `POST /api/invoices/create` - Create invoice and generate PDF
- `GET /api/invoices/all` - Get all invoices
- `GET /api/invoices/:id` - Get specific invoice
- `GET /api/invoices/download/:filename` - Download PDF

## Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- pdfkit - PDF generation
- cors - CORS middleware
- dotenv - Environment variables
- body-parser - Request body parsing
