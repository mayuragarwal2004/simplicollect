import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumb';
import Input from '../../components/Forms/Input';
import Button from '../../components/Forms/Button';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import { useParams } from 'react-router-dom';
import TimePicker from '../../components/Forms/TimePicker';
import Alerts from '../UiElements/Alerts';
import { axiosInstance } from '../../utils/config';

interface FieldProperties {
  value: any;
  disabled: boolean;
  status: 'error' | 'success' | 'default';
  errorMessage: string;
}

interface VisitorDetails {
  invitedBy: FieldProperties;
  chapterVisitDate: FieldProperties;
  heardAboutBNI: FieldProperties;
  firstName: FieldProperties;
  lastName: FieldProperties;
  companyName: FieldProperties;
  classification: FieldProperties;
  industry: FieldProperties;
  email: FieldProperties;
  mobileNumber: FieldProperties;
  feedbackScore: FieldProperties;
  feedbackComments: FieldProperties;
  nextStep: FieldProperties;
  arrivalTime: FieldProperties;
  feelWelcome: FieldProperties;
  visitedBniBefore: FieldProperties;
  referralGroupExperience: FieldProperties;
  meetingId: FieldProperties;
}

const initialFieldState: FieldProperties = {
  value: '',
  disabled: false,
  status: 'default',
  errorMessage: '',
};

const EOI: React.FC = () => {
  const { chapterSlug } = useParams<{ chapterSlug: string }>();
  const [verifyLink, setVerifyLink] = useState<boolean>();
  const [verifyLinkMessage, setVerifyLinkMessage] = useState<string>('');
  const [chapterDetails, setChapterDetails] = useState<any>({});
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [visitorExists, setVisitorExists] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showQRPage, setShowQRPage] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [meetingOptions, setMeetingOptions] = useState<{
    upcoming: any[];
    recent: any[];
  }>({ upcoming: [], recent: [] });

  const [visitorDetails, setVisitorDetails] = useState<VisitorDetails>({
    invitedBy: { ...initialFieldState },
    chapterVisitDate: { ...initialFieldState },
    heardAboutBNI: { ...initialFieldState },
    firstName: { ...initialFieldState },
    lastName: { ...initialFieldState },
    companyName: { ...initialFieldState },
    classification: { ...initialFieldState },
    industry: { ...initialFieldState },
    email: { ...initialFieldState },
    mobileNumber: { ...initialFieldState },
    feedbackScore: { ...initialFieldState },
    feedbackComments: { ...initialFieldState },
    nextStep: { ...initialFieldState },
    arrivalTime: { ...initialFieldState },
    feelWelcome: { ...initialFieldState, value: false },
    visitedBniBefore: { ...initialFieldState, value: false },
    referralGroupExperience: { ...initialFieldState },
    meetingId: { ...initialFieldState },
  });

  useEffect(() => {
    const fetchChapterAndMeetings = async () => {
      try {
        // First fetch chapter details
        const chapterResponse = await axiosInstance.get(`/api/visitor/verifyVisitorLink/${chapterSlug}`);
        const chapterResult = chapterResponse.data;

        if (chapterResponse.status !== 200) {
          throw new Error(chapterResult.message);
        }

        if (!chapterResult.chapterId) {
          setVerifyLink(false);
          setVerifyLinkMessage(chapterResult.message || "Chapter not found");
          return;
        }

        setVerifyLink(true);
        setChapterDetails(chapterResult);

        // Then fetch meetings for this chapter
        const meetingsResponse = await axiosInstance(`/api/visitor/getChapterMeetings/${chapterResult.chapterId}`);
        const meetingsResult = await meetingsResponse.data;

        console.log({ meetingsResponse, meetingsResult });
        
        
        if (meetingsResponse.status === 200) {
          const formatMeetingDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          };

          const formattedMeetings = {
            upcoming: (meetingsResult.upcoming || []).map((m: any) => ({
              ...m,
              displayDate: formatMeetingDate(m.meetingDate)
            })),
            recent: (meetingsResult.recent || []).map((m: any) => ({
              ...m,
              displayDate: formatMeetingDate(m.meetingDate)
            }))
          };

          setMeetingOptions(formattedMeetings);

          // Set default meeting to the next upcoming meeting if available
          if (formattedMeetings.upcoming.length > 0) {
            setVisitorDetails(prev => ({
              ...prev,
              meetingId: {
                ...prev.meetingId,
                value: formattedMeetings.upcoming[0].meetingId
              },
              chapterVisitDate: {
                ...prev.chapterVisitDate,
                value: formattedMeetings.upcoming[0].meetingDate
              }
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setVerifyLink(false);
        setVerifyLinkMessage('Failed to load chapter information');
      }
    };

    fetchChapterAndMeetings();
  }, [chapterSlug]);

  const handlePhoneSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.get(`/api/visitor/checkVisitor?phone=${phoneNumber}`);
      const result = response.data;

      if (response.status !== 200) throw new Error(result.message);

      if (result.exists) {
        setVisitorExists(true);
        setShowFeedback(true);
        const { visitor } = result;
        
        const updatedDetails = { ...visitorDetails };
        for (const key in visitor) {
          if (key in updatedDetails) {
            updatedDetails[key as keyof VisitorDetails] = {
              ...updatedDetails[key as keyof VisitorDetails],
              value: visitor[key]
            };
          }
        }
        setVisitorDetails(updatedDetails);
      } else {
        setPageNo(2);
        setVisitorDetails(prev => ({
          ...prev,
          mobileNumber: {
            ...prev.mobileNumber,
            value: phoneNumber
          }
        }));
      }
    } catch (error) {
      console.error('Error checking visitor:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVisitorDetails(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof VisitorDetails],
        value
      }
    }));
  };

  const handleTimeChange = (selectedTime: string) => {
    setVisitorDetails(prev => ({
      ...prev,
      arrivalTime: {
        ...prev.arrivalTime,
        value: selectedTime
      }
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const requiredFields: (keyof VisitorDetails)[] = [
      'firstName', 'lastName', 'companyName', 
      'classification', 'email', 'mobileNumber',
      'meetingId'
    ];

    requiredFields.forEach(field => {
      if (!visitorDetails[field].value) {
        isValid = false;
        setVisitorDetails(prev => ({
          ...prev,
          [field]: {
            ...prev[field],
            status: 'error',
            errorMessage: `${field === 'meetingId' ? 'Meeting selection' : field} is required`
          }
        }));
      } else {
        setVisitorDetails(prev => ({
          ...prev,
          [field]: {
            ...prev[field],
            status: 'success',
            errorMessage: ''
          }
        }));
      }
    });

    if (visitorDetails.mobileNumber.value.length !== 10) {
      isValid = false;
      setVisitorDetails(prev => ({
        ...prev,
        mobileNumber: {
          ...prev.mobileNumber,
          status: 'error',
          errorMessage: 'Mobile Number must be 10 digits'
        }
      }));
    }

    return isValid;
  };

 const handleSaveAndPay = async (e: any) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const formData: any = {};
    for (const key in visitorDetails) {
      const fieldValue = visitorDetails[key as keyof VisitorDetails].value;
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        formData[key] = fieldValue;
      }
    }

    formData.chapterId = chapterDetails.chapterId;

    // If we have a meetingId, use its date for chapterVisitDate
    if (formData.meetingId) {
      const selectedMeeting = [...meetingOptions.upcoming, ...meetingOptions.recent]
        .find(m => m.meetingId === formData.meetingId);
      if (selectedMeeting) {
        // Convert to Date object
        const meetingDate = new Date(selectedMeeting.meetingDate);
        // Format as YYYY-MM-DD for MySQL DATE type
        formData.chapterVisitDate = meetingDate.toISOString().split('T')[0];
      }
    }

    const endpoint = visitorExists ? 'addFeedback' : 'addVisitor';
    const response = await axiosInstance.post(`/api/visitor/${endpoint}`, formData);

    if (response.status === 200) {
      setShowQRPage(true);
      setPageNo(3);
    } else {
      throw new Error(response.data.message || 'Error saving visitor details');
    }
  } catch (error) {
    console.error('Error saving visitor:', error);
    alert(error.message);
  }
};
  if (verifyLink === undefined) {
    return <div>Loading...</div>;
  }

  if (!verifyLink) {
    return (
      <Alerts
        alert={{
          type: 'error',
          title: 'Invalid Link',
          message: verifyLinkMessage,
        }}
      />
    );
  }

    return (
      <div className="app-container p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 break-words">
          {chapterDetails.chapterName} - {chapterDetails.region}
        </h2>
        <Breadcrumbs items={[
          { name: 'Visitor Registration' }
        ]} />

        {/* Phone Number Input Section */}
        {!visitorExists && !showQRPage && pageNo === 1 && (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-4 md:px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Visitor Login
              </h3>
            </div>
            <form action="#">
              <div className="p-4 md:p-6.5">
                <div className="max-w-md mx-auto">
                  <div className="phone-section">
                    <Input
                      label="Enter your phone number to continue:"
                      placeholder="12345 67890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <div className="mt-6">
                      <Button 
                        className="w-full"
                        onClick={(e) => handlePhoneSubmit(e)}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Visitor Details Form */}
        {!showFeedback && !showQRPage && pageNo === 2 && (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-4 md:px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Enter New Visitor Details
              </h3>
            </div>

            <form action="#">
              <div className="p-4 md:p-6.5">
                <div className="w-full max-w-4xl mx-auto space-y-6">
                  {/* Top row with inviter and meeting */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <Input
                      label="Who Invited You to this Meeting?*"
                      type="text"
                      name="invitedBy"
                      placeholder="Name of Member"
                      value={visitorDetails.invitedBy.value}
                      onChange={handleInputChange}
                      parentClassName="w-full"
                    />
                    <SelectGroupOne
                      label="Select Meeting*"
                      placeholder="Select a meeting"
                      parentClassName="w-full"
                      name="meetingId"
                      value={visitorDetails.meetingId.value}
                      options={[
                        ...(meetingOptions.recent.length > 0 ? [
                          {
                            label: '─── Past Meetings ───',
                            value: '',
                            disabled: true
                          },
                          ...meetingOptions.recent.map(meeting => ({
                            label: `${meeting.meetingName} - ${meeting.displayDate}`,
                            value: meeting.meetingId
                          }))
                        ] : []),
                        ...(meetingOptions.upcoming.length > 0 ? [
                          {
                            label: '─── Upcoming Meetings ───',
                            value: '',
                            disabled: true
                          },
                          ...meetingOptions.upcoming.map(meeting => ({
                            label: `${meeting.meetingName} - ${meeting.displayDate}`,
                            value: meeting.meetingId
                          }))
                        ] : [])
                      ]}
                      onChange={handleInputChange}
                      status={visitorDetails.meetingId.status}
                      errorMessage={visitorDetails.meetingId.errorMessage}
                      required
                    />
                  </div>

                  <hr className="border-stroke dark:border-strokedark" />

                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <Input
                      label="First Name*"
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={visitorDetails.firstName.value}
                      onChange={handleInputChange}
                      parentClassName="w-full"
                      status={visitorDetails.firstName.status}
                      errorMessage={visitorDetails.firstName.errorMessage}
                    />
                    <Input
                      label="Last Name*"
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={visitorDetails.lastName.value}
                      onChange={handleInputChange}
                      parentClassName="w-full"
                      status={visitorDetails.lastName.status}
                      errorMessage={visitorDetails.lastName.errorMessage}
                    />
                  </div>

                  {/* Company and classification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <Input
                      label="Company Name*"
                      type="text"
                      name="companyName"
                      placeholder="ABC Corp"
                      value={visitorDetails.companyName.value}
                      onChange={handleInputChange}
                      parentClassName="w-full"
                      status={visitorDetails.companyName.status}
                      errorMessage={visitorDetails.companyName.errorMessage}
                    />
                    <Input
                      label="Professional Classification*"
                      type="text"
                      name="classification"
                      placeholder="eg. Real Estate Agent, Lawyer"
                      value={visitorDetails.classification.value}
                      onChange={handleInputChange}
                      parentClassName="w-full"
                      status={visitorDetails.classification.status}
                      errorMessage={visitorDetails.classification.errorMessage}
                    />
                  </div>

                  {/* Email and mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <Input
                      label="Email*"
                      type="email"
                      name="email"
                      placeholder="john.doe@abc.com"
                      value={visitorDetails.email.value}
                      onChange={handleInputChange}
                      status={visitorDetails.email.status}
                      errorMessage={visitorDetails.email.errorMessage}
                    />
                    <Input
                      label="Mobile Number*"
                      type="tel"
                      name="mobileNumber"
                      placeholder="12345 67890"
                      value={visitorDetails.mobileNumber.value}
                      onChange={handleInputChange}
                      status={visitorDetails.mobileNumber.status}
                      errorMessage={visitorDetails.mobileNumber.errorMessage}
                      disabled={!visitorExists}
                    />
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button className="w-full max-w-xs" onClick={handleSaveAndPay}>
                      Save & Pay
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Feedback Form */}
        {showFeedback && !showQRPage && (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Visitor Feedback
              </h3>
            </div>
            <form action="#">
              <div className="p-4 md:p-6.5">
                <div className="w-full max-w-4xl mx-auto">
                  <div className="feedback-form space-y-6">
                    <SelectGroupOne
                      label="Given your experience today, which option best describes the next steps for you?"
                      placeholder="Select an option"
                      parentClassName="w-full"
                      name="nextStep"
                      value={visitorDetails.nextStep.value}
                      options={[
                        {
                          label: "I'd like to apply today",
                          value: "I'd like to apply today",
                        },
                        {
                          label:
                            'Yes, I like it - I just have some questions that need answering',
                          value:
                            'Yes, I like it - I just have some questions that need answering',
                        },
                        {
                          label:
                            "I like it - I'm just not able to make the commitments at the moment",
                          value:
                            "I like it - I'm just not able to make the commitments at the moment",
                        },
                      ]}
                      onChange={handleInputChange}
                    />

                    <Input
                      label="What time did you arrive at the meeting?"
                      type="text"
                      name="arrivalTime"
                      placeholder="e.g., 9:30 AM"
                      value={visitorDetails.arrivalTime.value}
                      onChange={handleInputChange}
                    />

                    <SelectGroupOne
                      label="Did the Chapter make you feel welcome?"
                      placeholder="Select an option"
                      parentClassName="w-full"
                      name="feelWelcome"
                      value={visitorDetails.feelWelcome.value}
                      options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' },
                      ]}
                      onChange={handleInputChange}
                    />

                    <SelectGroupOne
                      label="Have you visited BNI before?"
                      placeholder="Select an option"
                      parentClassName="w-full"
                      name="visitedBniBefore"
                      value={visitorDetails.visitedBniBefore.value}
                      options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' },
                      ]}
                      onChange={handleInputChange}
                    />

                    <Input
                      label="Have you been involved in a business referral group before? (If yes, how did it compare?)"
                      type="text"
                      name="referralGroupExperience"
                      placeholder="Your response here"
                      value={visitorDetails.referralGroupExperience.value}
                      onChange={handleInputChange}
                      status={visitorDetails.referralGroupExperience.status}
                      errorMessage={
                        visitorDetails.referralGroupExperience.errorMessage
                      }
                    />

                    <div className="mb-4.5 w-full">
                      <label className="mb-2.5 mt-5 block text-black dark:text-white">
                        On a scale of 1-10, How was your experience in this meeting?
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => {
                              setVisitorDetails(prev => ({
                                ...prev,
                                feedbackScore: {
                                  ...prev.feedbackScore,
                                  value: rating.toString()
                                }
                              }));
                            }}
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                              parseInt(visitorDetails.feedbackScore.value) >= rating
                                ? 'bg-yellow-400 border-yellow-400 text-white'
                                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-yellow-100 hover:border-yellow-300'
                            } dark:${
                              parseInt(visitorDetails.feedbackScore.value) >= rating
                                ? 'bg-yellow-500 border-yellow-500 text-white'
                                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-yellow-600 hover:border-yellow-500'
                            }`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                        {visitorDetails.feedbackScore.value && (
                          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rating: {visitorDetails.feedbackScore.value}/10
                          </span>
                        )}
                      </div>
                    </div>

                    <Input
                      label="Do you have any suggestions or feedback?"
                      type="text"
                      name="feedbackComments"
                      placeholder="Your response here"
                      value={visitorDetails.feedbackComments.value}
                      onChange={handleInputChange}
                    />

                    <div className="flex justify-center pt-6">
                      {visitorExists ? (
                        <Button className="w-full max-w-xs" onClick={handleSaveAndPay}>
                          Save & Complete
                        </Button>
                      ) : (
                        <Button className="w-full max-w-xs" onClick={handleSaveAndPay}>
                          Save & Pay
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Confirmation Message */}
        {showQRPage && pageNo === 3 && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900 dark:border-green-700 dark:text-green-200">
            Form has been filled successfully and recorded.
          </div>
        )}

        {/* QR Payment Page */}
        {showQRPage && pageNo === 3 && (
          <div className="qr-payment">
            <div className="rounded-sm border border-stroke bg-white p-4 md:p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
              {chapterDetails.chapterName.startsWith('ABC') && (
                <>
                  <div className="border-b border-stroke py-4 px-2 md:px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white text-center md:text-left">
                      Please scan the QR code below to pay:
                    </h3>
                  </div>
                  <div className="flex justify-center py-4">
                    <img
                      src="https://simplicollect.s3.ap-south-1.amazonaws.com/web_app/abc.jpg"
                      alt="QR Code for Payment"
                      className="max-w-full h-auto max-h-80 md:max-h-96"
                    />
                  </div>
                </>
              )}
              <div className="mt-4">
                <p className="ml-2 text-gray-800 dark:text-gray-200 font-medium">Note: </p>
                <ul className="list-disc ml-6 md:ml-10 text-gray-800 dark:text-gray-200 space-y-2">
                  <li>
                    {!chapterDetails.chapterName.startsWith('ABC') && (
                      <>
                        <strong>Amount:</strong> ₹{' '}
                        {chapterDetails.visitorPerMeetingFee}
                      </>
                    )}
                    {chapterDetails.chapterName.startsWith('ABC') && (
                      <>
                        <strong>Amount:</strong> ₹ 600/800
                      </>
                    )}
                  </li>
                  <li>
                    To confirm your payment, please show the payment proof on the
                    visitor registration desk.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default EOI;
