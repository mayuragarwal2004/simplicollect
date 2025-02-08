import React, { useState } from "react";
import Box from "@mui/material/Box";
import AcceptPaymentMember from "./AcceptPaymentMember";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

const PackageAllowed = ({ packageData, parentType, chapterMeetings }) => {
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [calculationDate, setCalculationDate] = useState(new Date());

  // Helper function to check if any meetings within the package are paid
  const hasOverlappingPayments = (pkg) => {
    return pkg.meetingIds?.some((meetingId) => {
      const meeting = chapterMeetings.find((m) => m.meetingId === meetingId);
      return meeting && meeting.isPaid;
    });
  };

  // Helper function to calculate unpaid fees from earlier packages
  const calculateUnpaidFeesFromEarlierPackages = (currentPackage) => {
    const currentPackageIndex = packageData.findIndex((pkg) => pkg.packageId === currentPackage.packageId);
    let unpaidFees = 0;

    // Loop through earlier packages
    for (let i = 0; i < currentPackageIndex; i++) {
      const earlierPackage = packageData[i];
      if (!earlierPackage.isPaid) {
        unpaidFees += earlierPackage.packageFeeAmount;
      }
    }

    return unpaidFees;
  };

  // Helper function to calculate total amounts with penalties or discounts
  const calculateDisplayAmounts = (pkg) => {
    const payableEndDate = new Date(pkg.packagePayableEndDate);

    // Disable package if allowAfterEndDate is false and calculationDate is after payableEndDate
    if (!pkg.allowAfterEndDate && calculationDate > payableEndDate) {
      return { totalAmount: null, penaltyAmount: null, discountAmount: null, isDisabled: true };
    }

    // Calculate penalty and discount as before
    let totalAmount = pkg.packageFeeAmount;
    let penaltyAmount = 0;
    let discountAmount = 0;

    const getDuration = (type, days) => {
      switch (type) {
        case "Daily":
          return days;
        case "Weekly":
          return Math.ceil(days / 7);
        case "Monthly":
          return Math.ceil(days / 30);
        case "Quarterly":
          return Math.ceil(days / 90);
        case "lumpsum":
        case "Meetingly":
          return 1; // Fixed for meeting-based penalty/discount
        default:
          return 0;
      }
    };

    // Calculate discount
    if (calculationDate <= new Date(pkg.discountEndDate)) {
      const daysRemainingForDiscount = Math.ceil((new Date(pkg.discountEndDate) - calculationDate) / (1000 * 60 * 60 * 24));
      discountAmount = getDuration(pkg.discountType, daysRemainingForDiscount) * pkg.discountAmount;
    }

    // Calculate penalty
    if (calculationDate > payableEndDate && pkg.allowPenaltyPayableAfterEndDate) {
      const daysExceededForPenalty = Math.ceil((calculationDate - payableEndDate) / (1000 * 60 * 60 * 24));
      penaltyAmount = getDuration(pkg.penaltyType, daysExceededForPenalty) * pkg.penaltyAmount;
    }

    // Adjust based on already paid meetings
    let adjustedPackageFee = totalAmount + penaltyAmount - discountAmount;
    let paidFees = 0;

    if (pkg.allowPackagePurchaseIfFeesPaid && pkg.meetingIds) {
      paidFees = pkg.meetingIds.reduce((sum, meetingId) => {
        const meeting = chapterMeetings.find((m) => m.meetingId === meetingId);
        return sum + (meeting && meeting.isPaid ? meeting.meetingFeeMembers : 0);
      }, 0);
      adjustedPackageFee -= paidFees;
    }

    // Add unpaid fees from earlier packages
    const unpaidFeesFromEarlierPackages = calculateUnpaidFeesFromEarlierPackages(pkg);
    adjustedPackageFee += unpaidFeesFromEarlierPackages;

    // Add gateway fee (2.5%)
    const gatewayFee = adjustedPackageFee * 0.025;
    const totalPayableAmount = adjustedPackageFee + gatewayFee;

    return {
      totalAmount: totalPayableAmount,
      penaltyAmount,
      discountAmount,
      paidFees,
      unpaidFeesFromEarlierPackages,
      gatewayFee,
      isDisabled: (!pkg.allowAfterEndDate && calculationDate > payableEndDate) ||
        (!pkg.allowPackagePurchaseIfFeesPaid && hasOverlappingPayments(pkg)),
    };
  };

  const handlePayClick = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handlePaymentSuccess = () => {
    setSelectedPackage(null);
  };

  const filteredPackages = packageData
    .filter((pkg) => pkg.packageParent === parentType)
    .filter((pkg) => !showUnpaidOnly || !pkg.isPaid);

  return (
    <div>
      {/* Filters: Show Unpaid Only, DatePicker */}
      <div className="flex justify-between items-center p-4">
        {/* Left Side: DatePicker */}
        <div className="flex items-center space-x-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Calculation Date"
              value={calculationDate}
              onChange={(newDate) => setCalculationDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>

        {/* Right Side: Show Unpaid Only */}
        <div className="flex justify-end">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showUnpaidOnly}
              onChange={() => setShowUnpaidOnly(!showUnpaidOnly)}
              className="form-checkbox"
            />
            <span>Show Unpaid Only</span>
          </label>
        </div>
      </div>

      {/* Package Cards */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredPackages.map((pkg) => {
          const { totalAmount, penaltyAmount, discountAmount, unpaidFeesFromEarlierPackages, gatewayFee, isDisabled } =
            calculateDisplayAmounts(pkg);

          return (
            <div
              key={pkg.packageId}
              className={`bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <h2 className="text-xl font-bold mb-2">{pkg.packageName}</h2>
              {!isDisabled && totalAmount !== null ? (
                <>
                  <p className="text-gray-700 mb-1">
                    {`₹${pkg.packageFeeAmount}`}
                    {penaltyAmount > 0 && (
                      <span className="text-red-500"> + ₹{penaltyAmount}</span>
                    )}
                    {discountAmount > 0 && (
                      <span className="text-green-500"> - ₹{discountAmount}</span>
                    )}
                    {unpaidFeesFromEarlierPackages > 0 && (
                      <span className="text-orange-500"> + ₹{unpaidFeesFromEarlierPackages} (Unpaid Fees)</span>
                    )}
                    {gatewayFee > 0 && (
                      <span className="text-purple-500"> + ₹{gatewayFee} (Gateway Fee)</span>
                    )}
                    = ₹{totalAmount}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Payable End Date: {pkg.packagePayableEndDate}
                  </p>
                  <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={() => handlePayClick(pkg)}
                    disabled={isDisabled}
                  >
                    Pay Now
                  </button>
                </>
              ) : (
                <p className="text-gray-700 mb-1">Payment Not Allowed</p>
              )}
            </div>
          );
        })}
      </Box>

      {/* Payment Component */}
      {selectedPackage && (
        <AcceptPaymentMember
          totalFees={selectedPackage.packageFeeAmount}
          penaltyAmount={calculateDisplayAmounts(selectedPackage).penaltyAmount}
          discountAmount={calculateDisplayAmounts(selectedPackage).discountAmount}
          paidFees={calculateDisplayAmounts(selectedPackage).paidFees}
          unpaidFeesFromEarlierPackages={calculateDisplayAmounts(selectedPackage).unpaidFeesFromEarlierPackages}
          gatewayFee={calculateDisplayAmounts(selectedPackage).gatewayFee}
          meetingIds={selectedPackage.meetingIds}
          onClose={() => setSelectedPackage(null)}
          onPaymentSuccess={handlePaymentSuccess}
          chapterMeetings={chapterMeetings}
        />
      )}
    </div>
  );
};

export default PackageAllowed;