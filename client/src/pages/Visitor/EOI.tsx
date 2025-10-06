import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';
import Alerts from '../UiElements/Alerts';
import { axiosInstance } from '../../utils/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInput } from '@/components/ui/phone-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, StarIcon } from 'lucide-react';

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
    feelWelcome: { ...initialFieldState },
    visitedBniBefore: { ...initialFieldState },
    referralGroupExperience: { ...initialFieldState },
    meetingId: { ...initialFieldState },
  });

  useEffect(() => {
    const fetchChapterAndMeetings = async () => {
      try {
        // First fetch chapter details
        const chapterResponse = await axiosInstance.get(
          `/api/visitor/verifyVisitorLink/${chapterSlug}`,
        );
        const chapterResult = chapterResponse.data;

        if (chapterResponse.status !== 200) {
          throw new Error(chapterResult.message);
        }

        if (!chapterResult.chapterId) {
          setVerifyLink(false);
          setVerifyLinkMessage(chapterResult.message || 'Chapter not found');
          return;
        }

        setVerifyLink(true);
        setChapterDetails(chapterResult);

        // Then fetch meetings for this chapter
        const meetingsResponse = await axiosInstance(
          `/api/visitor/getChapterMeetings/${chapterResult.chapterId}`,
        );
        const meetingsResult = await meetingsResponse.data;

        console.log({ meetingsResponse, meetingsResult });

        if (meetingsResponse.status === 200) {
          const formatMeetingDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
          };

          const formattedMeetings = {
            upcoming: (meetingsResult.upcoming || []).map((m: any) => ({
              ...m,
              displayDate: formatMeetingDate(m.meetingDate),
            })),
            recent: (meetingsResult.recent || []).map((m: any) => ({
              ...m,
              displayDate: formatMeetingDate(m.meetingDate),
            })),
          };

          setMeetingOptions(formattedMeetings);

          // Set default meeting to the next upcoming meeting if available
          if (formattedMeetings.upcoming.length > 0) {
            setVisitorDetails((prev) => ({
              ...prev,
              meetingId: {
                ...prev.meetingId,
                value: formattedMeetings.upcoming[0].meetingId,
              },
              chapterVisitDate: {
                ...prev.chapterVisitDate,
                value: formattedMeetings.upcoming[0].meetingDate,
              },
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
      const response = await axiosInstance.get(
        `/api/visitor/checkVisitor?phone=${encodeURIComponent(phoneNumber)}`,
      );
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
              value: visitor[key],
            };
          }
        }
        setVisitorDetails(updatedDetails);
      } else {
        setPageNo(2);
        setVisitorDetails((prev) => ({
          ...prev,
          mobileNumber: {
            ...prev.mobileNumber,
            value: phoneNumber,
          },
        }));
      }
    } catch (error) {
      console.error('Error checking visitor:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setVisitorDetails((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof VisitorDetails],
        value,
      },
    }));
  };

  const handleTimeChange = (selectedTime: string) => {
    setVisitorDetails((prev) => ({
      ...prev,
      arrivalTime: {
        ...prev.arrivalTime,
        value: selectedTime,
      },
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const requiredFields: (keyof VisitorDetails)[] = [
      'firstName',
      'lastName',
      'companyName',
      'classification',
      'email',
      'mobileNumber',
      'meetingId',
    ];

    requiredFields.forEach((field) => {
      if (!visitorDetails[field].value) {
        isValid = false;
        setVisitorDetails((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            status: 'error',
            errorMessage: `${field === 'meetingId' ? 'Meeting selection' : field} is required`,
          },
        }));
      } else {
        setVisitorDetails((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            status: 'success',
            errorMessage: '',
          },
        }));
      }
    });

    // Validate mobile number format (for international phone input)
    const mobileValue = visitorDetails.mobileNumber.value;
    if (mobileValue && typeof mobileValue === 'string') {
      // Remove any non-digit characters for validation
      const digitsOnly = mobileValue.replace(/\D/g, '');
      // For Indian numbers, expect at least 10 digits (without country code) or 12-13 with country code
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        isValid = false;
        setVisitorDetails((prev) => ({
          ...prev,
          mobileNumber: {
            ...prev.mobileNumber,
            status: 'error',
            errorMessage: 'Please enter a valid mobile number',
          },
        }));
      }
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
        if (
          fieldValue !== undefined &&
          fieldValue !== null &&
          fieldValue !== ''
        ) {
          formData[key] = fieldValue;
        }
      }

      formData.chapterId = chapterDetails.chapterId;

      // If we have a meetingId, use its date for chapterVisitDate
      if (formData.meetingId) {
        const selectedMeeting = [
          ...meetingOptions.upcoming,
          ...meetingOptions.recent,
        ].find((m) => m.meetingId === formData.meetingId);
        if (selectedMeeting) {
          // Convert to Date object
          const meetingDate = new Date(selectedMeeting.meetingDate);
          // Format as YYYY-MM-DD for MySQL DATE type
          formData.chapterVisitDate = meetingDate.toISOString().split('T')[0];
        }
      }

      const endpoint = visitorExists ? 'addFeedback' : 'addVisitor';
      const response = await axiosInstance.post(
        `/api/visitor/${endpoint}`,
        formData,
      );

      if (response.status === 200) {
        setShowQRPage(true);
        setPageNo(3);
      } else {
        throw new Error(
          response.data.message || 'Error saving visitor details',
        );
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
      <Breadcrumbs items={[{ name: 'Visitor Registration' }]} />

      {/* Phone Number Input Section */}
      {!visitorExists && !showQRPage && pageNo === 1 && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Visitor Login</CardTitle>
            <CardDescription className="text-center">
              Enter your phone number to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  defaultCountry="IN"
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value || '')}
                  placeholder="Enter your phone number"
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Visitor Details Form */}
      {!showFeedback && !showQRPage && pageNo === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Enter New Visitor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveAndPay} className="space-y-6">
              <div className="w-full max-w-4xl mx-auto space-y-6">
                {/* Top row with inviter and meeting */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="invitedBy">
                      Who Invited You to this Meeting?*
                    </Label>
                    <Input
                      id="invitedBy"
                      name="invitedBy"
                      placeholder="Name of Member"
                      value={visitorDetails.invitedBy.value}
                      onChange={handleInputChange}
                      className={
                        visitorDetails.invitedBy.status === 'error'
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {visitorDetails.invitedBy.errorMessage && (
                      <p className="text-sm text-red-500">
                        {visitorDetails.invitedBy.errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meetingId">Select Meeting*</Label>
                    <Select
                      name="meetingId"
                      value={visitorDetails.meetingId.value}
                      onValueChange={(value) => {
                        setVisitorDetails((prev) => ({
                          ...prev,
                          meetingId: { ...prev.meetingId, value },
                        }));
                      }}
                    >
                      <SelectTrigger
                        className={
                          visitorDetails.meetingId.status === 'error'
                            ? 'border-red-500'
                            : ''
                        }
                      >
                        <SelectValue placeholder="Select a meeting" />
                      </SelectTrigger>
                      <SelectContent>
                        {meetingOptions.recent.length > 0 && (
                          <>
                            {meetingOptions.recent.map((meeting) => (
                              <SelectItem
                                key={meeting.meetingId}
                                value={meeting.meetingId}
                              >
                                {meeting.meetingName} - {meeting.displayDate}{' '}
                                (Past)
                              </SelectItem>
                            ))}
                          </>
                        )}
                        {meetingOptions.upcoming.length > 0 && (
                          <>
                            {meetingOptions.upcoming.map((meeting) => (
                              <SelectItem
                                key={meeting.meetingId}
                                value={meeting.meetingId}
                              >
                                {meeting.meetingName} - {meeting.displayDate}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    {visitorDetails.meetingId.errorMessage && (
                      <p className="text-sm text-red-500">
                        {visitorDetails.meetingId.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={visitorDetails.firstName.value}
                      onChange={handleInputChange}
                      className={
                        visitorDetails.firstName.status === 'error'
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {visitorDetails.firstName.errorMessage && (
                      <p className="text-sm text-red-500">
                        {visitorDetails.firstName.errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={visitorDetails.lastName.value}
                      onChange={handleInputChange}
                      className={
                        visitorDetails.lastName.status === 'error'
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {visitorDetails.lastName.errorMessage && (
                      <p className="text-sm text-red-500">
                        {visitorDetails.lastName.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company and classification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name*</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="ABC Corp"
                      value={visitorDetails.companyName.value}
                      onChange={handleInputChange}
                      className={
                        visitorDetails.companyName.status === 'error'
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {visitorDetails.companyName.errorMessage && (
                      <p className="text-sm text-red-500">
                        {visitorDetails.companyName.errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="classification">
                      Professional Classification*
                    </Label>
                    <Input
                      id="classification"
                      name="classification"
                      placeholder="eg. Real Estate Agent, Lawyer"
                      value={visitorDetails.classification.value}
                      onChange={handleInputChange}
                      className={
                        visitorDetails.classification.status === 'error'
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {visitorDetails.classification.errorMessage && (
                      <p className="text-sm text-red-500">
                        {visitorDetails.classification.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email and mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@abc.com"
                      value={visitorDetails.email.value}
                      onChange={handleInputChange}
                      className={
                        visitorDetails.email.status === 'error'
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {visitorDetails.email.errorMessage && (
                      <p className="text-sm text-red-500">
                        {visitorDetails.email.errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number*</Label>
                    <PhoneInput
                      defaultCountry="IN"
                      value={visitorDetails.mobileNumber.value}
                      onChange={(value) => {
                        setVisitorDetails((prev) => ({
                          ...prev,
                          mobileNumber: {
                            ...prev.mobileNumber,
                            value: value || '',
                          },
                        }));
                      }}
                      placeholder="Enter mobile number"
                      disabled={!visitorExists}
                      className={
                        visitorDetails.mobileNumber.status === 'error'
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {visitorDetails.mobileNumber.errorMessage && (
                      <p className="text-sm text-red-500">
                        {visitorDetails.mobileNumber.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button type="submit" className="w-full max-w-xs">
                    Save & Pay
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Feedback Form */}
      {showFeedback && !showQRPage && (
        <Card>
          <CardHeader>
            <CardTitle>Visitor Feedback</CardTitle>
            <CardDescription>
              Please share your experience with us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveAndPay} className="space-y-6">
              <div className="w-full max-w-4xl mx-auto space-y-6">
                {/* Next Steps */}
                <div className="space-y-3">
                  <Label>
                    Given your experience today, which option best describes the
                    next steps for you?
                  </Label>
                  <RadioGroup
                    value={visitorDetails.nextStep.value}
                    onValueChange={(value) => {
                      setVisitorDetails((prev) => ({
                        ...prev,
                        nextStep: { ...prev.nextStep, value },
                      }));
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="I'd like to apply today" id="next-apply" className="mt-1" />
                      <Label htmlFor="next-apply" className="cursor-pointer text-sm leading-relaxed">
                        I'd like to apply today
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="Yes, I like it - I just have some questions that need answering" id="next-questions" className="mt-1" />
                      <Label htmlFor="next-questions" className="cursor-pointer text-sm leading-relaxed">
                        Yes, I like it - I just have some questions that need answering
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="I like it - I'm just not able to make the commitments at the moment" id="next-commitments" className="mt-1" />
                      <Label htmlFor="next-commitments" className="cursor-pointer text-sm leading-relaxed">
                        I like it - I'm just not able to make the commitments at the moment
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Arrival Time */}
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">
                    What time did you arrive at the meeting?
                  </Label>
                  <Input
                    id="arrivalTime"
                    name="arrivalTime"
                    placeholder="e.g., 9:30 AM"
                    value={visitorDetails.arrivalTime.value}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Feel Welcome */}
                <div className="space-y-2">
                  <Label>Did the Chapter make you feel welcome?</Label>
                  <RadioGroup
                    value={visitorDetails.feelWelcome.value}
                    onValueChange={(value) => {
                      setVisitorDetails((prev) => ({
                        ...prev,
                        feelWelcome: { ...prev.feelWelcome, value },
                      }));
                    }}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="welcome-yes" />
                      <Label htmlFor="welcome-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="welcome-no" />
                      <Label htmlFor="welcome-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Visited BNI Before */}
                <div className="space-y-2">
                  <Label>Have you visited BNI before?</Label>
                  <RadioGroup
                    value={visitorDetails.visitedBniBefore.value}
                    onValueChange={(value) => {
                      setVisitorDetails((prev) => ({
                        ...prev,
                        visitedBniBefore: { ...prev.visitedBniBefore, value },
                      }));
                    }}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="visited-yes" />
                      <Label htmlFor="visited-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="visited-no" />
                      <Label htmlFor="visited-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Referral Group Experience */}
                <div className="space-y-2">
                  <Label htmlFor="referralGroupExperience">
                    Have you been involved in a business referral group before?
                    (If yes, how did it compare?)
                  </Label>
                  <Textarea
                    id="referralGroupExperience"
                    name="referralGroupExperience"
                    placeholder="Your response here"
                    value={visitorDetails.referralGroupExperience.value}
                    onChange={handleInputChange}
                    className={
                      visitorDetails.referralGroupExperience.status === 'error'
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {visitorDetails.referralGroupExperience.errorMessage && (
                    <p className="text-sm text-red-500">
                      {visitorDetails.referralGroupExperience.errorMessage}
                    </p>
                  )}
                </div>

                {/* Rating with Stars */}
                <div className="space-y-3">
                  <Label>
                    On a scale of 1-10, How was your experience in this meeting?
                  </Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <Button
                        key={rating}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVisitorDetails((prev) => ({
                            ...prev,
                            feedbackScore: {
                              ...prev.feedbackScore,
                              value: rating.toString(),
                            },
                          }));
                        }}
                        className={`w-10 h-10 p-0 rounded-full transition-all duration-200 ${
                          parseInt(visitorDetails.feedbackScore.value) >= rating
                            ? 'bg-yellow-400 border-yellow-400 text-white hover:bg-yellow-500'
                            : 'hover:bg-yellow-50 hover:border-yellow-300'
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            parseInt(visitorDetails.feedbackScore.value) >=
                            rating
                              ? 'fill-current'
                              : ''
                          }`}
                        />
                      </Button>
                    ))}
                    {visitorDetails.feedbackScore.value && (
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rating: {visitorDetails.feedbackScore.value}/10
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional Feedback */}
                <div className="space-y-2">
                  <Label htmlFor="feedbackComments">
                    Do you have any suggestions or feedback?
                  </Label>
                  <Textarea
                    id="feedbackComments"
                    name="feedbackComments"
                    placeholder="Your response here"
                    value={visitorDetails.feedbackComments.value}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-center pt-6">
                  <Button type="submit" className="w-full max-w-xs">
                    {visitorExists ? 'Save & Complete' : 'Save & Pay'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
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
              <p className="ml-2 text-gray-800 dark:text-gray-200 font-medium">
                Note:{' '}
              </p>
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
