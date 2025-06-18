import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useData } from '@/context/DataContext';
import { axiosInstance } from '../../../utils/config';

export default function UserInfoCard() {

  const { chapterData, memberData } = useData();
  const [currentMemberData, setCurrentMemberData] = useState(memberData);
  const [editMode, setEditMode] = useState({
    names: false,
    email: false,
    phone: false,
    password: false
  });

  const [formData, setFormData] = useState({
    firstName: memberData?.firstName || '',
    lastName: memberData?.lastName || '',
    email: memberData?.email || '',
    phoneNumber: memberData?.phoneNumber || '',
    password: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);



  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const updateLocalMemberData = (updatedFields) => {
    setCurrentMemberData(prev => ({
      ...prev,
      ...updatedFields
    }));
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
        payload = {
          phoneNumber: formData.phoneNumber,
          password: formData.password
        };
        endpoint = `/api/profile/${memberData.memberId}/phone`;
      } else if (field === 'email') {
        payload = {
          email: formData.email,
          password: formData.password
        };
        endpoint = `/api/profile/${memberData.memberId}/email`;
      }

      const response = await axiosInstance.put(endpoint, payload);
      updateLocalMemberData(response.data.data);
      setEditMode(prev => ({ ...prev, [field]: false, password: false }));
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      // Validate passwords match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('New passwords do not match');
      }
    
     
  
      const response = await axiosInstance.put(
        `/api/profile/${memberData.memberId}/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }
      );
  
      if (response.data.success) {
        setShowPasswordDialog(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to update password');
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
            <div className="flex items-center justify-between lg:col-span-2 mt-4">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Password
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  ********
                </p>
              </div>
              <button
                onClick={() => setShowPasswordDialog(true)}
                className="text-blue-500 hover:text-blue-700 mt-6"
              >
                Change
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
          <Dialog open={editMode.email} onOpenChange={() => {
            setEditMode(prev => ({ ...prev, email: false, password: false }));
            setError(null); // Clear error when closing dialog
          }}>
            <DialogContent>
              {!editMode.password ? (
                <>
                  <h3 className="text-lg font-medium mb-4">Update Email</h3>
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
                      onClick={() => {
                        setEditMode(prev => ({ ...prev, email: false }));
                        setError(null); // Clear error when cancelling
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, password: true }))}
                      disabled={isLoading || !formData.email}
                      className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-4">Verify Password</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Please enter your password to confirm the email change
                    </p>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setEditMode(prev => ({ ...prev, password: false }));
                        setError(null); // Clear error when going back
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleSave('email')}
                      disabled={isLoading || !formData.password}
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
          <Dialog
            open={editMode.phone}
            onOpenChange={() => {
              setEditMode(prev => ({ ...prev, phone: false, password: false }));
              setError(null); // Clear error when closing dialog
            }}
          >
            <DialogContent>
              {!editMode.password ? (
                <>
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
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setEditMode(prev => ({ ...prev, phone: false }));
                        setError(null); // Clear error when cancelling
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, password: true }))}
                      disabled={isLoading || !formData.phoneNumber}
                      className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-4">Verify Password</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Please enter your password to confirm the phone number change
                    </p>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setEditMode(prev => ({ ...prev, password: false }));
                        setError(null); // Clear error when going back
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleSave('phone')}
                      disabled={isLoading || !formData.password}
                      className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Phone'}
                    </button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}


        <Dialog open={showPasswordDialog} onOpenChange={() => {
          setShowPasswordDialog(false);
          setError(null);
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }}>
          <DialogContent>
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPasswordDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}