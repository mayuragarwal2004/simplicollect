import React, { useState } from 'react';
import SelectReceiver from './SelectReceiver';
import PaymentOverview from './PaymentOverview';
import { usePaymentData } from './PaymentDataContext';
import PackageFinalAmountInput from './PackageFinalAmountInput';

// Step 1: Select payment mode and receiver
// Step 2: Payment OverView
// Step 3: Enter Final Amount user is going to pay & pay with Confirm Dialog

const PackagePayMain = ({
  selectedPackage,
  pendingPayments,
  packageData,
  paymentSuccessHandler,
  parentType,
  chapterMeetings,
  handlePackagePayModalClose,
}) => {
  const { receivers } = usePaymentData();
  const [step, setStep] = useState(1);
  const [selectedReceiver, setSelectedReceiver] = useState(null);

  const handlePackagePayModalCloseLocal = () => {
    handlePackagePayModalClose();
  };

  return (
    <div>
      {step === 1 && (
        <SelectReceiver
          selectedReceiver={selectedReceiver}
          setSelectedReceiver={setSelectedReceiver}
          packageData={packageData}
          setStep={setStep}
          handlePackagePayModalClose={handlePackagePayModalClose}
        />
      )}
      {step === 2 && (
        <PaymentOverview
          selectedPackage={selectedPackage}
          pendingPayments={pendingPayments}
          packageData={packageData}
          paymentSuccessHandler={paymentSuccessHandler}
          parentType={parentType}
          chapterMeetings={chapterMeetings}
          receivers={receivers}
          setStep={setStep}
        />
      )}
      {step === 3 && (
        <PackageFinalAmountInput
          setStep={setStep}
          // finalAmount={finalAmount}
          // setFinalAmount={setFinalAmount}
          // onConfirm={() => paymentSuccessHandler(finalAmount)}
          handlePackagePayModalClose={handlePackagePayModalCloseLocal}
        />
      )}
    </div>
  );
};

export default PackagePayMain;
