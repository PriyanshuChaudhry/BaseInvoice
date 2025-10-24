import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API Base URL - uses environment variable or defaults to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProformaForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    quotationNumber: "",
    bankDetails: {
      beneficiaryName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/proforma/create`,
        formData
      );

      if (response.data.success) {
        toast.success(`Proforma Invoice ${response.data.proformaNumber} created successfully!`);

        // Open PDF in new tab from GridFS
        if (response.data.pdfGridFSId) {
          window.open(`${API_BASE_URL}/api/proforma/pdf/${response.data.pdfGridFSId}`, "_blank");
        } else {
          toast.error('PDF created but no GridFS ID received.');
        }

        // Reset form
        setFormData({
          quotationNumber: "",
          bankDetails: {
            beneficiaryName: "",
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            branch: "",
          },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating proforma invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-green-600 mb-6">
        📋 Create Proforma Invoice
      </h2>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-sm text-blue-700">
          ℹ️ <strong>Note:</strong> Enter the Quotation Number to automatically
          fetch all customer and item details.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quotation Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.quotationNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                quotationNumber: e.target.value,
              }))
            }
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., QUT/2024-2025/001"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the quotation number you created earlier
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Bank Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="beneficiaryName"
                value={formData.bankDetails.beneficiaryName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., BASE PLUS EARTHING'S"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., State Bank of India"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 1234567890123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., SBIN0001234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <input
                type="text"
                name="branch"
                value={formData.bankDetails.branch}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Mumbai Main Branch"
              />
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            {loading ? "Generating..." : "📋 Generate Proforma Invoice PDF"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProformaForm;
