import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Input from '../../components/Forms/Input';
import Button from '../../components/Forms/Button';

interface VisitorDetails {
  invitedBy: string;
  chapterVisitDate: string;
  heardAboutBNI: string;
  firstName: string;
  lastName: string;
  companyName: string;
  classification: string;
  industry: string;
  email: string;
  mobile: string;
  feedbackScore: string;
  feedbackComments: string;
}

const EOI: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [visitorExists, setVisitorExists] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showQRPage, setShowQRPage] = useState<boolean>(false);
  const [visitorDetails, setVisitorDetails] = useState<VisitorDetails>({
    invitedBy: '',
    chapterVisitDate: '',
    heardAboutBNI: '',
    firstName: '',
    lastName: '',
    companyName: '',
    classification: '',
    industry: '',
    email: '',
    mobile: '',
    feedbackScore: '',
    feedbackComments: '',
  });

  // Handle phone number entry
  const handlePhoneSubmit = async () => {
    try {
      // Replace this URL with the actual backend endpoint
      const response = await fetch(`/api/checkVisitor?phone=${phoneNumber}`);
      const result = await response.json();
      if (result.exists) {
        setVisitorExists(true);
        setShowFeedback(true);
      } else {
        setVisitorExists(false);
      }
    } catch (error) {
      console.error('Error checking visitor:', error);
    }
  };

  // Update visitor details fields
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setVisitorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Show QR page after saving details and feedback
  const handleSaveAndPay = () => {
    setShowQRPage(true);
  };

  console.log({ visitorExists });

  return (
    <div className="app-container">
      <h2>Fortune - Pune East</h2>
      <Breadcrumb pageName="Form Elements" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Contact Form
          </h3>
        </div>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  First name
                </label>
                {/* Phone Number Input Section */}
                {!visitorExists && !showQRPage && (
                  <div className="phone-section">
                    <Input label='Enter your phone number to continue:' placeholder='12345 67890'/>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button onClick={handlePhoneSubmit}>Submit</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Visitor Details Form */}
      {!showFeedback && !showQRPage && (
        <div className="visitor-details-form">
          <h3>Enter New Visitor Details</h3>
          <label>Who Invited You to this Meeting?*</label>
          <input
            type="text"
            name="invitedBy"
            value={visitorDetails.invitedBy}
            onChange={handleInputChange}
          />

          <label>Date of Chapter Visit* (Only Fridays)</label>
          <input
            type="date"
            name="chapterVisitDate"
            value={visitorDetails.chapterVisitDate}
            onChange={handleInputChange}
            placeholder="Select a Friday"
          />

          <label>How did you first hear about BNI?</label>
          <select
            name="heardAboutBNI"
            value={visitorDetails.heardAboutBNI}
            onChange={handleInputChange}
          >
            <option value="">Select an option</option>
            <option value="Friend or Family Member">
              Friend or Family Member
            </option>
            <option value="Business Associate">Business Associate</option>
            <option value="Social Media">Social Media</option>
            <option value="Newspaper or Magazine">Newspaper or Magazine</option>
            <option value="Online search">Online search</option>
            <option value="Email">Email</option>
          </select>

          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={visitorDetails.firstName}
            onChange={handleInputChange}
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={visitorDetails.lastName}
            onChange={handleInputChange}
          />

          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={visitorDetails.companyName}
            onChange={handleInputChange}
          />

          <label>Professional Classification</label>
          <input
            type="text"
            name="classification"
            value={visitorDetails.classification}
            onChange={handleInputChange}
          />

          <label>Industry</label>
          <input
            type="text"
            name="industry"
            value={visitorDetails.industry}
            onChange={handleInputChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={visitorDetails.email}
            onChange={handleInputChange}
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={visitorDetails.mobile}
            onChange={handleInputChange}
          />

          <button onClick={() => setShowFeedback(true)}>
            Fill Feedback Now
          </button>
          <button onClick={handleSaveAndPay}>Save & Pay</button>
        </div>
      )}

      {/* Feedback Form */}
      {showFeedback && !showQRPage && (
        <div className="feedback-form">
          <h3>Visitor Feedback</h3>
          <label>
            On a scale of 1-10, How was your experience in this meeting?
          </label>
          <input
            type="number"
            name="feedbackScore"
            min="1"
            max="10"
            value={visitorDetails.feedbackScore}
            onChange={handleInputChange}
          />

          <label>Do you have any suggestions or feedback?</label>
          <textarea
            name="feedbackComments"
            value={visitorDetails.feedbackComments}
            onChange={handleInputChange}
          />

          <button onClick={handleSaveAndPay}>Save & Pay</button>
        </div>
      )}

      {/* QR Payment Page */}
      {showQRPage && (
        <div className="qr-payment">
          <h3>Thank you for your feedback!</h3>
          <p>Please scan the QR code below to pay:</p>
          <img src="path/to/qr-code.png" alt="QR Code for Payment" />
        </div>
      )}
    </div>
  );
};

export default EOI;
