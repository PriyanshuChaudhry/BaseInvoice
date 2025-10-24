const mongoose = require('mongoose');

const finalInvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  financialYear: {
    type: String,
    required: true
  },
  quotationNumber: {
    type: String,
    required: true,
    ref: 'Quotation'
  },
  proformaNumber: {
    type: String,
    ref: 'ProformaInvoice'
  },
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation'
  },
  proformaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProformaInvoice'
  },
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
  date: {
    type: Date,
    required: true
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
  bankDetails: {
    beneficiaryName: {
      type: String,
      default: ''
    },
    bankName: {
      type: String,
      default: ''
    },
    accountNumber: {
      type: String,
      default: ''
    },
    ifscCode: {
      type: String,
      default: ''
    },
    branch: {
      type: String,
      default: ''
    }
  },
  poDetails: {
    poNumber: {
      type: String,
      default: ''
    },
    poDate: {
      type: Date
    }
  },
  dispatchDetails: {
    deliveryType: {
      type: String,
      default: ''
    },
    dispatchDate: {
      type: Date
    },
    courierName: {
      type: String,
      default: ''
    }
  },
  pdfGridFSId: {
    type: String  // GridFS file ID
  },
  pdfFilename: {
    type: String  // Original filename
  },
  pdfSize: {
    type: Number  // File size in bytes
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'delivered'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FinalInvoice', finalInvoiceSchema);
