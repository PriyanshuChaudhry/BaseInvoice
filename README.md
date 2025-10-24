# 📊 BaseInvoice

**Professional Invoice & Quotation Management System**

A modern, full-stack web application for creating and managing quotations, proforma invoices, and final tax invoices with automatic PDF generation.

---

## ✨ Features

- 📄 **Quotation Management** - Create professional quotations
- 📋 **Proforma Invoices** - Generate proforma invoices with bank details
- 🧾 **Tax Invoices** - Create final invoices with dispatch & PO details
- 📊 **Document Tracking** - View all documents in one place
- 💾 **PDF Generation** - Automatic PDF creation with watermark
- 🏦 **GST Support** - Automatic CGST/SGST/IGST calculation
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean, professional interface with TailwindCSS

---

## 🚀 Quick Start

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm start
```

**Access:** http://localhost:3000

---

**Built with ❤️ for BASE PLUS EARTHING'S**

# Invoice & Quotation Generator - Full Stack MERN Application

A professional invoice and quotation generator built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows you to create detailed quotations with automatic tax calculations and generate PDF documents similar to the TRUE POWER LIMITED format.

## 🚀 Features

- **Complete Invoice Management**: Create and store invoices with all company and customer details
- **Dynamic Item Table**: Add/remove items dynamically with automatic calculations
- **Automatic Tax Calculations**: Real-time calculation of CGST, SGST, IGST, and Grand Total
- **Professional PDF Generation**: Generate PDF documents using PDFKit with professional formatting
- **Responsive Design**: Beautiful UI built with TailwindCSS that works on all devices
- **MongoDB Storage**: All invoices are stored in MongoDB for future reference
- **Auto-Download**: PDFs automatically download when generated

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 📁 Project Structure

```
invoice/
├── backend/                 # Backend Node.js/Express application
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions (PDF generation)
│   ├── invoices/           # Generated PDF files
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express server entry point
│
└── frontend/               # React frontend application
    ├── public/             # Public assets
    ├── src/
    │   ├── components/     # React components
    │   ├── App.js          # Main App component
    │   ├── index.js        # Entry point
    │   └── index.css       # Tailwind CSS
    ├── package.json        # Frontend dependencies
    └── tailwind.config.js  # Tailwind configuration
```

## 🛠️ Installation & Setup

### 1. Clone or Navigate to the Project

```bash
cd C:\Users\priya\Desktop\invoice
```

### 2. MongoDB Setup (⚠️ IMPORTANT - Do This First!)

You need MongoDB to store invoices. Choose one option:

**Option A: MongoDB Atlas (Cloud - Recommended)**
- No installation needed
- Free 512MB tier
- Follow steps in `MONGODB_SETUP.md`

**Option B: Local MongoDB**
- Install on your PC
- Follow steps in `MONGODB_SETUP.md`

📖 **See detailed guide**: `MONGODB_SETUP.md`

### 3. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Make sure MongoDB is running on your system
# Default connection: mongodb://localhost:27017/invoice_generator

# Start the backend server
npm start
# or for development with auto-reload
npm run dev
```

The backend server will start on **http://localhost:5000**

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend folder
cd C:\Users\priya\Desktop\invoice\frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend application will open automatically at **http://localhost:3000**

## 🎯 Usage

1. **Fill in Company Details**:
   - Company Name (default: TRUE POWER LIMITED)
   - Company Address
   - Contact Number
   - Email ID

2. **Enter Customer Details**:
   - Customer Name
   - Customer Company Name
   - Address
   - Contact Number

3. **Add Quotation Details**:
   - Quotation Number (unique identifier)
   - Date

4. **Add Items**:
   - Click "Add Item" to add rows
   - Fill in: Particulars, Quantity, Unit, Rate
   - Add tax percentages: CGST, SGST, or IGST
   - Amount is calculated automatically (Quantity × Rate)
   - Remove items using the delete icon

5. **Review Summary**:
   - View calculated Taxable Amount
   - See total CGST, SGST, IGST
   - Check Grand Total

6. **Generate PDF**:
   - Click "Generate PDF Invoice"
   - PDF will be automatically downloaded
   - Invoice is saved in the database and `/backend/invoices` folder

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/invoice_generator
NODE_ENV=development
```

### Frontend API Configuration

The frontend connects to the backend at `http://localhost:5000`. If you deploy the backend to a different URL, update the API calls in `frontend/src/components/InvoiceForm.js`.

## 📊 API Endpoints

### Base URL: `http://localhost:5000/api/invoices`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create new invoice and generate PDF |
| GET | `/all` | Get all invoices |
| GET | `/:id` | Get single invoice by ID |
| GET | `/download/:filename` | Download PDF file |

## 🎨 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **PDFKit** - PDF generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **TailwindCSS** - Styling framework
- **Axios** - HTTP client
- **JavaScript (ES6+)** - Programming language

## 📝 Invoice Format

The generated PDF includes:
- Company header with details
- "QUOTATION" title
- Quotation number and date
- Customer information
- Detailed item table with columns:
  - S.No
  - Particulars
  - Quantity
  - Unit
  - Rate
  - CGST%
  - SGST%
  - IGST%
  - Amount
- Summary section with:
  - Taxable Amount
  - Total CGST/SGST/IGST
  - Grand Total
- Terms and Conditions
- Signature section

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env` file

### Port Already in Use
- Change the PORT in `backend/.env`
- Or stop the process using that port

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS configuration in `server.js`
- Verify API URLs in frontend code

### PDF Generation Fails
- Check `backend/invoices` folder exists
- Verify file permissions
- Check backend console for error messages

## 📦 Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# This creates an optimized build in the 'build' folder
```

## 🤝 Contributing

This is a custom project built for invoice generation. Feel free to modify and extend according to your needs.

## 📄 License

This project is open source and available for personal and commercial use.

## 💡 Tips

- Keep your quotation numbers unique to avoid database conflicts
- Regular backup of MongoDB database recommended
- Generated PDFs are stored in `backend/invoices` folder
- Use CGST+SGST for intra-state transactions
- Use IGST for inter-state transactions

## 🎓 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check console logs for error messages

---

**Happy Invoicing! 🎉**
