import React, { useState } from "react";
import Box from "@mui/material/Box";
import AcceptPaymentMember from "./AcceptPaymentMember";

const PackageAllowed = ({ packageData, parentType, chapterMeetings }) => {
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Helper function to check if any meetings within the package are paid
  const hasOverlappingPayments = (pkg) => {
    return pkg.meetingIds?.some((meetingId) => {
      const meeting = chapterMeetings.find((m) => m.meetingId === meetingId);
      return meeting && meeting.isPaid;
    });
  };

  // Helper function to calculate total amounts with penalties or discounts
  const calculateDisplayAmounts = (pkg) => {
    if (pkg.isDisabled) return { totalAmount: null, penaltyAmount: null, discountAmount: null };

    const today = new Date();
    const payableEndDate = new Date(pkg.packagePayableEndDate);
    const discountEndDate = new Date(pkg.discountEndDate);

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
    if (today <= discountEndDate) {
      const daysRemainingForDiscount = Math.ceil((discountEndDate - today) / (1000 * 60 * 60 * 24));
      discountAmount = getDuration(pkg.discountType, daysRemainingForDiscount) * pkg.discountAmount;
    }

    // Calculate penalty
    if (today > payableEndDate && pkg.allowPenaltyPayableAfterEndDate) {
      const daysExceededForPenalty = Math.ceil((today - payableEndDate) / (1000 * 60 * 60 * 24));
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

    return { totalAmount: adjustedPackageFee, penaltyAmount, discountAmount, paidFees };
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
      {/* Show Unpaid Only Checkbox */}
      <div className="flex justify-end p-4">
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

      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredPackages.map((pkg) => {
          const isDisabled =
            !pkg.allowPackagePurchaseIfFeesPaid && hasOverlappingPayments(pkg);
          const { totalAmount, penaltyAmount, discountAmount } =
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
                    = ₹{totalAmount}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Payable End Date: {pkg.packagePayableEndDate}
                  </p>
                  <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={() => handlePayClick(pkg)}
                  >
                    Pay Now
                  </button>
                </>
              ) : (
                <p className="text-gray-700 mb-1">Already Paid (Per Meeting)</p>
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
          meetingIds={selectedPackage.meetingIds}
          onClose={() => setSelectedPackage(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PackageAllowed;
