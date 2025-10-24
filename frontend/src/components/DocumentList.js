import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

// API Base URL - uses environment variable or defaults to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DocumentList = () => {
  const [quotations, setQuotations] = useState([]);
  const [proformas, setProformas] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const fetchAllDocuments = async () => {
    setLoading(true);
    try {
      const [quotRes, proformaRes, invoiceRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/quotations/all`),
        axios.get(`${API_BASE_URL}/api/proforma/all`),
        axios.get(`${API_BASE_URL}/api/finalinvoices/all`)
      ]);

      setQuotations(quotRes.data.quotations || []);
      setProformas(proformaRes.data.proformaInvoices || []);
      setInvoices(invoiceRes.data.finalInvoices || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePDF = (fileId, endpoint, docType) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete this ${docType} PDF? This action cannot be undone.`,
      buttons: [
        {
          label: 'Yes, Delete',
          onClick: async () => {
            try {
              console.log('Deleting PDF:', fileId);
              const response = await axios.delete(`${API_BASE_URL}${endpoint}/${fileId}`);
              console.log('Delete response:', response.data);
              
              toast.success(`${docType} PDF deleted successfully`);
              
              // Wait a moment then refresh
              setTimeout(async () => {
                console.log('Refreshing document list...');
                await fetchAllDocuments();
                console.log('Document list refreshed');
              }, 500);
            } catch (error) {
              console.error('Error deleting PDF:', error);
              toast.error(`Failed to delete ${docType} PDF: ${error.response?.data?.message || error.message}`);
            }
          }
        },
        {
          label: 'Cancel',
          onClick: () => {}
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      overlayClassName: 'custom-overlay'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-xl text-gray-600">Loading documents...</div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-orange-600 mb-6">📚 All Documents</h2>

      {/* Quotations */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
          📄 Quotations ({quotations.length})
        </h3>
        {quotations.length === 0 ? (
          <p className="text-gray-500 italic">No quotations found</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Quotation #</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Customer</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm hidden md:table-cell">Company</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-right text-xs sm:text-sm">Total</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Date</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((quot) => (
                  <tr key={quot._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 font-semibold text-blue-600 text-xs sm:text-sm">
                      {quot.quotationNumber}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm">
                      {quot.customerDetails?.customerName}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm hidden md:table-cell">
                      {quot.customerDetails?.customerCompanyName}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-right font-semibold text-xs sm:text-sm">
                      ₹{quot.totals?.grandTotal?.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                      {new Date(quot.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                        {quot.pdfGridFSId && quot.pdfFilename ? (
                          <>
                            <button
                              onClick={() => window.open(`${API_BASE_URL}/api/quotations/pdf/${quot.pdfGridFSId}`, '_blank')}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs w-full sm:w-auto"
                            >
                              📄 View
                            </button>
                            <button
                              onClick={() => handleDeletePDF(quot.pdfGridFSId, '/api/quotations/pdf', 'Quotation')}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs w-full sm:w-auto"
                              title="Delete PDF"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No PDF</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proforma Invoices */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
          📋 Proforma Invoices ({proformas.length})
        </h3>
        {proformas.length === 0 ? (
          <p className="text-gray-500 italic">No proforma invoices found</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
              <thead className="bg-green-100">
                <tr>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Proforma #</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm hidden sm:table-cell">Quotation #</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Customer</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-right text-xs sm:text-sm">Total</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Date</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {proformas.map((pf) => (
                  <tr key={pf._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 font-semibold text-green-600 text-xs sm:text-sm">
                      {pf.proformaNumber}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-blue-600 text-xs sm:text-sm hidden sm:table-cell">
                      {pf.quotationNumber}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm">
                      {pf.customerDetails?.customerName}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-right font-semibold text-xs sm:text-sm">
                      ₹{pf.totals?.grandTotal?.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                      {new Date(pf.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                        {pf.pdfGridFSId && pf.pdfFilename ? (
                          <>
                            <button
                              onClick={() => window.open(`${API_BASE_URL}/api/proforma/pdf/${pf.pdfGridFSId}`, '_blank')}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs w-full sm:w-auto"
                            >
                              📄 View
                            </button>
                            <button
                              onClick={() => handleDeletePDF(pf.pdfGridFSId, '/api/proforma/pdf', 'Proforma')}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs w-full sm:w-auto"
                              title="Delete PDF"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No PDF</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Final Invoices */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-purple-600 mb-4 flex items-center">
          🧾 Final Invoices ({invoices.length})
        </h3>
        {invoices.length === 0 ? (
          <p className="text-gray-500 italic">No final invoices found</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
              <thead className="bg-purple-100">
                <tr>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Invoice #</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm hidden sm:table-cell">Quotation #</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Customer</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-right text-xs sm:text-sm">Total</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Date</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 font-semibold text-purple-600 text-xs sm:text-sm">
                      {inv.invoiceNumber}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-blue-600 text-xs sm:text-sm hidden sm:table-cell">
                      {inv.quotationNumber}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm">
                      {inv.customerDetails?.customerName}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-right font-semibold text-xs sm:text-sm">
                      ₹{inv.totals?.grandTotal?.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                      {new Date(inv.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                        {inv.pdfGridFSId && inv.pdfFilename ? (
                          <>
                            <button
                              onClick={() => window.open(`${API_BASE_URL}/api/finalinvoices/pdf/${inv.pdfGridFSId}`, '_blank')}
                              className="bg-purple-500 hover:bg-purple-600 text-white px-2 sm:px-3 py-1 rounded text-xs w-full sm:w-auto"
                            >
                              📄 View
                            </button>
                            <button
                              onClick={() => handleDeletePDF(inv.pdfGridFSId, '/api/finalinvoices/pdf', 'Invoice')}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs w-full sm:w-auto"
                              title="Delete PDF"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No PDF</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={fetchAllDocuments}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default DocumentList;
