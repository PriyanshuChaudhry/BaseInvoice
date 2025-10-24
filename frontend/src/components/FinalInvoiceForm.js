import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API Base URL - uses environment variable or defaults to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FinalInvoiceForm = () => {
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
    poDetails: {
      poNumber: "",
      poDate: "",
    },
    dispatchDetails: {
      deliveryType: "",
      dispatchDate: "",
      courierName: "",
    },
  });

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: value },
    }));
  };

  const handlePoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      poDetails: { ...prev.poDetails, [name]: value },
    }));
  };

  const handleDispatchChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      dispatchDetails: { ...prev.dispatchDetails, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/finalinvoices/create`,
        formData
      );

      if (response.data.success) {
        toast.success(`Final Invoice ${response.data.invoiceNumber} created successfully!`);

        // Open PDF in new tab from GridFS
        if (response.data.pdfGridFSId) {
          window.open(`${API_BASE_URL}/api/finalinvoices/pdf/${response.data.pdfGridFSId}`, "_blank");
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
          poDetails: { poNumber: "", poDate: "" },
          dispatchDetails: {
            deliveryType: "",
            dispatchDate: "",
            courierName: "",
          },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating final invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-purple-600 mb-6">
        🧾 Create Final Invoice
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
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., QUT/2024-2025/001"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the quotation number you created earlier
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
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
                onChange={handleBankChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                onChange={handleBankChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                onChange={handleBankChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                onChange={handleBankChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                onChange={handleBankChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Mumbai Main Branch"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
            PO Details (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO Number
              </label>
              <input
                type="text"
                name="poNumber"
                value={formData.poDetails.poNumber}
                onChange={handlePoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., PO/2024/001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO Date
              </label>
              <input
                type="date"
                name="poDate"
                value={formData.poDetails.poDate}
                onChange={handlePoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">
            Dispatch Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Type
              </label>
              <input
                type="text"
                name="deliveryType"
                value={formData.dispatchDetails.deliveryType}
                onChange={handleDispatchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Express Courier"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispatch Date
              </label>
              <input
                type="date"
                name="dispatchDate"
                value={formData.dispatchDetails.dispatchDate}
                onChange={handleDispatchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courier Name
              </label>
              <input
                type="text"
                name="courierName"
                value={formData.dispatchDetails.courierName}
                onChange={handleDispatchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Blue Dart Express"
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
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            {loading ? "Generating..." : "🧾 Generate Final Invoice PDF"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinalInvoiceForm;
