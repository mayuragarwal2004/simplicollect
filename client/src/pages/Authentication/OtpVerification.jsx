import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import { toast } from 'react-toastify';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP } = useAuth();
  const [identifier, setIdentifier] = useState(location.state?.identifier || ''); // Email or Phone
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!location.state?.identifier) {
      navigate('/auth/forgot-password');
    }
  }, [location.state, navigate]);

  // Automatically send OTP when the component mounts
  useEffect(() => {
    const sendOtp = async () => {
      try {
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to send OTP.');
      }
    };

    sendOtp();
  }, [identifier]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
        const response = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, otp,password: newPassword }), // Send password as "password"
        });
        const data = await response.json();
        if (response.ok) {
            toast.success('password has been set login now');
            setError("");
            navigate("/auth/signin");
        } else {
            setError(data.message);
        }
    } catch (error) {
        console.log(error);
        setError("Failed to verify OTP.");
    }
  };

  return (
    <>
      <Breadcrumb pageName="OTP Verification" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 max-w-md mx-auto">
        <div className="flex flex-wrap items-center">
          <div className="w-full text-center mb-6">
            <Link to="/">
              <img className="hidden dark:block mx-auto" src={Logo} alt="Logo" />
              <img className="dark:hidden mx-auto" src={LogoDark} alt="Logo" />
            </Link>
            <p className="mt-3 text-gray-500">Enter the OTP sent to your email/phone</p>
          </div>

          <form className="w-full" onSubmit={handleVerifyOtp}>
            {/* Email or Phone Input */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="identifier">
                Email or Phone Number
              </label>
              <input
                type="text"
                id="identifier"
                className="w-full p-3 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={!!location.state?.identifier} // Disable if set from previous page
              />
            </div>

            {/* OTP Input */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="otp">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full p-3 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            {/* New Password Input */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full p-3 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP and Set Password'}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <Link to="/auth/signin" className="text-blue-500 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;