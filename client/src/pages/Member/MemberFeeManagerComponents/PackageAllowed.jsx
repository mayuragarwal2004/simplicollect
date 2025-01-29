import React from "react";
import Box from "@mui/material/Box";

const PackageAllowed = ({ packageData, parentType, chapterMeetings }) => {
  // Helper function to check if any meetings within the package date range are paid
  const hasOverlappingPayments = (pkg) => {
    const packageStartDate = new Date(pkg.startDate);
    const packageEndDate = new Date(pkg.endDate);

    return chapterMeetings.some((meeting) => {
      const meetingDate = new Date(meeting.meetingDate);
      return (
        meetingDate >= packageStartDate &&
        meetingDate <= packageEndDate &&
        meeting.isPaid
      );
    });
  };

  // Helper function to calculate total amounts with penalties or discounts
  const calculateDisplayAmounts = (pkg) => {
    const today = new Date();
    const payableEndDate = new Date(pkg.packagePayableEndDate);
    const discountEndDate = new Date(pkg.discountEndDate);

    let totalAmount = pkg.packageFeeAmount;
    let penaltyAmount = 0;
    let discountAmount = 0;

    // Calculate the number of days remaining or exceeded
    const timeDifferenceDiscount = discountEndDate - today;
    const daysRemainingForDiscount = Math.ceil(
      timeDifferenceDiscount / (1000 * 60 * 60 * 24)
    );

    const timeDifferencePenalty = today - payableEndDate;
    const daysExceededForPenalty = Math.ceil(
      timeDifferencePenalty / (1000 * 60 * 60 * 24)
    );

    // Apply discount logic
    if (today <= discountEndDate) {
      switch (pkg.discountType) {
        case "Daily":
          discountAmount = daysRemainingForDiscount * pkg.discountAmount;
          break;
        case "Weekly":
          discountAmount =
            Math.ceil(daysRemainingForDiscount / 7) * pkg.discountAmount;
          break;
        case "Monthly":
          discountAmount =
            Math.ceil(daysRemainingForDiscount / 30) * pkg.discountAmount;
          break;
        case "Quarterly":
          discountAmount =
            Math.ceil(daysRemainingForDiscount / 90) * pkg.discountAmount;
          break;
        case "Meetingly":
          discountAmount = pkg.discountAmount; // Flat discount per meeting
          break;
        default:
          discountAmount = 0;
      }
    }

    // Apply penalty logic
    if (today > payableEndDate && pkg.allowPenaltyPayableAfterEndDate) {
      switch (pkg.penaltyType) {
        case "Daily":
          penaltyAmount = daysExceededForPenalty * pkg.penaltyAmount;
          break;
        case "Weekly":
          penaltyAmount =
            Math.ceil(daysExceededForPenalty / 7) * pkg.penaltyAmount;
          break;
        case "Monthly":
          penaltyAmount =
            Math.ceil(daysExceededForPenalty / 30) * pkg.penaltyAmount;
          break;
        case "Quarterly":
          penaltyAmount =
            Math.ceil(daysExceededForPenalty / 90) * pkg.penaltyAmount;
          break;
        case "Meetingly":
          penaltyAmount = pkg.penaltyAmount; // Flat penalty per meeting
          break;
        default:
          penaltyAmount = 0;
      }
    }

    totalAmount = totalAmount + penaltyAmount - discountAmount;

    return { totalAmount, penaltyAmount, discountAmount };
  };

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {packageData
        .filter((pkg) => pkg.packageParent === parentType)
        .map((pkg) => {
          const isDisabled = hasOverlappingPayments(pkg); // Check for overlapping payments
          const { totalAmount, penaltyAmount, discountAmount } =
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
                = ₹{totalAmount}
              </p>
              <p className="text-gray-700 mb-1">
                Payable End Date: {pkg.packagePayableEndDate}
              </p>
              <button
                className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isDisabled}
              >
                {isDisabled ? "Already Paid (Per Meeting)" : "Pay Now"}
              </button>
            </div>
          );
        })}
    </Box>
  );
};

export default PackageAllowed;