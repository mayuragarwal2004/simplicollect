import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [identifier, setIdentifier] = useState(
    location.state?.identifier || '',
  ); // Email or Phone
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

  // Check if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // If redirected from a protected route, go back there
      const from = location.state?.from?.pathname || '/member/fee';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  // Handle Continue button click
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/check-member', {
        identifier,
      });

      if (!response.data.exists) {
        setError('User does not exist!');
      } else if (response.data.defaultOTP) {
        setLoadingMsg('Sending OTP...');
        navigate('/auth/otp-verification', { state: { identifier, from: location.state?.from } });
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
      navigate('/auth/otp-verification', { state: { identifier, from: location.state?.from } });
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
      await login(identifier, password, () => {
        const from = location.state?.from?.pathname || '/member/fee';
        navigate(from, { replace: true });
      });
    } catch (error) {
      setError('Invalid email/phone or password.');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Sign In" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 max-w-md mx-auto">
        <div className="flex flex-wrap items-center">
          <div className="w-full text-center mb-6">
            <Link to="/">
              <img
                className="hidden dark:block mx-auto"
                src={Logo}
                alt="Logo"
              />
              <img className="dark:hidden mx-auto" src={LogoDark} alt="Logo" />
            </Link>
            <p className="mt-3 text-gray-500">
              Collect and manage meeting fees with ease
            </p>
          </div>

          <form
            className="w-full"
            onSubmit={showPasswordField ? handleSignIn : handleContinue}
          >
            {/* Email or Phone Input */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="identifier"
              >
                Email or Phone
              </label>
              <input
                type="text"
                id="identifier"
                className="w-full p-3 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={showPasswordField}
              />
            </div>

            {/* Password Input (if password is set) */}
            {showPasswordField && (
              <div className="mb-6">
                <label
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-3 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading
                ? loadingMsg || 'Checking...'
                : showPasswordField
                  ? 'Sign In'
                  : 'Continue'}
            </button>
          </form>

          {/* Forgot Password Link (only shown after password field is displayed) */}
          {showPasswordField && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-blue-500 hover:underline disabled:opacity-50"
                disabled={loading}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn;
