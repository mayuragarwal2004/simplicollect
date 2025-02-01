import React, { useState } from "react";
import { Check, Upload, X } from "lucide-react";

const AcceptPaymentMember = ({
  totalFees,
  penaltyAmount,
  discountAmount,
  paidFees,
  meetingIds,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentType, setPaymentType] = useState("cash"); // cash or online
  const [paymentProof, setPaymentProof] = useState(null); // For online payment proof
  const [paymentDate] = useState(new Date().toLocaleDateString()); // Current date

  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handlePaymentSubmit = () => {
    console.log("Payment submitted:", {
      paymentType,
      paymentProof,
      paymentDate,
    });
    onPaymentSuccess(); // Notify parent component of successful payment
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Accept Payment</h2>

        {/* Total Fees Summary */}
        <div className="border p-4 rounded-lg mb-4 bg-gray-50">
          <p className="text-gray-700 font-semibold text-lg">Total Payable Amount:</p>
          <p className="text-3xl font-bold text-blue-600">₹{totalFees}</p>
          <div className="text-sm text-gray-600 mt-2">
            {penaltyAmount > 0 && <p className="text-red-500">+ ₹{penaltyAmount} (Penalty)</p>}
            {discountAmount > 0 && <p className="text-green-500">- ₹{discountAmount} (Discount)</p>}
            {paidFees > 0 && <p className="text-gray-500">- ₹{paidFees} (Paid Previously)</p>}
          </div>
        </div>

        {/* Meetings Included */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Meetings Included:</p>
          <p className="text-lg font-medium text-blue-500">{meetingIds.length} Meetings</p>
        </div>

        {/* Payment Type Selection */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Select Payment Method:</p>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setPaymentType("cash")}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                paymentType === "cash" ? "bg-blue-600" : "bg-gray-300"
              } hover:bg-blue-700`}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentType("online")}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                paymentType === "online" ? "bg-blue-600" : "bg-gray-300"
              } hover:bg-blue-700`}
            >
              Online
            </button>
          </div>
        </div>

        {/* Online Payment Proof Upload */}
        {paymentType === "online" && (
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Upload Payment Proof:</p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <Upload className="text-gray-500" size={24} />
              <span className="text-gray-600 mt-2 text-sm">
                Click to select or drag and drop an image here
              </span>
              <input type="file" accept="image/*" onChange={handlePaymentProofUpload} className="hidden" />
            </label>
            {paymentProof && (
              <p className="text-sm text-gray-600 mt-2">Uploaded: {paymentProof.name}</p>
            )}
          </div>
        )}

        {/* Payment Date */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Payment Recorded On:</p>
          <p className="text-lg font-medium">{paymentDate}</p>
        </div>

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
            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2 hover:bg-green-600 transition"
          >
            <Check size={18} /> <span>Submit Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptPaymentMember;
