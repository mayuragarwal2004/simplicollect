import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import { useAuth } from '../../context/AuthContext';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get the state from navigation
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState(location.state?.identifier || "");
  const [identifier, setIdentifier] = useState(location.state?.identifier || ""); // Email or Phone
  const [password, setPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic here (e.g., API call)
    console.log("Identifier:", identifier, "Password:", password);
    await login(identifier, password);
  };

  // console.log('isAuthenticated:', isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }
    , [isAuthenticated]);

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

          <form className="w-full" onSubmit={handleSignIn}>
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="email"
              >
                Email
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

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 flex justify-between">
            <p onClick={() => navigate(-1)} className="text-gray-500 cursor-pointer hover:underline">
              Change
            </p>
            <Link to="/forgot-password" className=" pl-50 text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>


          {/* <div className="mt-4 text-center">
            <span className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
            </span>
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SignIn;
