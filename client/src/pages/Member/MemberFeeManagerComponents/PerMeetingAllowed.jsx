import React from 'react';
import { Check } from 'lucide-react';

const PerMeetingAllowed = ({ chapterMeetings }) => {
  const [showUnpaidOnly, setShowUnpaidOnly] = React.useState(false);
  const [meetings, setMeetings] = React.useState(chapterMeetings);

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
        {filteredMeetings.map((meeting) => (
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
            <p className="text-gray-700 mb-1">Members Fee: ₹{meeting.meetingFeeMembers}</p>
            <button
              onClick={() => handlePayment(meeting.meetingId)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              disabled={meeting.isPaid}
            >
              {meeting.isPaid ? "Paid" : "Pay"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerMeetingAllowed;