import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../utils/config';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Eye, EyeOff } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import { parsePhoneNumberWithError } from 'libphonenumber-js';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState(
    location.state?.identifier || '',
  ); // Email or Phone
  const inputType = location.state?.inputType;
  const selectedCountry = location.state?.selectedCountry || 'IN';
  console.log({ identifier, inputType, selectedCountry });

  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPhoneParsed, setIsPhoneParsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const hasSentOtp = useRef(false);

  useEffect(() => {
    if (!location.state?.identifier) {
      navigate('/auth/signin', { state: { from: location.state?.from } });
    } else if (location.state?.identifier) {
      if (inputType === 'phone') {
        try {
          parsePhoneNumberWithError(location.state.identifier);
        } catch (error) {
          toast.error('Invalid phone number format. Redirecting to sign in.');
          console.error('Error parsing phone number:', error);
          setError('Invalid phone number format.');
          navigate('/auth/signin', { state: { from: location.state?.from } });
          return;
        }
      }
    } else {
      setIsPhoneParsed(true);
    }
  }, [location.state, navigate]);

  // Automatically send OTP when the component mounts
  useEffect(() => {
    if (!identifier) return;

    // 👇 Run only once (even in Strict Mode)
    if (!hasSentOtp.current) {
      sendOtp();
      hasSentOtp.current = true;
    }
  }, [identifier]);

  const sendOtp = async () => {
    setOtpMessage('Sending OTP...');
    try {
      const response = await axiosInstance.post('/api/auth/send-otp', {
        identifier: inputType === 'phone' ? identifier.slice(1) : identifier,
      });

      if (response.data.success) {
        setOtpMessage(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to send OTP.');
      } else {
        setError('Failed to send OTP. Please try again later.');
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/api/auth/verify-otp', {
        identifier: inputType === 'phone' ? identifier.slice(1) : identifier,
        otp,
        password: newPassword,
      });

      console.log('OTP verification response:', response);

      if (response.status === 200) {
        toast.success(
          'OTP verified successfully & password set successfully! Please login with your new password.',
        );
        setError('');
        setSuccess(true);
        // After successful OTP, go to sign in and preserve 'from'
        navigate('/auth/signin', { state: { from: location.state?.from } });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to verify OTP.');
      } else {
        setError('Failed to verify OTP. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Authentication', link: '/auth' },
          { name: 'OTP Verification' },
        ]}
      />

      <div className="flex items-center justify-center flex-col">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 max-w-md mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-full text-center mb-6">
              <Link to="/">
                <img
                  className="hidden dark:block mx-auto"
                  src={Logo}
                  alt="Logo"
                />
                <img
                  className="dark:hidden mx-auto"
                  src={LogoDark}
                  alt="Logo"
                />
              </Link>
            </div>

            <form className="w-full" onSubmit={handleVerifyOtp}>
              {/* Email or Phone Input */}
              <div className="mb-4">
                <Label
                  htmlFor="identifier"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  {inputType === 'phone' ? 'Phone Number' : 'Email Address'}
                </Label>
                {inputType === 'phone' ? (
                  <PhoneInput
                    defaultCountry={selectedCountry}
                    value={identifier}
                    onChange={() => {}} // No-op since it's disabled
                    disabled
                    inputComponent={React.forwardRef((props, ref) => (
                      <Input
                        {...props}
                        ref={ref}
                        disabled
                        value={
                          isPhoneParsed
                            ? parsePhoneNumberWithError(identifier)
                                ?.nationalNumber ||
                              identifier ||
                              ''
                            : identifier
                        }
                        autoComplete="username"
                      />
                    ))}
                  />
                ) : (
                  <Input
                    type="email"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    disabled
                    autoComplete="username"
                  />
                )}
              </div>

              {/* OTP Input */}
              <div className="mb-4">
                <Label
                  htmlFor="otp"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Enter OTP
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-gray-500 mt-1 text-center">{otpMessage}</p>
              </div>

              {/* New Password Input */}
              <div className="mb-6">
                <Label
                  htmlFor="newPassword"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <Label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:text-red-400 dark:bg-red-900/20 dark:border-red-800">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md dark:text-green-400 dark:bg-green-900/20 dark:border-green-800">
                  OTP verified successfully! You can now log in with your new
                  password.
                </div>
              )}

              {/* Submit Button */}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP and Set Password'}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-4 text-center">
              <Link to="/auth/signin" className="text-blue-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center flex text-gray-500 dark:text-gray-400">
          A Product by
          <div className="text-blue-500 hover:underline ml-1">
            <a
              href="https://simpliumtechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Simplium Technologies
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
