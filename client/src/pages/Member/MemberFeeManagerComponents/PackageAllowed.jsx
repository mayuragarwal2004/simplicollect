import React, { useState } from "react";
import Box from "@mui/material/Box";
import AcceptPaymentMember from "./AcceptPaymentMember"; // Import the new component

const PackageAllowed = ({ packageData, parentType, chapterMeetings }) => {
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false); // State for "Show Unpaid Only"
  const [selectedPackage, setSelectedPackage] = useState(null); // Track selected package for payment

  // Helper function to calculate total amounts with penalties or discounts
  const calculateDisplayAmounts = (pkg) => {
    const today = new Date();
    const payableEndDate = new Date(pkg.packagePayableEndDate);
    const discountEndDate = new Date(pkg.discountEndDate);

    let totalAmount = pkg.packageFeeAmount;
    let penaltyAmount = 0;
    let discountAmount = 0;

    // Calculate penalties and discounts (same as before)
    // ...

    // Calculate paid fees for meetings included in the package
    let paidFees = 0;
    const paidMeetings = [];
    if (pkg.allowPackagePurchaseIfFeesPaid && pkg.meetingIds) {
      paidFees = pkg.meetingIds.reduce((sum, meetingId) => {
        const meeting = chapterMeetings.find((m) => m.meetingId === meetingId);
        if (meeting && meeting.isPaid) {
          paidMeetings.push({
            meetingId: meeting.meetingId,
            meetingDate: meeting.meetingDate,
            meetingFeeMembers: meeting.meetingFeeMembers,
          });
          return sum + meeting.meetingFeeMembers;
        }
        return sum;
      }, 0);
    }

    totalAmount = totalAmount + penaltyAmount - discountAmount - paidFees;
    return { totalAmount, penaltyAmount, discountAmount, paidFees, paidMeetings };
  };

  // Handle "Pay" button click
  const handlePayClick = (pkg) => {
    setSelectedPackage(pkg); // Show payment card for the selected package
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setSelectedPackage(null); // Close payment card
    // Optionally, update the package or meeting data to reflect the payment
  };

  // Filter packages based on the "Show Unpaid Only" checkbox
  const filteredPackages = packageData
    .filter((pkg) => pkg.packageParent === parentType)
    .filter((pkg) => !showUnpaidOnly || !pkg.isPaid); // Show unpaid only if `showUnpaidOnly` is true

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

      {/* Package List */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredPackages.map((pkg) => {
          const { totalAmount, penaltyAmount, discountAmount, paidFees, paidMeetings } =
            calculateDisplayAmounts(pkg);

          return (
            <div
              key={pkg.packageId}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg"
            >
              <h2 className="text-xl font-bold mb-2">{pkg.packageName}</h2>
              <p className="text-gray-700 mb-1">
                {`₹${pkg.packageFeeAmount}`}
                {penaltyAmount > 0 && (
                  <span className="text-red-500"> + ₹{penaltyAmount}</span>
                )}
                {discountAmount > 0 && (
                  <span className="text-green-500"> - ₹{discountAmount}</span>
                )}
                {paidFees > 0 && (
                  <span className="text-blue-500"> - ₹{paidFees}</span>
                )}
                = ₹{totalAmount}
              </p>
              <p className="text-gray-700 mb-1">
                Payable End Date: {pkg.packagePayableEndDate}
              </p>
              <button
                onClick={() => handlePayClick(pkg)}
                className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700`}
              >
                Pay
              </button>
            </div>
          );
        })}
      </Box>

      {/* Payment Card */}
      {selectedPackage && (
        <AcceptPaymentMember
          totalFees={selectedPackage.packageFeeAmount}
          penaltyAmount={selectedPackage.penaltyAmount}
          discountAmount={selectedPackage.discountAmount}
          paidFees={calculateDisplayAmounts(selectedPackage).paidFees}
          paidMeetings={calculateDisplayAmounts(selectedPackage).paidMeetings} // Pass paid meetings
          meetingIds={selectedPackage.meetingIds}
          onClose={() => setSelectedPackage(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PackageAllowed;