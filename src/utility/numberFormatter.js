// utils/numberFormatter.js

// Format number in Indian number system (k for thousands, L for lakhs, Cr for crores)
const formatIndianNumber = (num) => {
  if (!num || num === 0) return '0';
  
  const number = parseFloat(num);
  
  if (number < 1000) {
    return number.toString();
  } else if (number < 100000) {
    // Thousands (k)
    const thousands = number / 1000;
    if (thousands < 10) {
      return `${thousands.toFixed(1)}k`;
    } else {
      return `${Math.floor(thousands)}k`;
    }
  } else if (number < 10000000) {
    // Lakhs (L)
    const lakhs = number / 100000;
    if (lakhs < 10) {
      return `${lakhs.toFixed(1)}L`;
    } else {
      return `${Math.floor(lakhs)}L`;
    }
  } else {
    // Crores (Cr)
    const crores = number / 10000000;
    if (crores < 10) {
      return `${crores.toFixed(1)}Cr`;
    } else {
      return `${Math.floor(crores)}Cr`;
    }
  }
};

// Format number with currency symbol
const formatCurrency = (num, currency = '₹') => {
  const formattedNumber = formatIndianNumber(num);
  return `${currency}${formattedNumber}`;
};

// Alternative international formatting (for reference)
const formatInternationalNumber = (num) => {
  if (!num || num === 0) return '0';
  
  const number = parseFloat(num);
  
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    // Thousands (K)
    const thousands = number / 1000;
    if (thousands < 10) {
      return `${thousands.toFixed(1)}K`;
    } else {
      return `${Math.floor(thousands)}K`;
    }
  } else if (number < 1000000000) {
    // Millions (M)
    const millions = number / 1000000;
    if (millions < 10) {
      return `${millions.toFixed(1)}M`;
    } else {
      return `${Math.floor(millions)}M`;
    }
  } else {
    // Billions (B)
    const billions = number / 1000000000;
    if (billions < 10) {
      return `${billions.toFixed(1)}B`;
    } else {
      return `${Math.floor(billions)}B`;
    }
  }
};

module.exports = {
  formatIndianNumber,
  formatCurrency,
  formatInternationalNumber
};
