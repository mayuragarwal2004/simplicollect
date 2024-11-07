import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Input from '../../components/Forms/Input';
import Button from '../../components/Forms/Button';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import { useParams } from 'react-router-dom';
import TimePicker from '../../components/Forms/TimePicker';

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
  emailId: FieldProperties;
  mobileNumber: FieldProperties;
  feedbackScore: FieldProperties;
  feedbackComments: FieldProperties;

  // New feedback fields
  nextStep: FieldProperties;
  arrivalTime: FieldProperties;
  feelWelcome: FieldProperties;
  visitedBniBefore: FieldProperties;
  referralGroupExperience: FieldProperties;
}

const initialFieldState: FieldProperties = {
  value: '',
  disabled: false,
  status: 'default',
  errorMessage: '',
};

const EOI: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [visitorExists, setVisitorExists] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showQRPage, setShowQRPage] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [visitorDetails, setVisitorDetails] = useState<VisitorDetails>({
    invitedBy: { ...initialFieldState },
    chapterVisitDate: { ...initialFieldState },
    heardAboutBNI: { ...initialFieldState },
    firstName: { ...initialFieldState },
    lastName: { ...initialFieldState },
    companyName: { ...initialFieldState },
    classification: { ...initialFieldState },
    industry: { ...initialFieldState },
    emailId: { ...initialFieldState },
    mobileNumber: { ...initialFieldState },
    feedbackScore: { ...initialFieldState },
    feedbackComments: { ...initialFieldState },

    // New feedback fields
    nextStep: { ...initialFieldState },
    arrivalTime: { ...initialFieldState },
    feelWelcome: { ...initialFieldState, value: false }, // Set default value for boolean fields
    visitedBniBefore: { ...initialFieldState, value: false },
    referralGroupExperience: { ...initialFieldState },
  });

  // Handle phone number entry
  const handlePhoneSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Replace this URL with the actual backend endpoint
      const response = await fetch(`/api/checkVisitor?phone=${phoneNumber}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      if (result.exists) {
        setVisitorExists(true);
        setShowFeedback(true);
        const { visitor } = result;
        for (const key in visitor) {
          setVisitorDetails((prevDetails) => ({
            ...prevDetails,
            [key]: {
              ...prevDetails[key as keyof VisitorDetails],
              value: visitor[key as keyof VisitorDetails],
            },
          }));
        }
      } else {
        setPageNo(2);
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
      [name]: {
        ...prevDetails[name as keyof VisitorDetails],
        value,
      },
    }));
  };

  const handleTimeChange = (selectedTime: string) => {
    setVisitorDetails((prevDetails) => ({
      ...prevDetails,
      arrivalTime: {
        ...prevDetails.arrivalTime,
        value: selectedTime,
      },
    }));
  };

  const validateForm = () => {
    let isValid = true;

    if (!visitorDetails.firstName.value) {
      isValid = false;
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        firstName: {
          ...prevDetails.firstName,
          status: 'error',
          errorMessage: 'First Name is required',
        },
      }));
    } else {
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        firstName: {
          ...prevDetails.firstName,
          status: 'success',
          errorMessage: '',
        },
      }));
    }

    if (!visitorDetails.lastName.value) {
      isValid = false;
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        lastName: {
          ...prevDetails.lastName,
          status: 'error',
          errorMessage: 'Last Name is required',
        },
      }));
    } else {
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        lastName: {
          ...prevDetails.lastName,
          status: 'success',
          errorMessage: '',
        },
      }));
    }

    if (!visitorDetails.companyName.value) {
      isValid = false;
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        companyName: {
          ...prevDetails.companyName,
          status: 'error',
          errorMessage: 'Company Name is required',
        },
      }));
    } else {
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        companyName: {
          ...prevDetails.companyName,
          status: 'success',
          errorMessage: '',
        },
      }));
    }

    if (!visitorDetails.classification.value) {
      isValid = false;
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        classification: {
          ...prevDetails.classification,
          status: 'error',
          errorMessage: 'Classification is required',
        },
      }));
    } else {
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        classification: {
          ...prevDetails.classification,
          status: 'success',
          errorMessage: '',
        },
      }));
    }

    if (!visitorDetails.industry.value) {
      isValid = false;
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        industry: {
          ...prevDetails.industry,
          status: 'error',
          errorMessage: 'Industry is required',
        },
      }));
    } else {
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        industry: {
          ...prevDetails.industry,
          status: 'success',
          errorMessage: '',
        },
      }));
    }

    if (!visitorDetails.emailId.value) {
      isValid = false;
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        emailId: {
          ...prevDetails.emailId,
          status: 'error',
          errorMessage: 'Email is required',
        },
      }));
    } else {
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        emailId: {
          ...prevDetails.emailId,
          status: 'success',
          errorMessage: '',
        },
      }));
    }

    if (!visitorDetails.mobileNumber.value) {
      isValid = false;
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        mobileNumber: {
          ...prevDetails.mobileNumber,
          status: 'error',
          errorMessage: 'Mobile Number is required',
        },
      }));
    } else {
      if (visitorDetails.mobileNumber.value.length !== 10) {
        isValid = false;
        setVisitorDetails((prevDetails) => ({
          ...prevDetails,
          mobileNumber: {
            ...prevDetails.mobileNumber,
            status: 'error',
            errorMessage: 'Mobile Number must be 10 digits',
          },
        }));
      } else {
        setVisitorDetails((prevDetails) => ({
          ...prevDetails,
          mobileNumber: {
            ...prevDetails.mobileNumber,
            status: 'success',
            errorMessage: '',
          },
        }));
      }
    }

    return isValid;
  };

  console.log({ visitorDetails });

  // Show QR page after saving details and feedback
  const handleSaveAndPay = async (e: any) => {
    e.preventDefault();
    // validate form fields and then make a call to /api/saveVisitor

    if (validateForm()) {
      // saveVisitorDetails();
      try {
        const formData: { [key: string]: string } = {};
        for (const key in visitorDetails) {
          if (visitorDetails[key as keyof VisitorDetails].value)
            formData[key] = visitorDetails[key as keyof VisitorDetails].value;
        }
        if (chapterId) {
          formData['chapterId'] = chapterId;
        } else {
          console.error('Chapter ID is undefined');
        }
        const response = await fetch(
          `/api/${visitorExists ? 'addFeedback' : 'addVisitor'}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          },
        );
        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          setShowQRPage(true);
          setPageNo(3);
        } else {
          alert('Error saving visitor details');
        }
      } catch (error) {
        console.error('Error checking visitor:', error);
      }
    }
    // setShowQRPage(true);
  };

  // Handle date change
  const handleDateChange = (selectedDate: Date) => {
    console.log(selectedDate);

    setVisitorDetails((prevDetails) => ({
      ...prevDetails,
      chapterVisitDate: {
        ...prevDetails.chapterVisitDate,
        value: selectedDate.toISOString().split('T')[0],
      },
    }));
  };

  console.log({ visitorExists });

  return (
    <div className="app-container">
      <h2>Fortune - Pune East</h2>
      <Breadcrumb pageName="EOI" />

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
                    <DatePickerOne
                      label="Date of Chapter Visit* (Only Fridays)"
                      placeholder="mm/dd/yyyy"
                      onDateChange={(selectedDate: Date) =>
                        handleDateChange(selectedDate)
                      }
                      dateFormat="Y-m-d"
                      parentClassName="w-auto flex-1 whitespace-nowrap"
                    />
                    <SelectGroupOne
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
                    />
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
                    label="Industry*"
                    type="text"
                    name="industry"
                    placeholder="eg. Manufacturing, Hospitality, Healthcare"
                    value={visitorDetails.industry.value}
                    onChange={handleInputChange}
                    status={visitorDetails.industry.status}
                    errorMessage={visitorDetails.industry.errorMessage}
                  />
                  <Input
                    label="Email*"
                    type="email"
                    name="emailId"
                    placeholder="john.doe@abc.com"
                    value={visitorDetails.emailId.value}
                    onChange={handleInputChange}
                    status={visitorDetails.emailId.status}
                    errorMessage={visitorDetails.emailId.errorMessage}
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
                  />
                  <div className="flex justify-between mt-10">
                    <Button onClick={() => setShowFeedback(true)}>
                      Fill Feedback Now
                    </Button>
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

      {/* QR Payment Page */}
      {showQRPage && pageNo === 3 && (
        <div className="qr-payment">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Please scan the QR code below to pay:
              </h3>
            </div>
            <p></p>
            <img
              src="https://picsum.photos/200"
              alt="QR Code for Payment"
              className="m-10"
            />
            <p className="ml-2">Note: </p>
            <ul className="list-disc ml-10">
              <li>
                <strong>Amount:</strong> ₹ 850
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
