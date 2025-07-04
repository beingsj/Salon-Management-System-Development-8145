/**
 * GST Calculation Utilities for Femina Flaunt
 * Handles both inclusive and exclusive GST calculations
 */

export function calculateGST(price, gstType, gstRate, isSplit = true) {
  const rate = parseFloat(gstRate) || 0;
  const basePrice = parseFloat(price) || 0;

  if (gstType === 'inclusive') {
    // GST is included in the price
    const totalWithGST = basePrice;
    const baseAmount = totalWithGST / (1 + (rate / 100));
    const taxAmount = totalWithGST - baseAmount;

    if (isSplit) {
      // Split into CGST and SGST (for intra-state)
      const cgst = taxAmount / 2;
      const sgst = taxAmount / 2;
      
      return {
        basePrice: parseFloat(baseAmount.toFixed(2)),
        cgstAmount: parseFloat(cgst.toFixed(2)),
        sgstAmount: parseFloat(sgst.toFixed(2)),
        totalTax: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(totalWithGST.toFixed(2))
      };
    } else {
      // IGST (for inter-state)
      return {
        basePrice: parseFloat(baseAmount.toFixed(2)),
        igstAmount: parseFloat(taxAmount.toFixed(2)),
        totalTax: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(totalWithGST.toFixed(2))
      };
    }
  } else {
    // GST is exclusive (added on top)
    const taxAmount = basePrice * (rate / 100);
    const totalWithGST = basePrice + taxAmount;

    if (isSplit) {
      // Split into CGST and SGST
      const cgst = taxAmount / 2;
      const sgst = taxAmount / 2;
      
      return {
        basePrice: parseFloat(basePrice.toFixed(2)),
        cgstAmount: parseFloat(cgst.toFixed(2)),
        sgstAmount: parseFloat(sgst.toFixed(2)),
        totalTax: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(totalWithGST.toFixed(2))
      };
    } else {
      // IGST
      return {
        basePrice: parseFloat(basePrice.toFixed(2)),
        igstAmount: parseFloat(taxAmount.toFixed(2)),
        totalTax: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(totalWithGST.toFixed(2))
      };
    }
  }
}

export function calculateSaleTotal(items, discountAmount = 0) {
  let subtotal = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalTax = 0;

  items.forEach(item => {
    const gstCalc = calculateGST(
      item.price,
      item.gstType || 'inclusive',
      item.gstRate || 18,
      item.isSplit !== false
    );

    subtotal += gstCalc.basePrice * item.quantity;
    
    if (gstCalc.cgstAmount && gstCalc.sgstAmount) {
      totalCGST += gstCalc.cgstAmount * item.quantity;
      totalSGST += gstCalc.sgstAmount * item.quantity;
    } else if (gstCalc.igstAmount) {
      totalIGST += gstCalc.igstAmount * item.quantity;
    }
  });

  totalTax = totalCGST + totalSGST + totalIGST;
  const grandTotal = subtotal + totalTax - discountAmount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    cgstAmount: parseFloat(totalCGST.toFixed(2)),
    sgstAmount: parseFloat(totalSGST.toFixed(2)),
    igstAmount: parseFloat(totalIGST.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    discount: parseFloat(discountAmount.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2))
  };
}

export function getGSTRates() {
  return {
    '0': { rate: 0, description: 'Exempt' },
    '5': { rate: 5, description: 'Essential services' },
    '12': { rate: 12, description: 'Standard services' },
    '18': { rate: 18, description: 'Beauty & wellness services' },
    '28': { rate: 28, description: 'Luxury services' }
  };
}

export function validateGSTIN(gstin) {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
}