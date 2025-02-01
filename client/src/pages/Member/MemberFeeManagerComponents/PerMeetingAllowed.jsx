import React from 'react';
import { Check } from 'lucide-react';

const PerMeetingAllowed = ({ chapterMeetings }) => {
  const [showUnpaidOnly, setShowUnpaidOnly] = React.useState(false);
  const [meetings, setMeetings] = React.useState(chapterMeetings);

  // Helper function to calculate total amounts with penalties or discounts for a meeting
  const calculateMeetingAmount = (meeting) => {
    const today = new Date();
    const payableStartDate = new Date(meeting.payableStartDate);
    const payableEndDate = new Date(meeting.payableEndDate);
    const discountEndDate = new Date(meeting.discountEndDate);

    let totalAmount = meeting.meetingFeeMembers;
    let penaltyAmount = 0;
    let discountAmount = 0;

    // Check if the meeting is within the payable period
    if (today < payableStartDate) {
      // Meeting is not yet payable
      return { totalAmount: 0, penaltyAmount: 0, discountAmount: 0 };
    }

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
      switch (meeting.discountType) {
        case 'Daily':
          discountAmount = daysRemainingForDiscount * meeting.discountAmount;
          break;
        case 'Weekly':
          discountAmount =
            Math.ceil(daysRemainingForDiscount / 7) * meeting.discountAmount;
          break;
        case 'Monthly':
          discountAmount =
            Math.ceil(daysRemainingForDiscount / 30) * meeting.discountAmount;
          break;
        case 'Quarterly':
          discountAmount =
            Math.ceil(daysRemainingForDiscount / 90) * meeting.discountAmount;
          break;
        case 'Meetingly':
        case 'Lumsum':
          discountAmount = meeting.discountAmount; // Flat discount per meeting or lump sum
          break;
        default:
          discountAmount = 0;
      }
    }

    // Apply penalty logic
    if (today > payableEndDate && meeting.allowPenaltyPayableAfterEndDate) {
      switch (meeting.penaltyType) {
        case 'Daily':
          penaltyAmount = daysExceededForPenalty * meeting.penaltyAmount;
          break;
        case 'Weekly':
          penaltyAmount =
            Math.ceil(daysExceededForPenalty / 7) * meeting.penaltyAmount;
          break;
        case 'Monthly':
          penaltyAmount =
            Math.ceil(daysExceededForPenalty / 30) * meeting.penaltyAmount;
          break;
        case 'Quarterly':
          penaltyAmount =
            Math.ceil(daysExceededForPenalty / 90) * meeting.penaltyAmount;
          break;
        case 'Meetingly':
          penaltyAmount = meeting.penaltyAmount; // Flat penalty per meeting
          break;
        default:
          penaltyAmount = 0;
      }
    }

    totalAmount = totalAmount + penaltyAmount - discountAmount;
    return { totalAmount, penaltyAmount, discountAmount };
  };

  const handlePayment = (meetingId) => {
    const updatedMeetings = meetings.map((meeting) =>
      meeting.meetingId === meetingId ? { ...meeting, isPaid: true } : meeting
    );
    setMeetings(updatedMeetings);
    // Call API to update payment status in the backend
  };

  const filteredMeetings = showUnpaidOnly
    ? meetings.filter((meeting) => !meeting.isPaid)
    : meetings;

  return (
    <div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredMeetings.map((meeting) => {
          const { totalAmount, penaltyAmount, discountAmount } =
            calculateMeetingAmount(meeting);

          return (
            <div
              key={meeting.meetingId}
              className={`relative bg-white shadow-md rounded-lg p-6 ${
                meeting.isPaid ? 'border-green-500 border-2' : ''
              }`}
            >
              {meeting.isPaid && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-50">
                  <Check className="text-white" size={100} />
                </div>
              )}
              <h2 className="text-xl font-bold mb-2">Meeting on {meeting.meetingDate}</h2>
              <p className="text-gray-700 mb-1">Time: {meeting.meetingTime}</p>
              <p className="text-gray-700 mb-1">
                {`₹${meeting.meetingFeeMembers}`}
                {penaltyAmount > 0 && (
                  <span className="text-red-500"> + ₹{penaltyAmount}</span>
                )}
                {discountAmount > 0 && (
                  <span className="text-green-500"> - ₹{discountAmount}</span>
                )}
                = ₹{totalAmount}
              </p>
              <button
                onClick={() => handlePayment(meeting.meetingId)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                disabled={meeting.isPaid}
              >
                {meeting.isPaid ? 'Paid' : 'Pay'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerMeetingAllowed;