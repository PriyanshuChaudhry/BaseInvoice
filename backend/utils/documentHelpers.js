const Counter = require('../models/Counter');

/**
 * Get current financial year in format "YYYY-YYYY"
 * Financial year in India: April 1 to March 31
 */
const getFinancialYear = () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = today.getFullYear();

  if (currentMonth >= 4) {
    // From April to December
    return `${currentYear}-${currentYear + 1}`;
  } else {
    // From January to March
    return `${currentYear - 1}-${currentYear}`;
  }
};

/**
 * Generate next document number with auto-increment
 * @param {string} type - 'quotation', 'proforma', or 'invoice'
 * @returns {Promise<string>} - Generated document number
 */
const generateDocumentNumber = async (type) => {
  const financialYear = getFinancialYear();
  const prefix = {
    quotation: 'QUT',
    proforma: 'PFI',
    invoice: 'INV'
  };

  // Find and increment counter, or create if doesn't exist
  const counter = await Counter.findOneAndUpdate(
    { type, financialYear },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // Format: PREFIX/FY/SEQUENCE (e.g., QUT/2024-2025/001)
  const sequence = String(counter.sequence).padStart(3, '0');
  return `${prefix[type]}/${financialYear}/${sequence}`;
};

/**
 * Reset counters for testing purposes (use with caution)
 */
const resetCounters = async () => {
  await Counter.deleteMany({});
  console.log('All counters reset');
};

module.exports = {
  getFinancialYear,
  generateDocumentNumber,
  resetCounters
};
