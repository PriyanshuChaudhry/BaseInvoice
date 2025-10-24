import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { INDIAN_STATES } from '../constants/indianStates';

const InvoiceForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    companyDetails: {
      companyName: "BASE PLUS EARTHING'S",
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      contactNumber: '',
      email: ''
    },
    customerDetails: {
      customerName: '',
      customerCompanyName: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      contactNumber: ''
    },
    quotationDetails: {
      quotationNumber: '',
      date: new Date().toISOString().split('T')[0]
    },
    items: [{
      sNo: 1,
      particulars: '',
      hsnCode: '',
      quantity: 0,
      unit: 'Nos',
      rate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      amount: 0
    }]
  });

  // Check if states are same for tax logic
  const isIntraState = formData.companyDetails.state && formData.customerDetails.state && 
                       formData.companyDetails.state === formData.customerDetails.state;

  // Update tax fields when states change
  useEffect(() => {
    const newItems = formData.items.map(item => ({
      ...item,
      cgst: isIntraState ? item.cgst : 0,
      sgst: isIntraState ? item.sgst : 0,
      igst: isIntraState ? 0 : item.igst
    }));
    
    setFormData(prev => ({ ...prev, items: newItems }));
  }, [formData.companyDetails.state, formData.customerDetails.state]);

  const calculateItemAmount = (quantity, rate) => quantity * rate;
  
  const calculateTaxAmount = (amount, taxPercentage) => (amount * taxPercentage) / 100;

  const calculateTotals = () => {
    let taxableAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    formData.items.forEach(item => {
      taxableAmount += item.amount;
      totalCGST += calculateTaxAmount(item.amount, item.cgst);
      totalSGST += calculateTaxAmount(item.amount, item.sgst);
      totalIGST += calculateTaxAmount(item.amount, item.igst);
    });

    const grandTotal = taxableAmount + totalCGST + totalSGST + totalIGST;

    return {
      taxableAmount: parseFloat(taxableAmount.toFixed(2)),
      totalCGST: parseFloat(totalCGST.toFixed(2)),
      totalSGST: parseFloat(totalSGST.toFixed(2)),
      totalIGST: parseFloat(totalIGST.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2))
    };
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      companyDetails: { ...prev.companyDetails, [name]: value }
    }));
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      customerDetails: { ...prev.customerDetails, [name]: value }
    }));
  };

  const handleQuotationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      quotationDetails: { ...prev.quotationDetails, [name]: value }
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'rate') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = calculateItemAmount(quantity, rate);
    }

    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        sNo: prev.items.length + 1,
        particulars: '',
        hsnCode: '',
        quantity: 1,
        unit: 'Nos',
        rate: 0,
        cgst: isIntraState ? 0 : 0,
        sgst: isIntraState ? 0 : 0,
        igst: isIntraState ? 0 : 0,
        amount: 0
      }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      newItems.forEach((item, i) => { item.sNo = i + 1; });
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const totals = calculateTotals();
      const response = await axios.post('http://localhost:5000/api/invoices/create', {
        ...formData,
        totals
      });

      if (response.data.success) {
        setMessage({ text: 'Invoice generated successfully!', type: 'success' });
        const link = document.createElement('a');
        link.href = `http://localhost:5000/api/invoices/download/${response.data.pdfPath}`;
        link.download = response.data.pdfPath;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error generating invoice', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <form onSubmit={handleSubmit}>
        {/* Company Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
            Company Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="companyName" value={formData.companyDetails.companyName}
                onChange={handleCompanyChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line <span className="text-red-500">*</span>
              </label>
              <input type="text" name="addressLine" value={formData.companyDetails.addressLine}
                onChange={handleCompanyChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Street, Building, Area" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input type="text" name="city" value={formData.companyDetails.city}
                onChange={handleCompanyChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select name="state" value={formData.companyDetails.state}
                onChange={handleCompanyChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select State</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input type="text" name="pincode" value={formData.companyDetails.pincode}
                onChange={handleCompanyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pincode" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input type="tel" name="contactNumber" value={formData.companyDetails.contactNumber}
                onChange={handleCompanyChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+91-XXXXXXXXXX" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input type="email" name="email" value={formData.companyDetails.email}
                onChange={handleCompanyChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="company@example.com" />
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Customer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="customerName" value={formData.customerDetails.customerName}
                onChange={handleCustomerChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="customerCompanyName" value={formData.customerDetails.customerCompanyName}
                onChange={handleCustomerChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Customer company name" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line <span className="text-red-500">*</span>
              </label>
              <input type="text" name="addressLine" value={formData.customerDetails.addressLine}
                onChange={handleCustomerChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Street, Building, Area" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input type="text" name="city" value={formData.customerDetails.city}
                onChange={handleCustomerChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select name="state" value={formData.customerDetails.state}
                onChange={handleCustomerChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select State</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input type="text" name="pincode" value={formData.customerDetails.pincode}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pincode" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input type="tel" name="contactNumber" value={formData.customerDetails.contactNumber}
                onChange={handleCustomerChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+91-XXXXXXXXXX" />
            </div>
          </div>
        </div>

        {/* Tax Logic Indicator */}
        {formData.companyDetails.state && formData.customerDetails.state && (
          <div className={`mb-4 p-3 rounded-lg ${isIntraState ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'}`}>
            <p className="text-sm font-medium">
              {isIntraState ? (
                <span className="text-blue-700">✓ Intra-State Transaction: CGST + SGST will apply</span>
              ) : (
                <span className="text-purple-700">✓ Inter-State Transaction: IGST will apply</span>
              )}
            </p>
          </div>
        )}

        {/* Quotation Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Quotation Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quotation Number <span className="text-red-500">*</span>
              </label>
              <input type="text" name="quotationNumber" value={formData.quotationDetails.quotationNumber}
                onChange={handleQuotationChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., QT/2025/001" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input type="date" name="date" value={formData.quotationDetails.date}
                onChange={handleQuotationChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-orange-500 pb-2">
              Item Details
            </h2>
            <button type="button" onClick={addItem}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition">
              + Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2 text-sm">S.No</th>
                  <th className="border px-2 py-2 text-sm">Particulars</th>
                  <th className="border px-2 py-2 text-sm">HSN Code</th>
                  <th className="border px-2 py-2 text-sm">Qty</th>
                  <th className="border px-2 py-2 text-sm">Unit</th>
                  <th className="border px-2 py-2 text-sm">Rate</th>
                  <th className="border px-2 py-2 text-sm">CGST%</th>
                  <th className="border px-2 py-2 text-sm">SGST%</th>
                  <th className="border px-2 py-2 text-sm">IGST%</th>
                  <th className="border px-2 py-2 text-sm">Amount</th>
                  <th className="border px-2 py-2 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-2 py-2 text-center">{item.sNo}</td>
                    <td className="border px-2 py-2">
                      <input type="text" value={item.particulars}
                        onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                        required className="w-full px-2 py-1 border rounded"
                        placeholder="Item description" />
                    </td>
                    <td className="border px-2 py-2">
                      <input type="text" value={item.hsnCode}
                        onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                        placeholder="HSN Code" />
                    </td>
                    <td className="border px-2 py-2">
                      <input type="number" value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        required min="0" step="0.01" className="w-20 px-2 py-1 border rounded" />
                    </td>                   
                    <td className="border px-2 py-2">
                      <select value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        className="w-20 px-2 py-1 border rounded">
                        <option value="Nos">Nos</option>
                        <option value="Pcs">Pcs</option>
                        <option value="Kg">Kg</option>
                        <option value="Mtr">Mtr</option>
                        <option value="Ltr">Ltr</option>
                      </select>
                    </td>
                    <td className="border px-2 py-2">
                      <input type="number" value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        required min="0" step="0.01" className="w-24 px-2 py-1 border rounded" />
                    </td>
                    <td className="border px-2 py-2">
                      <input type="number" value={item.cgst}
                        onChange={(e) => handleItemChange(index, 'cgst', parseFloat(e.target.value) || 0)}
                        disabled={!isIntraState} min="0" max="100" step="0.01"
                        className="w-20 px-2 py-1 border rounded disabled:bg-gray-100" />
                    </td>
                    <td className="border px-2 py-2">
                      <input type="number" value={item.sgst}
                        onChange={(e) => handleItemChange(index, 'sgst', parseFloat(e.target.value) || 0)}
                        disabled={!isIntraState} min="0" max="100" step="0.01"
                        className="w-20 px-2 py-1 border rounded disabled:bg-gray-100" />
                    </td>
                    <td className="border px-2 py-2">
                      <input type="number" value={item.igst}
                        onChange={(e) => handleItemChange(index, 'igst', parseFloat(e.target.value) || 0)}
                        disabled={isIntraState} min="0" max="100" step="0.01"
                        className="w-20 px-2 py-1 border rounded disabled:bg-gray-100" />
                    </td>
                    <td className="border px-2 py-2 text-right font-semibold">
                      ₹{item.amount.toFixed(2)}
                    </td>
                    <td className="border px-2 py-2 text-center">
                      <button type="button" onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:text-gray-300">
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Taxable Amount:</span>
              <span className="font-semibold">₹{totals.taxableAmount.toFixed(2)}</span>
            </div>
            {totals.totalCGST > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Total CGST:</span>
                <span className="font-semibold text-blue-600">₹{totals.totalCGST.toFixed(2)}</span>
              </div>
            )}
            {totals.totalSGST > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Total SGST:</span>
                <span className="font-semibold text-blue-600">₹{totals.totalSGST.toFixed(2)}</span>
              </div>
            )}
            {totals.totalIGST > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Total IGST:</span>
                <span className="font-semibold text-blue-600">₹{totals.totalIGST.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t-2 border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-xl">
                <span className="font-bold">Grand Total:</span>
                <span className="font-bold text-green-600">₹{totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-center">
          <button type="submit" disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition">
            {loading ? 'Generating...' : '📄 Generate PDF Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
