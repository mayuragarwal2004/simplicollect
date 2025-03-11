import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/BreadcrumbOriginal";
import LogoDark from "../../images/logo/logo-dark.svg";
import Logo from "../../images/logo/logo.svg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setError("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to send OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/signin");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to reset password.");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Forgot Password" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 max-w-md mx-auto">
        <div className="flex flex-wrap items-center">
          <div className="w-full text-center mb-6">
            <Link to="/">
              <img className="hidden dark:block mx-auto" src={Logo} alt="Logo" />
              <img className="dark:hidden mx-auto" src={LogoDark} alt="Logo" />
            </Link>
            <p className="mt-3 text-gray-500">Reset your password</p>
          </div>

          <form className="w-full" onSubmit={handleResetPassword}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* OTP Input */}
            {otpSent && (
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
            )}

            {/* New Password Input */}
            {otpSent && (
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
            )}

            {/* Error Message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Send OTP or Reset Password Button */}
            {!otpSent ? (
              <button
                type="button"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            )}
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

export default ForgotPassword;