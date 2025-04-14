import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useData } from '@/context/DataContext';
import { axiosInstance } from '../../../utils/config';

export default function UserInfoCard() {
  const { chapterData, memberData } = useData();
  const [currentMemberData, setCurrentMemberData] = useState(memberData);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState({
    names: false,
    email: false,
    phone: false
  });
  
  const [formData, setFormData] = useState({
    firstName: memberData?.firstName || '',
    lastName: memberData?.lastName || '',
    email: memberData?.email || '',
    phoneNumber: memberData?.phoneNumber || ''
  });

  // Email OTP states
  const [emailUpdateState, setEmailUpdateState] = useState({
    step: 0, // 0 = not started, 1 = verify old email, 2 = enter new email, 3 = verify new email
    token: '',
    newEmail: '',
    otp: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateLocalMemberData = (updatedFields) => {
    setCurrentMemberData(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const handleOTPChange = (e) => {
    setEmailUpdateState(prev => ({ ...prev, otp: e.target.value }));
  };

  const handleSave = async (field) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let payload = {};
      let endpoint = '';
      
      if (field === 'names') {
        payload = {
          firstName: formData.firstName,
          lastName: formData.lastName
        };
        endpoint = `/api/profile/${memberData.memberId}/name`;
      } else if (field === 'phone') {
        payload = { phoneNumber: formData.phoneNumber };
        endpoint = `/api/profile/${memberData.memberId}/phone`;
      }

      const response = await axiosInstance.put(endpoint, payload);
      updateLocalMemberData(response.data.data);
      setEditMode(prev => ({ ...prev, [field]: false }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
    } finally {
      setIsLoading(false);
    }
  };

  const initiateEmailChange = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        `/api/profile/${memberData.memberId}/initiate-email-change`
      );

      setEmailUpdateState({
        step: 1,
        token: response.data.token,
        newEmail: '',
        otp: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to initiate email change');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOldEmailOTP = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.post(
        `/api/profile/${memberData.memberId}/verify-old-email-otp`,
        {
          otp: emailUpdateState.otp,
          token: emailUpdateState.token
        }
      );

      setEmailUpdateState(prev => ({
        ...prev,
        step: 2,
        otp: ''
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };
  const sendNewEmailOTP = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
  
      const response = await axiosInstance.post(
        `/api/profile/${memberData.memberId}/send-new-email-otp`,
        {
          newEmail: formData.email,
          token: emailUpdateState.token
        }
      );
  
      // Only proceed to step 3 if OTP was successfully sent
      if (response.data.success) {
        setEmailUpdateState(prev => ({
          ...prev,
          step: 3, // Move to verification step
          newEmail: formData.email,
          otp: '' // Reset OTP field
        }));
      } else {
        throw new Error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to send OTP');
      // Keep the dialog open on error
      setEditMode(prev => ({ ...prev, email: true }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyNewEmailAndUpdate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        `/api/profile/${memberData.memberId}/verify-new-email-and-update`,
        {
          otp: emailUpdateState.otp,
          token: emailUpdateState.token,
          newEmail: emailUpdateState.newEmail
        }
      );

      updateLocalMemberData({ email: emailUpdateState.newEmail });
      setEditMode(prev => ({ ...prev, email: false }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = emailUpdateState.step === 1
        ? `/api/profile/${memberData.memberId}/resend-old-email-otp`
        : `/api/profile/${memberData.memberId}/resend-new-email-otp`;

      await axiosInstance.post(endpoint, { token: emailUpdateState.token });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="text-left">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {/* First Name */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    First Name
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {currentMemberData?.firstName}
                  </p>
                </div>
              </div>
            </div>

            {/* Last Name */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Last Name
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {currentMemberData?.lastName}
                  </p>
                </div>
                <button
                  onClick={() => setEditMode(prev => ({ ...prev, names: true }))}
                  className="text-blue-500 hover:text-blue-700 mt-6"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between lg:col-span-2">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Email address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {currentMemberData?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, email: currentMemberData.email }));
                  setEmailUpdateState({
                    step: 0,
                    token: '',
                    newEmail: '',
                    otp: ''
                  });
                  setEditMode(prev => ({ ...prev, email: true }));
                }}
                className="text-blue-500 hover:text-blue-700 mt-6"
              >
                Edit
              </button>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between lg:col-span-2">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {memberData?.phoneNumber}
                </p>
              </div>
              <button
                onClick={() => setEditMode(prev => ({ ...prev, phone: true }))}
                className="text-blue-500 hover:text-blue-700 mt-6"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Edit Name Modal */}
        {editMode.names && (
          <Dialog open={editMode.names} onOpenChange={() => setEditMode(prev => ({ ...prev, names: false }))}>
            <DialogContent>
              <h3 className="text-lg font-medium mb-4">Edit Name</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setEditMode(prev => ({ ...prev, names: false }))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave('names')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Email Modal */}
        {editMode.email && (
          <Dialog open={editMode.email} onOpenChange={() => setEditMode(prev => ({ ...prev, email: false }))}>
            <DialogContent>
              <h3 className="text-lg font-medium mb-4">
                {emailUpdateState.step === 0 ? 'Update Email' : 
                 emailUpdateState.step === 1 ? 'Verify Current Email' : 
                 emailUpdateState.step === 2 ? 'Enter New Email' : 'Verify New Email'}
              </h3>
              
              {emailUpdateState.step === 0 && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      To change your email, we'll need to verify both your current and new email addresses.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, email: false }))}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={initiateEmailChange}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Sending OTP...' : 'Continue'}
                    </button>
                  </div>
                </>
              )}

              {emailUpdateState.step === 1 && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We've sent a 6-digit OTP to your current email address: {memberData.email}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={emailUpdateState.otp}
                      onChange={handleOTPChange}
                      maxLength={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={resendOTP}
                      disabled={isLoading}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                    <span className="text-sm text-gray-500">Valid for 10 minutes</span>
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, email: false }))}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={verifyOldEmailOTP}
                      disabled={isLoading || emailUpdateState.otp.length !== 6}
                      className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </>
              )}

              {emailUpdateState.step === 2 && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please enter your new email address
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, email: false }))}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendNewEmailOTP}
                      disabled={isLoading || !formData.email}
                      className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                </>
              )}

              {emailUpdateState.step === 3 && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We've sent a 6-digit OTP to your new email address: {emailUpdateState.newEmail}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={emailUpdateState.otp}
                      onChange={handleOTPChange}
                      maxLength={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={resendOTP}
                      disabled={isLoading}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                    <span className="text-sm text-gray-500">Valid for 10 minutes</span>
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, email: false }))}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={verifyNewEmailAndUpdate}
                      disabled={isLoading || emailUpdateState.otp.length !== 6}
                      className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Email'}
                    </button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Phone Modal */}
        {editMode.phone && (
          <Dialog open={editMode.phone} onOpenChange={() => setEditMode(prev => ({ ...prev, phone: false }))}>
            <DialogContent>
              <h3 className="text-lg font-medium mb-4">Edit Phone Number</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setEditMode(prev => ({ ...prev, phone: false }))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave('phone')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}