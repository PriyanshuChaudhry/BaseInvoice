import React, { useState } from 'react';
import QuotationForm from './components/QuotationForm';
import ProformaForm from './components/ProformaForm';
import FinalInvoiceForm from './components/FinalInvoiceForm';
import DocumentList from './components/DocumentList';

function App() {
  const [activeTab, setActiveTab] = useState('quotation');
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: 'quotation', label: '📄 Create Quotation', color: 'blue' },
    { id: 'proforma', label: '📋 Create Proforma Invoice', color: 'green' },
    { id: 'invoice', label: '🧾 Create Final Invoice', color: 'purple' },
    { id: 'list', label: '📚 View All Documents', color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
            <img 
              src="/favicon.ico" 
              alt="BaseInvoice Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              onError={(e) => e.target.style.display = 'none'}
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BaseInvoice
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">
            Professional Invoice & Quotation Management System
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-4 md:mb-6 p-2">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'list') {
                    setRefreshKey(prev => prev + 1);
                  }
                }}
                className={`flex-1 min-w-full sm:min-w-[180px] md:min-w-[200px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-500 text-white shadow-lg sm:scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? 
                    (tab.color === 'blue' ? '#3b82f6' : 
                     tab.color === 'green' ? '#10b981' : 
                     tab.color === 'purple' ? '#8b5cf6' : '#f97316') : undefined
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
          {activeTab === 'quotation' && <QuotationForm />}
          {activeTab === 'proforma' && <ProformaForm />}
          {activeTab === 'invoice' && <FinalInvoiceForm />}
          {activeTab === 'list' && <DocumentList key={refreshKey} />}
        </div>
      </div>
    </div>
  );
}

export default App;
