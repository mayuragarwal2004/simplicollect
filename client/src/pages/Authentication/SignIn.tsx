import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { axiosInstance } from '@/utils/config';
import { PhoneInput } from '@/components/ui/phone-input';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [identifier, setIdentifier] = useState(
    location.state?.identifier || '',
  ); // Email or Phone
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('IN'); // Track selected country
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [inputType, setInputType] = useState<'email' | 'phone'>('email');

  // Check if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // If redirected from a protected route, go back there
      const from = location.state?.from?.pathname || '/member/fee';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  // Handle input type toggle
  const handleInputTypeToggle = (type: 'email' | 'phone') => {
    setInputType(type);
    setIdentifier('');
    setPhoneNumber('');
    setSelectedCountry('IN'); // Reset to default country
    setError('');
    setShowPasswordField(false);
    setPassword('');
  };

  // Handle going back to edit identifier
  const handleGoBack = () => {
    setShowPasswordField(false);
    setPassword('');
    setError('');
  };

  // Handle Continue button click
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the appropriate identifier based on input type
      const finalIdentifier =
        inputType === 'phone' ? phoneNumber.slice(1) : identifier;

      if (!finalIdentifier) {
        setError('Please enter a valid email or phone number.');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post('/api/auth/check-member', {
        identifier: finalIdentifier,
      });

      if (!response.data.exists) {
        setError('User does not exist!');
      } else if (response.data.defaultOTP) {
        setLoadingMsg('Sending OTP...');
        navigate('/auth/otp-verification', {
          state: {
            identifier: inputType === 'phone' ? phoneNumber : identifier,
            from: location.state?.from,
            inputType: inputType,
            selectedCountry: selectedCountry,
          },
        });
      } else if (response.data.exists && !response.data.defaultOTP) {
        setShowPasswordField(true);
      }
    } catch (err) {
      setError('Error checking user.');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      setLoadingMsg('Sending OTP...');

      // Use the appropriate identifier based on input type
      // Send phone number directly without slicing
      const finalIdentifier = inputType === 'phone' ? phoneNumber : identifier;

      navigate('/auth/otp-verification', {
        state: {
          identifier: finalIdentifier,
          from: location.state?.from,
          inputType: inputType,
          selectedCountry: selectedCountry,
        },
      });
    } catch (error) {
      setError('Error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign In button click
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the appropriate identifier based on input type
      const finalIdentifier =
        inputType === 'phone' ? phoneNumber.slice(1) : identifier;

      await login(finalIdentifier, password, () => {
        const from = location.state?.from?.pathname || '/member/fee';
        navigate(from, { replace: true });
      });
    } catch (error) {
      setError('Invalid email/phone or password.');
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[{ name: 'Authentication', link: '/auth' }, { name: 'Sign In' }]}
      />
      <div className=" flex items-center justify-center flex-col">
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
              <p className="mt-3 text-gray-500">
                Collect and manage meeting fees with ease
              </p>
            </div>

            <form
              className="w-full"
              onSubmit={showPasswordField ? handleSignIn : handleContinue}
            >
              {/* Input Type Toggle */}
              <div className="mb-4">
                <div className="flex rounded-md border border-stroke dark:border-strokedark overflow-hidden">
                  <Button
                    type="button"
                    variant="ghost"
                    className={`flex-1 rounded-none transition-colors ${
                      inputType === 'email'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => handleInputTypeToggle('email')}
                    disabled={showPasswordField}
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className={`flex-1 rounded-none transition-colors ${
                      inputType === 'phone'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => handleInputTypeToggle('phone')}
                    disabled={showPasswordField}
                  >
                    Phone
                  </Button>
                </div>
              </div>

              {/* Email or Phone Input */}
              <div className="mb-4">
                <Label
                  htmlFor="identifier"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  {inputType === 'email' ? 'Email Address' : 'Phone Number'}
                </Label>

                {/* Edit button for password field */}
                {showPasswordField && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {inputType === 'email' ? identifier : phoneNumber}
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-blue-500 hover:underline"
                      onClick={handleGoBack}
                    >
                      Edit
                    </Button>
                  </div>
                )}

                {inputType === 'email' ? (
                  <Input
                    type="email"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={showPasswordField}
                    autoComplete="username"
                  />
                ) : (
                  <div>
                    <PhoneInput
                      defaultCountry="IN"
                      value={phoneNumber}
                      onChange={(value) => setPhoneNumber(value || '')}
                      onCountryChange={(country) => {
                        setSelectedCountry(country || 'IN');
                      }}
                      placeholder="Enter your phone number"
                      disabled={showPasswordField}
                      autoComplete="username"
                    />
                  </div>
                )}
              </div>

              {/* Password Input (if password is set) */}
              {showPasswordField && (
                <div className="mb-6">
                  <Label
                    htmlFor="password"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:text-red-400 dark:bg-red-900/20 dark:border-red-800">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading
                  ? loadingMsg || 'Checking...'
                  : showPasswordField
                    ? 'Sign In'
                    : 'Continue'}
              </Button>
            </form>

            {/* Forgot Password Link (only shown after password field is displayed) */}
            {showPasswordField && (
              <div className="mt-4 text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-500 hover:underline"
                  disabled={loading}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Button>
              </div>
            )}
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

export default SignIn;
