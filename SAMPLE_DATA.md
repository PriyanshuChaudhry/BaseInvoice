# Sample Data for Testing

Use this sample data to quickly test the invoice generator:

## Company Details
- **Company Name**: TRUE POWER LIMITED
- **Company Address**: 123, Industrial Area, Phase-1, Sector 44, Gurugram, Haryana - 122001
- **Contact Number**: +91-9876543210
- **Email ID**: info@truepower.com

## Customer Details
- **Customer Name**: Rajesh Kumar
- **Customer Company Name**: Tech Solutions Pvt Ltd
- **Address**: 456, Tech Park, Cyber City, Bengaluru, Karnataka - 560001
- **Contact Number**: +91-9988776655

## Quotation Details
- **Quotation Number**: QT-2025-001
- **Date**: (Use today's date)

## Sample Items

### Item 1
- **Particulars**: Industrial Motor 5HP
- **Quantity**: 10
- **Unit**: Nos
- **Rate**: 15000
- **CGST**: 9
- **SGST**: 9
- **IGST**: 0
- **Amount**: 150000 (auto-calculated)

### Item 2
- **Particulars**: Control Panel Cabinet
- **Quantity**: 5
- **Unit**: Nos
- **Rate**: 8500
- **CGST**: 9
- **SGST**: 9
- **IGST**: 0
- **Amount**: 42500 (auto-calculated)

### Item 3
- **Particulars**: Installation & Setup Service
- **Quantity**: 1
- **Unit**: Set
- **Rate**: 25000
- **CGST**: 9
- **SGST**: 9
- **IGST**: 0
- **Amount**: 25000 (auto-calculated)

## Expected Calculations

- **Taxable Amount**: ₹217,500.00
- **Total CGST (9%)**: ₹19,575.00
- **Total SGST (9%)**: ₹19,575.00
- **Total IGST**: ₹0.00
- **Grand Total**: ₹256,650.00

## Notes

- For **intra-state** transactions: Use CGST + SGST (9% + 9% = 18% total)
- For **inter-state** transactions: Use IGST only (18%)
- The amount column auto-calculates as: Quantity × Rate
- Tax amounts are calculated on the base amount, not included in it
