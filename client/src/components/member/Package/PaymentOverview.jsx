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
import { Button } from '@/components/ui/Button';
import { toast } from 'react-toastify';
import QrScanner from 'qr-scanner';
import { useData } from '../../../context/DataContext';

const PaymentOverview = ({ onClose, onPaymentSuccess, setStep }) => {
  const {
    paymentData: {
      selectedPackage,
      chapterMeetings,
      receivers,
      selectedReceiver,
      selectedReceiverObject,
      receiverFeeAmount,
      paymentProof,
      platformFee,
      platformFeeAmount,
      platformFeeType,
    },
    setPaymentData,
  } = usePaymentData();
  const { chapterData } = useData();

  console.log({ selectedPackage });

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

  // Calculate receiver fee
  useEffect(() => {
    if (selectedReceiverObject) {
      if (selectedReceiverObject.receiverAmountType === 'Lumpsum') {
        setPaymentData((prev) => ({
          ...prev,
          receiverFeeAmount: selectedReceiverObject.receiverAmount,
        }));
      } else if (selectedReceiverObject.receiverAmountType === 'Percentage') {
        const receiverFee =
          selectedPackage.totalAmount * selectedReceiverObject.receiverFee;
        setPaymentData((prev) => ({
          ...prev,
          receiverFeeAmount: receiverFee,
        }));
      } else {
        setPaymentData((prev) => ({
          ...prev,
          receiverFeeAmount: 0,
        }));
      }
    }
  }, [selectedReceiverObject, selectedPackage]);

  useEffect(() => {
    if (chapterData) {
      if (chapterData.platformFeeCase !== 'per-payment') {
        setPaymentData((prev) => ({
          ...prev,
          platformFeeAmount: 0,
        }));
      } else if (chapterData.platformFeeType === 'Lumpsum') {
        setPaymentData((prev) => ({
          ...prev,
          platformFeeAmount: chapterData.platformFee,
        }));
      } else if (chapterData.platformFeeType === 'Percentage') {
        const platformFee =
          selectedPackage.totalAmount * chapterData.platformFee;
        setPaymentData((prev) => ({
          ...prev,
          platformFeeAmount: platformFee,
        }));
      } else {
        setPaymentData((prev) => ({
          ...prev,
          platformFeeAmount: 0,
        }));
      }
    }
  }, [chapterData, selectedPackage]);

  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentData((prev) => ({
        ...prev,
        paymentProof: file,
      }));
    }
  };

  console.log({ platformFeeAmount });

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
            ₹
            {parseInt(selectedPackage.totalAmount) +
              (parseInt(receiverFeeAmount) || 0) +
              (parseInt(platformFeeAmount) || 0)}
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
            {selectedPackage.previousBalance !== 0 && (
              <p className="text-orange-500">
                {' '}
                {selectedPackage.previousBalance > 0 ? '-' : '+'} ₹
                {selectedPackage.previousBalance} (
                {selectedPackage.previousBalance > 0
                  ? 'Advance'
                  : 'Previous Due'}
                )
              </p>
            )}
            {selectedPackage.paidFees > 0 && (
              <p className="text-blue-500">
                - ₹{selectedPackage.paidFees} (Paid Previously)
              </p>
            )}
            {receiverFeeAmount > 0 && (
              <p className="text-blue-500">
                + ₹{receiverFeeAmount} (Receiver Fee)
              </p>
            )}
            {platformFeeAmount > 0 && (
              <p className="text-blue-500">
                + ₹{platformFeeAmount} (Platform Fee)
              </p>
            )}
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
          You are paying to {selectedReceiverObject?.receiverName}.
          <p
            className="text-blue-500 cursor-pointer"
            onClick={() => setStep(1)}
          >
            Click here to change receiver.
          </p>
        </div>

        {/* Show QR code, and option to download it, or open it. And option to upload proof */}
        {selectedReceiverObject && selectedReceiverObject.qrImageLink && (
          <div className="mt-4">
            <img
              src={selectedReceiverObject.qrImageLink}
              alt="QR Code"
              className="mb-2 rounded-lg"
            />
            <div className="flex justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => {
                  toast.warn(
                    "This feature may not work on all browsers. If it doesn't work, please download the QR Code and scan it using a QR Code scanner app.",
                  );
                  fetch(selectedReceiverObject.qrImageLink)
                    .then((response) => response.blob())
                    .then((blob) => {
                      const imageUrl = URL.createObjectURL(blob);
                      const img = new Image();
                      img.crossOrigin = 'Anonymous'; // Important for CORS!
                      img.src = imageUrl;

                      img.onload = async () => {
                        try {
                          const result = await QrScanner.scanImage(img);
                          console.log('QR Code content:', result);
                          URL.revokeObjectURL(imageUrl);

                          if (
                            result.indexOf('://') ||
                            result.startsWith('http://') ||
                            result.startsWith('https://')
                          ) {
                            window.open(result, '_blank');
                          } else {
                            toast.error(
                              'QR Code does not contain a valid link.',
                            );
                          }
                        } catch (err) {
                          console.error('QR decoding failed:', err);
                          toast.error('Failed to decode QR Code.');
                        }
                      };
                    })
                    .catch((error) => {
                      toast.error('Error fetching QR Code image');
                      console.error(error);
                    });
                }}
              >
                Open QR Link
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  fetch(selectedReceiverObject.qrImageLink)
                    .then((response) => response.blob())
                    .then((blob) => {
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      const download_name = `QR_Code_${selectedReceiverObject.receiverName}.png`;
                      link.download = download_name;
                      link.click();
                      URL.revokeObjectURL(link.href);
                    })
                    .catch((error) => {
                      toast.error('Error downloading QR Code');
                      console.error(error);
                    });
                }}
              >
                Download QR Code
              </Button>
            </div>
            <p className="text-gray-700 font-semibold">Upload Payment Proof:</p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <Upload className="text-gray-500" size={24} />
              <span className="text-gray-600 mt-2 text-sm">
                Click to select or drag and drop an image here
              </span>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handlePaymentProofUpload}
                className="hidden"
              />
            </label>
            {paymentProof && (
              <p className="text-sm text-gray-600 mt-2">
                Uploaded: {paymentProof.name}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between mt-2">
          <Button variant="outline" onClick={() => setStep(1)}>
            <ChevronLeft />
            Back
          </Button>
          <Button
            onClick={() => {
              setPaymentData((prev) => ({
                ...prev,
                totalPayableAmount:
                  (parseInt(selectedPackage.totalAmount) || 0) +
                  (parseInt(receiverFeeAmount) || 0) +
                  (parseInt(platformFeeAmount) || 0),
              }));
              setStep(3);
            }}
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;
