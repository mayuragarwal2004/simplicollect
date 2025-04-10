import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import formatDateDDMMYYYY from '../../../utils/dateUtility';
import PackagePayMain from './PackagePayMain';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePaymentData } from './PaymentDataContext';

const PackageCard = ({
  pendingPayments,
  parentType,
  paymentSuccessHandler,
}) => {
  const {
    paymentData: { receivers, chapterMeetings, packageParents,selectedPackage, packageData },
    resetPaymentData,
    setPaymentData,
  } = usePaymentData();
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  console.log('From PackageCard', { receivers });

  const handlePackagePayModalClose = () => {
    console.log('Triggered handlePackagePayModalClose');

    resetPaymentData();

    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedPackage) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [selectedPackage]);

  console.log({ selectedPackage });

  // Helper function to check if any meetings within the package are paid
  const hasOverlappingPayments = (pkg) => {
    return pkg.meetingIds?.some((meetingId) => {
      const meeting = chapterMeetings.find((m) => m.meetingId === meetingId);
      return meeting && meeting.isPaid;
    });
  };

  // Helper function to calculate unpaid fees from earlier packages
  const calculateUnpaidFeesFromEarlierPackages = (currentPackage) => {
    const currentPackageIndex = packageData.findIndex(
      (pkg) => pkg.packageId === currentPackage.packageId,
    );
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
      return {
        totalAmount: null,
        penaltyAmount: null,
        discountAmount: null,
        isDisabled: true,
      };
    }

    // Calculate penalty and discount as before
    let totalAmount = pkg.packageFeeAmount;
    let penaltyAmount = 0;
    let discountAmount = 0;

    const getDuration = (type, days) => {
      switch (type) {
        case 'Daily':
          return days;
        case 'Weekly':
          return Math.ceil(days / 7);
        case 'Monthly':
          return Math.ceil(days / 30);
        case 'Quarterly':
          return Math.ceil(days / 90);
        case 'lumpsum':
        case 'Meetingly':
          return 1; // Fixed for meeting-based penalty/discount
        default:
          return 0;
      }
    };

    // Calculate discount
    if (calculationDate <= new Date(pkg.discountEndDate)) {
      const daysRemainingForDiscount = Math.ceil(
        (new Date(pkg.discountEndDate) - calculationDate) /
          (1000 * 60 * 60 * 24),
      );
      discountAmount =
        getDuration(pkg.discountType, daysRemainingForDiscount) *
        pkg.discountAmount;
    }

    // Calculate penalty
    if (
      calculationDate > payableEndDate &&
      pkg.allowPenaltyPayableAfterEndDate
    ) {
      const daysExceededForPenalty = Math.ceil(
        (calculationDate - payableEndDate) / (1000 * 60 * 60 * 24),
      );
      penaltyAmount =
        getDuration(pkg.penaltyType, daysExceededForPenalty) *
        pkg.penaltyAmount;
    }

    // Adjust based on already paid meetings
    let adjustedPackageFee = totalAmount + penaltyAmount - discountAmount;
    let paidFees = 0;

    paidFees = Array.isArray(pkg.meetingIds)
      ? pkg.meetingIds.reduce((sum, meetingId) => {
          const meeting = chapterMeetings.find(
            (m) => m.meetingId === meetingId,
          );
          return (
            sum + (meeting && meeting.isPaid ? meeting.meetingFeeMembers : 0)
          );
        }, 0)
      : 0;

    // Add unpaid fees from earlier packages
    const unpaidFeesFromEarlierPackages =
      calculateUnpaidFeesFromEarlierPackages(pkg);
    adjustedPackageFee += unpaidFeesFromEarlierPackages;

    // Add service fee (2.5%)
    const serviceFee = adjustedPackageFee * 0.025;
    const totalPayableAmount = adjustedPackageFee + serviceFee;

    // setPackageData((prevData) =>
    //   prevData.map((p) =>
    //     p.packageId === pkg.packageId
    //       ? {
    //           ...p,
    //           totalAmount: totalPayableAmount,
    //           penaltyAmount,
    //           discountAmount,
    //           paidFees,
    //           unpaidFeesFromEarlierPackages,
    //           serviceFee,
    //           isDisabled:
    //             (!pkg.allowAfterEndDate && calculationDate > payableEndDate) ||
    //             (!pkg.allowPackagePurchaseIfFeesPaid &&
    //               hasOverlappingPayments(pkg)),
    //         }
    //       : p,
    //   ),
    // );

    return {
      totalAmount: totalPayableAmount,
      penaltyAmount,
      discountAmount,
      paidFees,
      unpaidFeesFromEarlierPackages,
      serviceFee,
      isDisabled:
        (!pkg.allowAfterEndDate && calculationDate > payableEndDate) ||
        (!pkg.allowPackagePurchaseIfFeesPaid && hasOverlappingPayments(pkg)),
    };
  };

  const handlePayClick = (pkg) => {
    setIsModalOpen(true);
    setPaymentData((prev) => {
      return {
        ...prev,
        selectedPackage: pkg,
        lastSelectedPackageTime: new Date(),
      };
    });
  };

  const handlePaymentSuccess = () => {
    paymentSuccessHandler();
  };

  const filteredPackages = packageData
    .filter((pkg) => pkg.packageParent === parentType)
    .filter((pkg) => !showUnpaidOnly || !pkg.isPaid);

  return (
    <div>
      {/* Filters: Show Unpaid Only, DatePicker */}
      <div className="flex justify-between items-center p-4">
        {/* Right Side: Show Unpaid Only */}
        <div className="flex justify-end hidden">
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
          // const {
          //   totalAmount,
          //   penaltyAmount,
          //   discountAmount,
          //   unpaidFeesFromEarlierPackages,
          //   serviceFee,
          //   isDisabled,
          // } = calculateDisplayAmounts(pkg);
          return (
            <div
              key={pkg.packageId}
              className={`bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg ${
                pkg.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <h2 className="text-xl font-bold mb-2">{pkg.packageName}</h2>
              {!pkg.isDisabled &&
              pkg.totalAmount !== null &&
              pkg.status !== 'approved' ? (
                <>
                  <p className="text-gray-700 mb-1">
                    {`₹${pkg.packageFeeAmount}`}
                    {pkg.penaltyAmount > 0 && (
                      <span className="text-red-500">
                        {' '}
                        + ₹{pkg.penaltyAmount}
                      </span>
                    )}
                    {pkg.discountAmount > 0 && (
                      <span className="text-green-500">
                        {' '}
                        - ₹{pkg.discountAmount}
                      </span>
                    )}
                    {pkg.previousBalance !== 0 && (
                      <span className={`text-orange-500`}>
                        {' '}
                        {pkg.previousBalance > 0 ? '-' : '+'} ₹
                        {pkg.previousBalance} (
                        {pkg.previousBalance > 0 ? 'Advance' : 'Previous Due'})
                      </span>
                    )}
                    {/* {pkg.unpaidFeesFromEarlierPackages > 0 && (
                      <span className="text-orange-500">
                        {' '}
                        + ₹{pkg.unpaidFeesFromEarlierPackages} (Unpaid Fees)
                      </span>
                    )} */}
                    {/* {pkg.serviceFee > 0 && (
                      <span className="text-purple-500">
                        {' '}
                        + ₹{pkg.serviceFee} (Service Fee)
                      </span>
                    )} */}
                    = ₹{pkg.totalAmount}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Payable End Date:{' '}
                    {formatDateDDMMYYYY(pkg.packagePayableEndDate)}
                  </p>
                  <Button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    variant="contained"
                    onClick={() => handlePayClick(pkg)}
                    disabled={pkg.isDisabled || pendingPayments?.length > 0}
                  >
                    Pay Now
                  </Button>
                </>
              ) : pkg.status === 'approved' ? (
                <>
                  <div>
                    You have paid ₹{pkg.paidAmount} for this package on{' '}
                    {new Date(pkg.paymentDate).toLocaleDateString()}
                  </div>
                </>
              ) : (
                <p className="text-gray-700 mb-1">Payment Not Allowed</p>
              )}
            </div>
          );
        })}
      </Box>

      {/* Payment Component */}
      {selectedPackage && receivers && (
        <Dialog open={isModalOpen} onOpenChange={handlePackagePayModalClose}>
          <DialogTrigger />
          <DialogContent className="sm:max-w-[425px] p-4 max-w-[90%] rounded-lg">
            <PackagePayMain
              selectedPackage={selectedPackage}
              pendingPayments={pendingPayments}
              packageData={packageData}
              paymentSuccessHandler={paymentSuccessHandler}
              parentType={parentType}
              chapterMeetings={chapterMeetings}
              receivers={receivers}
              handlePackagePayModalClose={handlePackagePayModalClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PackageCard;
