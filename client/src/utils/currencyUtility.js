// utils/currencyUtility.js

// Format number with Indian comma style (xx,xx,xxx)
const formatIndianCurrency = (amount) => {
  if (!amount && amount !== 0) return '0';
  
  const number = parseFloat(amount);
  if (isNaN(number)) return '0';
  
  // Convert to string and handle decimal part
  const parts = number.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';
  
  // Apply Indian comma formatting
  // First comma after 3 digits from right, then every 2 digits
  const formatted = integerPart.replace(/\B(?=(\d{2})*(\d{3})(?!\d))/g, ',');
  
  return formatted + decimalPart;
};

// Format number with currency symbol and Indian comma style
const formatCurrencyINR = (amount, showSymbol = true) => {
  const formattedAmount = formatIndianCurrency(amount);
  return showSymbol ? `₹${formattedAmount}` : formattedAmount;
};

export { formatIndianCurrency, formatCurrencyINR };