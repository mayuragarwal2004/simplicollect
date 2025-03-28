import React, { useState, useEffect } from 'react';
import {
  Check,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { axiosInstance } from '../../../utils/config';
import formatDateDDMMYYYY from '../../../utils/dateUtility';
import { usePaymentData } from './PaymentDataContext';
import { Button } from '@/components/ui/button';
const PaymentOverview = ({ onClose, onPaymentSuccess, setStep }) => {
  const {
    paymentData: {
      selectedPackage,
      chapterMeetings,
      receivers,
      selectedReceiver,
    },
  } = usePaymentData();

  console.log({ selectedPackage });

  const [paymentProof, setPaymentProof] = useState(null); // Online payment proof
  const [paymentDate] = useState(new Date().toLocaleDateString()); // Current date
  const [showMeetings, setShowMeetings] = useState(false); // Toggle meeting details
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [amountPaid, setAmountPaid] = useState(selectedPackage.totalAmount); // Amount paid by the member
  const [minimumPayable, setMinimumPayable] = useState(0); // Minimum payable amount

  useEffect(() => {
    if (selectedPackage.meetingIds && chapterMeetings) {
      console.log('Hi mayur');
      console.log(selectedPackage.meetingIds);
      console.log(typeof selectedPackage.meetingIds);
      console.log(chapterMeetings.map((meeting) => meeting.meetingId));

      console.log('Hi mayur');

      const filteredMeetings = chapterMeetings.filter((meeting) =>
        selectedPackage.meetingIds.includes(meeting.meetingId),
      );
      setSelectedMeetings(filteredMeetings);
    }
  }, [selectedPackage.meetingIds, chapterMeetings]);

  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handlePaymentSubmit = async () => {
    const dueAmount = selectedPackage.totalAmount - amountPaid;
    const advanceAmount = amountPaid - dueAmount;
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
      payableAmount: selectedPackage.totalAmount,
      paymentAmount: amountPaid,
      dueAmount: dueAmount,
      paymentType: receivers.find(
        (receiver) => receiver.receiverId === selectedReceiver,
      )?.paymentType,
      paymentDate: paymentDate,
      paymentImageLink: paymentProofLink,
      paymentReceivedById:
        receivers.find((receiver) => receiver.receiverId === selectedReceiver)
          ?.memberId || '',
      paymentReceivedByName:
        receivers.find((receiver) => receiver.receiverId === selectedReceiver)
          ?.receiverName || '',
    };
    const response = await axiosInstance
      .post('/api/payment/addPayment', paymentDetails)
      .then((response) => {
        console.log('Payment submitted:', {
          selectedReceiver,
          paymentProof,
          paymentDate,
          amountPaid,
          dueAmount,
          paymentType: receivers.find(
            (receiver) => receiver.receiverId === selectedReceiver,
          )?.paymentType,
        });
        onPaymentSuccess(); // Notify parent component of successful payment
      })
      .catch((error) => {
        console.error('Error submitting payment:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Payment Overview
        </h2>

        {/* Total Fees Summary */}
        <div className="border p-4 rounded-lg mb-4 bg-gray-50">
          <p className="text-gray-700 font-semibold text-lg">
            Total Payable Amount:
          </p>
          <p className="text-3xl font-bold text-blue-600">
            ₹{selectedPackage.totalAmount}
          </p>
          <div className="text-sm text-gray-600 mt-2">
            <p>₹{selectedPackage.packageFeeAmount} (Original Amount)</p>
            {selectedPackage.penaltyAmount > 0 && (
              <p className="text-red-500">
                + ₹{selectedPackage.penaltyAmount} (Penalty)
              </p>
            )}
            {selectedPackage.discountAmount > 0 && (
              <p className="text-green-500">
                - ₹{selectedPackage.discountAmount} (Discount)
              </p>
            )}
            {selectedPackage.previousDue !== 0 && (
              <p className="text-orange-500">
                {' '}
                + ₹{selectedPackage.previousDue} (
                {selectedPackage.previousDue > 0 ? 'Advance' : 'Previous Due'})
              </p>
            )}
            {selectedPackage.paidFees > 0 && (
              <p className="text-blue-500">
                - ₹{selectedPackage.paidFees} (Paid Previously)
              </p>
            )}
            {/* {selectedPackage.unpaidFeesFromEarlierPackages > 0 && (
              <p className="text-orange-500">
                + ₹{selectedPackage.unpaidFeesFromEarlierPackages} (Unpaid Fees)
              </p>
            )} */}
            {/* {selectedPackage.gatewayFee > 0 && (
              <p className="text-purple-500">+ ₹{selectedPackage.gatewayFee} (Gateway Fee)</p>
            )} */}
          </div>
        </div>

        {/* Meetings Included */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Meetings Included:</p>
          <button
            onClick={() => setShowMeetings(!showMeetings)}
            className="flex items-center text-lg font-medium text-blue-500 hover:underline focus:outline-none"
          >
            {selectedMeetings.length} Meetings
            {showMeetings ? (
              <ChevronUp className="ml-2" size={18} />
            ) : (
              <ChevronDown className="ml-2" size={18} />
            )}
          </button>
          {showMeetings && (
            <div className="mt-2 max-h-[200px] overflow-y-auto">
              {selectedMeetings.length > 0 ? (
                selectedMeetings?.map((meeting) => (
                  <div
                    key={meeting.meetingId}
                    className={`border p-2 rounded mb-2 ${
                      meeting.isPaid ? 'bg-green-100' : ''
                    }`}
                  >
                    <p>
                      <strong>{meeting.meetingName}</strong>
                    </p>
                    <p>
                      {formatDateDDMMYYYY(meeting.meetingDate)} at{' '}
                      {meeting.meetingTime}
                    </p>
                    {meeting.isPaid && (
                      <p className="text-green-500 font-semibold">Paid</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No meetings found</p>
              )}
            </div>
          )}
        </div>
        <div>
          You are paying to{' '}
          {
            receivers.find((r) => r.receiverId === selectedReceiver)
              ?.receiverName
          }
          .{' '}
          <p
            className="text-blue-500 cursor-pointer"
            onClick={() => setStep(1)}
          >
            Click here to change receiver.
          </p>
        </div>

        <div className="flex justify-between mt-2">
          <Button variant="outline" onClick={() => setStep(1)}>
            <ChevronLeft />
            Back
          </Button>
          <Button onClick={() => setStep(3)}>
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;
