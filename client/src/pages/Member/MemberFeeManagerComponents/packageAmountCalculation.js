

const packageAmountCalculations = (
  calculationDate,
  pkg,
  chapterMeetings,
  previousDue,
) => {
  const payableEndDate = new Date(pkg.packagePayableEndDate);

  if (typeof pkg.meetingIds === 'string') {
    pkg.meetingIds = JSON.parse(pkg.meetingIds);
  }

  if (pkg.status === 'pending') {
    return {
      message: 'You have applied for this package. Please wait for approval',
      totalAmount: null,
      penaltyAmount: null,
      discountAmount: null,
      isDisabled: true,
    };
  } else if (pkg.status === 'rejected') {
    return {
      message: 'Your package application has been rejected',
      totalAmount: null,
      penaltyAmount: null,
      discountAmount: null,
      isDisabled: true,
    };
  } else if (pkg.status === 'approved') {
    return {
      message: 'Your package application has been approved',
      totalAmount: null,
      penaltyAmount: null,
      discountAmount: null,
      isDisabled: true,
    };
  }

  if (
    pkg.packagePayableStartDate &&
    calculationDate < new Date(pkg.packagePayableStartDate)
  ) {
    return {
      message: 'Package is not open to payable yet',
      totalAmount: null,
      penaltyAmount: null,
      discountAmount: null,
      isDisabled: true,
    };
  }

  // Disable package if allowAfterEndDate is false and calculationDate is after payableEndDate
  if (!pkg.allowAfterEndDate && calculationDate > payableEndDate) {
    return {
      message: 'Package is not open to payable anymore',
      totalAmount: null,
      penaltyAmount: null,
      discountAmount: null,
      isDisabled: true,
    };
  }

  if (pkg.allowPackagePurchaseIfFeesPaid) {
    if (hasOverlappingPayments(pkg, chapterMeetings)) {
      return {
        message: 'Package has overlapping payments',
        totalAmount: null,
        penaltyAmount: null,
        discountAmount: null,
        isDisabled: true,
      };
    }
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
      (new Date(pkg.discountEndDate) - calculationDate) / (1000 * 60 * 60 * 24),
    );
    discountAmount =
      getDuration(pkg.discountType, daysRemainingForDiscount) *
      pkg.discountAmount;
  }

  // Calculate penalty
  if (calculationDate > payableEndDate && pkg.allowPenaltyPayableAfterEndDate) {
    const daysExceededForPenalty = Math.ceil(
      (calculationDate - payableEndDate) / (1000 * 60 * 60 * 24),
    );
    penaltyAmount =
      getDuration(pkg.penaltyType, daysExceededForPenalty) * pkg.penaltyAmount;
  }

  // Adjust based on already paid meetings
  let adjustedPackageFee = totalAmount + penaltyAmount - discountAmount;
  let paidFees = 0;

  paidFees = Array.isArray(pkg.meetingIds)
    ? pkg.meetingIds.reduce((sum, meetingId) => {
        const meeting = chapterMeetings.find((m) => m.meetingId === meetingId);
        return (
          sum + (meeting && meeting.isPaid ? meeting.meetingFeeMembers : 0)
        );
      }, 0)
    : 0;

  // Add unpaid fees from earlier packages
  //   const unpaidFeesFromEarlierPackages =
  //     calculateUnpaidFeesFromEarlierPackages(pkg);
  //   adjustedPackageFee += unpaidFeesFromEarlierPackages;

  // Add service fee (2.5%)
  const serviceFee = adjustedPackageFee * 0;
  const totalPayableAmount = adjustedPackageFee + serviceFee + previousDue;


  return {
    totalAmount: totalPayableAmount,
    penaltyAmount,
    discountAmount,
    paidFees,
    previousDue,
    // unpaidFeesFromEarlierPackages,
    serviceFee,
    isDisabled:
      (!pkg.allowAfterEndDate && calculationDate > payableEndDate)
  };
};

const hasOverlappingPayments = (pkg, chapterMeetings) => {
  return pkg.meetingIds?.some((meetingId) => {
    const meeting = chapterMeetings.find((m) => m.meetingId === meetingId);
    return meeting && meeting.isPaid;
  });
};


export default packageAmountCalculations;
