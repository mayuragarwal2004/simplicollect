import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { usePaymentData } from './PaymentDataContext';
import { axiosInstance } from '../../../utils/config';
import { toast } from 'react-toastify';

const PackageFinalAmountInput = ({ setStep, handlePackagePayModalClose }) => {
  const {
    paymentData: {
      selectedPackage,
      chapterMeetings,
      receivers,
      selectedReceiver,
      paymentProof,
      paymentDate,
      selectedReceiverObject,
      receiverFeeAmount,
      platformFeeAmount,
      totalPayableAmount,
    },
    fetchAllData,
  } = usePaymentData();
  const [currentPayment, setCurrentPayment] = useState(totalPayableAmount);
  const netBalance = currentPayment - totalPayableAmount;
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    let paymentProofLink = '';

    // upload image at /api/image-upload and get link
    if (paymentProof) {
      const paymentProofForm = new FormData();
      paymentProofForm.append('image', paymentProof);
      paymentProofForm.append('folderName', 'memberPaymentProofs');
      paymentProofLink = await axiosInstance
        .post('/api/image-upload', paymentProofForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('Payment Proof Uploaded:', response.data);
          return response.data.imageUrl;
        });

      console.log('Payment Proof Link:', paymentProofLink);
    }

    const paymentDetails = {
      packageId: selectedPackage.packageId,
      meetingIds: selectedPackage.meetingIds,

      paidAmount: currentPayment,
      payableAmount: totalPayableAmount,
      originalPayableAmount: parseFloat(selectedPackage.packageFeeAmount),
      discountAmount: selectedPackage.discountAmount,
      penaltyAmount: selectedPackage.penaltyAmount,
      receiverFee: receiverFeeAmount,
      amountPaidToChapter:
        (parseFloat(currentPayment) || 0) -
        (parseFloat(platformFeeAmount) || 0) -
        (parseFloat(receiverFeeAmount) || 0),
      amountExpectedToChapter: selectedPackage.totalAmount,
      platformFee: platformFeeAmount,
      balanceAmount: netBalance,

      paymentType: selectedReceiverObject?.paymentType,
      paymentDate: paymentDate,
      paymentImageLink: paymentProofLink,
      paymentReceivedById: selectedReceiverObject?.memberId || '',
      paymentReceivedByName: selectedReceiverObject?.receiverName || '',
    };
    const response = await axiosInstance
      .post('/api/payment/addPayment', paymentDetails)
      .then((response) => {
        console.log('Payment submitted:', {
          selectedReceiver,
          paymentProof,
          paymentDate,
          paymentType: receivers.find(
            (receiver) => receiver.receiverId === selectedReceiver,
          )?.paymentType,
        });
        fetchAllData(); // Notify parent component of successful payment
        handlePackagePayModalClose();
        toast.success('Payment submitted successfully');
      })
      .catch((error) => {
        console.error('Error submitting payment:', error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Total Payable Amount: ₹{totalPayableAmount}
      </h2>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-700">
          Enter Amount to Pay:
        </h3>
        <input
          type="number"
          value={currentPayment}
          onChange={(e) => {
            let val = Number(e.target.value);
            if (val < 0) val = 0;
            setCurrentPayment(val);
          }}
          className="w-full p-2 border border-gray-300 rounded text-center"
        />
      </div>

      {currentPayment === totalPayableAmount ? (
        <h3 className="text-xl font-semibold text-green-700">
          You have paid the exact amount
        </h3>
      ) : currentPayment < totalPayableAmount ? (
        <h3 className="text-xl font-semibold text-red-700">
          You will be due by ₹{Math.abs(netBalance)}
        </h3>
      ) : (
        <h3 className="text-xl font-semibold text-green-700">
          You will pay advance of ₹{Math.abs(netBalance)}
        </h3>
      )}

      {/* Add the text "Amount will be received by: name" */}
      <h5 className="text-sm font-semibold text-gray-700">
        Amount will be received by: {selectedReceiverObject?.receiverName}
      </h5>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <div className="flex justify-between mt-2">
          <Button variant="outline" onClick={() => setStep(2)}>
            <ChevronLeft />
            Back
          </Button>
          <Button onClick={() => setShowConfirm(true)}>Confirm</Button>
        </div>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm payment of ₹{currentPayment}?
              {currentPayment > totalPayableAmount && (
                <div className="mt-2 text-green-700 font-semibold">
                  (You are paying ₹{Math.abs(netBalance)} advance)
                </div>
              )}
              {currentPayment < totalPayableAmount && (
                <div className="mt-2 text-red-700 font-semibold">
                  (You will be due by ₹{Math.abs(netBalance)})
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className="flex items-center justify-center"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PackageFinalAmountInput;
