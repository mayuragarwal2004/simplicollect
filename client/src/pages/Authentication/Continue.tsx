import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import LogoDark from "../../images/logo/logo-dark.svg";
import Logo from "../../images/logo/logo.svg";

const Continue: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/check-member", {
        identifier,
      });
    
      console.log("Backend response:", response.data); 

      if (!response.data.exists) {
        setError("User does not exist!");
      } else if (response.data.defaultOTP) {
        navigate("/auth/otp-verification", { state: { identifier } }); // No password → OTP verification
      } else if (response.data.exists && !response.data.defaultOTP) {
        navigate("/auth/signin", { state: { identifier } }); // ✅ Pass email/phone to SignIn
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error checking user.");
    }

    setLoading(false);
  };

  return (
    <>
      <Breadcrumb pageName="Continue" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 max-w-md mx-auto">
        <div className="flex flex-wrap items-center">
          <div className="w-full text-center mb-6">
            <img className="hidden dark:block mx-auto" src={Logo} alt="Logo" />
            <img className="dark:hidden mx-auto" src={LogoDark} alt="Logo" />
            <p className="mt-3 text-gray-500">
              Enter your email or phone number to continue
            </p>
          </div>

          <form className="w-full" onSubmit={handleContinue}>
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
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Continue;
