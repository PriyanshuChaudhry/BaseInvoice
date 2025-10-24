const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  companyDetails: {
    companyName: {
      type: String,
      required: true
    },
    addressLine: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      default: ''
    },
    contactNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  customerDetails: {
    customerName: {
      type: String,
      required: true
    },
    customerCompanyName: {
      type: String,
      required: true
    },
    addressLine: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      default: ''
    },
    contactNumber: {
      type: String,
      required: true
    }
  },
  quotationDetails: {
    quotationNumber: {
      type: String,
      required: true,
      unique: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  items: [{
    sNo: {
      type: Number,
      required: true
    },
    particulars: {
      type: String,
      required: true
    },
    hsnCode: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    cgst: {
      type: Number,
      default: 0
    },
    sgst: {
      type: Number,
      default: 0
    },
    igst: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  totals: {
    taxableAmount: {
      type: Number,
      required: true
    },
    totalCGST: {
      type: Number,
      default: 0
    },
    totalSGST: {
      type: Number,
      default: 0
    },
    totalIGST: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true
    }
  },
  pdfPath: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
