import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import Input from '../../components/Forms/Input';
import Button from '../../components/Forms/Button';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import { useParams } from 'react-router-dom';
import TimePicker from '../../components/Forms/TimePicker';
import Alerts from '../UiElements/Alerts';

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
        const chapterResponse = await fetch(`/api/visitor/verifyVisitorLink/${chapterSlug}`);
        const chapterResult = await chapterResponse.json();
        
        if (!chapterResponse.ok) {
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
        const meetingsResponse = await fetch(`/api/visitor/getChapterMeetings/${chapterResult.chapterId}`);
        const meetingsResult = await meetingsResponse.json();
        
        if (meetingsResponse.ok) {
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
      const response = await fetch(`/api/visitor/checkVisitor?phone=${phoneNumber}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message);
      
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
    const response = await fetch(`/api/visitor/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setShowQRPage(true);
      setPageNo(3);
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Error saving visitor details');
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
      <div className="app-container p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {chapterDetails.chapterName} - {chapterDetails.region}
        </h2>
        <Breadcrumb pageName="Visitor Registration" />

        {/* Phone Number Input Section */}
        {!visitorExists && !showQRPage && pageNo === 1 && (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Visitor Login
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <div className="phone-section">
                      <Input
                        label="Enter your phone number to continue:"
                        placeholder="12345 67890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <br />
                      <Button onClick={(e) => handlePhoneSubmit(e)}>
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
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Enter New Visitor Details
              </h3>
            </div>

            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <div className="flex w-full m-auto justify-evenly flex-wrap gap-x-5">
                      <Input
                        label="Who Invited You to this Meeting?*"
                        type="text"
                        name="invitedBy"
                        placeholder="Name of Member"
                        value={visitorDetails.invitedBy.value}
                        onChange={handleInputChange}
                        parentClassName="w-auto flex-1 whitespace-nowrap"
                      />
                      <SelectGroupOne
                  label="Select Meeting*"
                  placeholder="Select a meeting"
                  parentClassName="w-auto flex-1 whitespace-nowrap"
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
                      {/* <SelectGroupOne
                      label="How did you first hear about BNI?"
                      placeholder="Select an option"
                      parentClassName="w-auto flex-1 whitespace-nowrap"
                      name="heardAboutBNI"
                      value={visitorDetails.heardAboutBNI.value}
                      options={[
                        {
                          label: 'Friend or Family Member',
                          value: 'Friend or Family Member',
                        },
                        {
                          label: 'Business Associate',
                          value: 'Business Associate',
                        },
                        { label: 'Social Media', value: 'Social Media' },
                        {
                          label: 'Newspaper or Magazine',
                          value: 'Newspaper or Magazine',
                        },
                        { label: 'Online search', value: 'Online search' },
                        { label: 'Email', value: 'Email' },
                      ]}
                      onChange={handleInputChange}
                    /> */}
                    </div>
                    <hr />
                    <div className="sm:flex justify-evenly flex-wrap gap-x-5">
                      <Input
                        label="First Name*"
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={visitorDetails.firstName.value}
                        onChange={handleInputChange}
                        parentClassName="w-auto flex-1"
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
                        parentClassName="w-auto flex-1"
                        status={visitorDetails.lastName.status}
                        errorMessage={visitorDetails.lastName.errorMessage}
                      />
                    </div>
                    <div className="sm:flex justify-evenly flex-wrap gap-x-5">
                      <Input
                        label="Company Name*"
                        type="text"
                        name="companyName"
                        placeholder="ABC Corp"
                        value={visitorDetails.companyName.value}
                        onChange={handleInputChange}
                        parentClassName="w-auto flex-1"
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
                        parentClassName="w-auto flex-1"
                        status={visitorDetails.classification.status}
                        errorMessage={visitorDetails.classification.errorMessage}
                      />
                    </div>
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
                    <div className="flex justify-center mt-10">
                      <Button onClick={handleSaveAndPay}>Save & Pay</Button>
                    </div>
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
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <div className="flex w-full m-auto justify-evenly flex-wrap gap-x-5">
                      <div className="feedback-form">
                        <SelectGroupOne
                          label="Given your experience today, which option best describes the next steps for you?"
                          placeholder="Select an option"
                          parentClassName="w-auto flex-1 whitespace-nowrap"
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

                        <TimePicker
                          label="What time did you arrive at the meeting?"
                          timeFormat="12"
                          onTimeChange={handleTimeChange}
                        />

                        <SelectGroupOne
                          label="Did the Chapter make you feel welcome?"
                          placeholder="Select an option"
                          parentClassName="w-auto flex-1 whitespace-nowrap"
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
                          parentClassName="w-auto flex-1 whitespace-nowrap"
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

                        <SelectGroupOne
                          label="On a scale of 1-10, How was your experience in this meeting?"
                          placeholder="Select an option"
                          parentClassName="w-auto flex-1 whitespace-nowrap"
                          name="feedbackScore"
                          value={visitorDetails.feedbackScore.value}
                          options={[
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                            { label: '6', value: '6' },
                            { label: '7', value: '7' },
                            { label: '8', value: '8' },
                            { label: '9', value: '9' },
                            { label: '10', value: '10' },
                          ]}
                          onChange={handleInputChange}
                        />

                        <Input
                          label="Do you have any suggestions or feedback?"
                          type="text"
                          name="feedbackComments"
                          placeholder="Your response here"
                          value={visitorDetails.feedbackComments.value}
                          onChange={handleInputChange}
                        />

                        {visitorExists ? (
                          <Button className="mt-10" onClick={handleSaveAndPay}>
                            Save & Complete
                          </Button>
                        ) : (
                          <Button className="mt-10" onClick={handleSaveAndPay}>
                            Save & Pay
                          </Button>
                        )}
                      </div>
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
            <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
              {chapterDetails.chapterName.startsWith('ABC') && (
                <>
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      Please scan the QR code below to pay:
                    </h3>
                  </div>
                  <p></p>
                  <img
                    src="https://simplicollect.s3.ap-south-1.amazonaws.com/web_app/abc.jpg"
                    alt="QR Code for Payment"
                  />
                </>
              )}
              <p className="ml-2 text-gray-800 dark:text-gray-200">Note: </p>
              <ul className="list-disc ml-10 text-gray-800 dark:text-gray-200">
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
        )}
      </div>
    );
  };

  export default EOI;
