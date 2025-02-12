import React, { useState, useEffect } from 'react';
import { Check, Upload, X, ChevronDown, ChevronUp } from 'lucide-react';
import { axiosInstance } from '../../../utils/config';

const AcceptPaymentMember = ({
  selectedPackage,
  onClose,
  onPaymentSuccess,
  chapterMeetings,
  cashReceivers,
  qrReceivers,
}) => {
  const [paymentType, setPaymentType] = useState('cash'); // cash or online
  const [selectedCashReceiver, setSelectedCashReceiver] = useState(''); // Admin receiving cash
  const [selectedQRReceiver, setSelectedQRReceiver] = useState(''); // Admin QR code selection
  const [paymentProof, setPaymentProof] = useState(null); // Online payment proof
  const [paymentDate] = useState(new Date().toLocaleDateString()); // Current date
  const [showMeetings, setShowMeetings] = useState(false); // Toggle meeting details
  const [selectedMeetings, setSelectedMeetings] = useState([]);

  const [amountPaid, setAmountPaid] = useState(selectedPackage.totalAmount); // Amount paid by the member
  const [minimumPayable, setMinimumPayable] = useState(0); // Minimum payable amount

  const [refreshAdmins, setRefreshAdmins] = useState(false);

  const handleRefreshAdmins = () => {
    // setRefreshAdmins(true);
    // setTimeout(() => {
    //   setLoggedInAdmins(['Admin1', 'Admin3']); // Example update
    //   setRefreshAdmins(false);
    // }, 1000);
  };
  // Calculate the final amount

  useEffect(() => {
    if (selectedPackage.meetingIds && chapterMeetings) {
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

    if (paymentType === 'cash' && !selectedCashReceiver) {
      alert('Please select an admin to receive the cash payment');
      return;
    }

    if (paymentType === 'online' && !selectedQRReceiver) {
      alert('Please select an admin to receive the online payment');
      return;
    }

    const paymentDetails = {
      packageId: selectedPackage.packageId,
      meetingIds: selectedPackage.meetingIds,
      payableAmount: selectedPackage.totalAmount,
      paymentAmount: amountPaid,
      dueAmount: dueAmount,
      paymentType: paymentType,
      paymentDate: paymentDate,
      paymentType: paymentType,
      paymentDate: paymentDate,
      paymentImageLink: paymentProofLink,
      cashPaymentReceivedById: selectedCashReceiver,
      cashPaymentReceivedByName: selectedCashReceiver
        ? cashReceivers.find(
            (receiver) => receiver.memberId === selectedCashReceiver,
          )?.cashRecieverName
        : '',
      onlinePaymentReceivedById: selectedQRReceiver,
      onlinePaymentReceivedByName: selectedQRReceiver
        ? qrReceivers.find((receiver) => receiver.memberId === selectedQRReceiver)
            ?.qrCodeName
        : '',
    };
    const response = await axiosInstance
      .post('/api/payment/addPayment', paymentDetails)
      .then((response) => {
        console.log('Payment submitted:', {
          paymentType,
          selectedCashReceiver,
          selectedQRReceiver,
          paymentProof,
          paymentDate,
          amountPaid,
          dueAmount,
        });
        onPaymentSuccess(); // Notify parent component of successful payment
      })
      .catch((error) => {
        console.error('Error submitting payment:', error);
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
          Submit Payment
        </h2>

        {/* Total Fees Summary */}
        <div className="border p-4 rounded-lg mb-4 bg-gray-50">
          <p className="text-gray-700 font-semibold text-lg">
            Total Payable Amount:
          </p>
          <p className="text-3xl font-bold text-blue-600">₹{selectedPackage.totalAmount}</p>
          <div className="text-sm text-gray-600 mt-2">
            <p>₹{selectedPackage.packageFeeAmount} (Original Amount)</p>
            {selectedPackage.penaltyAmount > 0 && (
              <p className="text-red-500">+ ₹{selectedPackage.penaltyAmount} (Penalty)</p>
            )}
            {selectedPackage.discountAmount > 0 && (
              <p className="text-green-500">- ₹{selectedPackage.discountAmount} (Discount)</p>
            )}
            {selectedPackage.paidFees > 0 && (
              <p className="text-blue-500">- ₹{selectedPackage.paidFees} (Paid Previously)</p>
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

        {/* Partial Payment
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Amount Being Paid:</p>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
            className="w-full p-2 border rounded-lg mt-2"
            placeholder="Enter amount to pay"
          />
          {amountPaid < selectedPackage.totalAmount && (
            <p className="text-sm text-red-500 mt-2">
              Due Amount: ₹{selectedPackage.totalAmount - amountPaid}
            </p>
          )}
        </div> */}

        {/* Meetings Included */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Meetings Included:</p>
          <button
            onClick={() => setShowMeetings(!showMeetings)}
            className="flex items-center text-lg font-medium text-blue-500 hover:underline focus:outline-none"
          >
            {selectedPackage.meetingIds.length} Meetings
            {showMeetings ? (
              <ChevronUp className="ml-2" size={18} />
            ) : (
              <ChevronDown className="ml-2" size={18} />
            )}
          </button>
          {showMeetings && (
            <div className="mt-2 max-h-[200px] overflow-y-auto">
              {selectedMeetings.length > 0 ? (
                selectedMeetings.map((meeting) => (
                  <div
                    key={meeting.meetingId}
                    className="border p-2 rounded mb-2"
                  >
                    <p>
                      <strong>{meeting.meetingName}</strong>
                    </p>
                    <p>
                      {meeting.meetingDate} at {meeting.meetingTime}
                    </p>
                  </div>
                ))
              ) : (
                <p>No meetings found</p>
              )}
            </div>
          )}
        </div>

        {/* Payment Type Selection */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Select Payment Method:</p>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setPaymentType('cash')}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                paymentType === 'cash' ? 'bg-blue-600' : 'bg-gray-300'
              } hover:bg-blue-700`}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentType('online')}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                paymentType === 'online' ? 'bg-blue-600' : 'bg-gray-300'
              } hover:bg-blue-700`}
            >
              Online
            </button>
          </div>
        </div>

        {/* Cash Payment Selection */}
        {paymentType === 'cash' && (
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Submitted Cash to:</p>
            <div className="flex items-center space-x-2">
              <select
                className="w-full p-2 border rounded-lg mt-2"
                value={selectedCashReceiver}
                onChange={(e) => setSelectedCashReceiver(e.target.value)}
              >
                <option disabled value="">
                  Select Admin
                </option>
                {cashReceivers.map((adminValue, index) => (
                  <option key={adminValue.memberId} value={adminValue.memberId}>
                    {adminValue.cashRecieverName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRefreshAdmins}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={refreshAdmins}
              >
                {refreshAdmins ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        )}
        {/* Online Payment Selection */}
        {paymentType === 'online' && (
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Paid Online to:</p>
            <div className="mt-2">
              {qrReceivers.map((receiver, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-2 border rounded-lg cursor-pointer m-1 ${
                    selectedQRReceiver === receiver.qrCodeName
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedQRReceiver(receiver.qrCodeName)}
                >
                  <span className="text-gray-700">{receiver.qrCodeName}</span>
                  <img
                    src={receiver.qrImageLink}
                    alt="QR Code"
                    className="w-20 h-20"
                  />
                </div>
              ))}
            </div>

            {/* Upload Payment Proof */}
            {selectedQRReceiver && (
              <div className="mt-4">
                <p className="text-gray-700 font-semibold">
                  Upload Payment Proof:
                </p>
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentSubmit}
            className="px-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center space-x-2"
          >
            <Check size={18} />
            <span>Submit Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptPaymentMember;
