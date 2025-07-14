import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/BreadcrumbOriginal";
import LogoDark from "../../images/logo/logo-dark.svg";
import Logo from "../../images/logo/logo.svg";
import { axiosInstance } from "../../utils/config";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleSendOtp = async () => {
    setLoadingOtp(true);
    setError("");
    try {
      const response = await axiosInstance.post("/api/auth/forgot-password", {
        email,
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
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoadingReset(true);
    setError("");
    try {
      const response = await axiosInstance.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      const data = await response.json();
      if (response.ok) {
        // After reset, go to sign in and preserve 'from'
        navigate("/auth/signin", { state: { from: location.state?.from } });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to reset password.");
    } finally {
      setLoadingReset(false);
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
                disabled={loadingOtp || loadingReset}
              />
            </div>

            {otpSent && (
              <>
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
                    disabled={loadingReset}
                  />
                </div>
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
                    disabled={loadingReset}
                  />
                </div>
              </>
            )}

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {!otpSent ? (
              <button
                type="button"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                onClick={handleSendOtp}
                disabled={loadingOtp || !email}
              >
                {loadingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                disabled={loadingReset || !otp || !newPassword}
              >
                {loadingReset ? "Resetting Password..." : "Reset Password"}
              </button>
            )}
          </form>

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
