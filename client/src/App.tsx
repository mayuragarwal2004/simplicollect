import { Children, useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
  useLocation,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import OtpVerification from './pages/Authentication/Otpverification';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import SignUp from './pages/Authentication/SignUp';
// import Continue from './pages/Authentication/Continue';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Member/Dashboard/ECommerce';
import EOI from './pages/Visitor/EOI';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Member/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import AlertsPage from './pages/UiElements/AlertsPage';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import ShareForm from './pages/Visitor/ShareForm';
import VisitorList from './pages/Visitor/VisitorList';
import MemberList from './pages/Member/MemberList';
import Reports from './pages/Member/Reports';
import PackageViewerPage from './pages/Member/Package/PackageViewerPage';
import MemberFeeApproval from './pages/Member/MemberFeeApproval';
import FeeReciever from './pages/Member/FeeReciever';
import RequireAuth from './utils/RequireAut';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import NoChapterPage from './pages/NoChapterPage';
import { Bounce, ToastContainer } from 'react-toastify';
import { Password } from '@mui/icons-material';
import AdminSignIn from './pages/Authentication/AdminSignIn';
import AdminOrganisationsPage from './pages/Admin/organisation/AdminOrganisationsTablePage';
import AdminChaptersTablePage from './pages/Admin/chapters/AdminChaptersTablePage';
import ChapterBasicDetails from './components/Admin/Chapter/CreateNew/ChapterBasicDetails';

const routes = [
  {
    index: true,
    element: <Navigate to="/auth/signin" />,
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <DefaultLayout admin={true} />
      </RequireAuth>
    ),
    children: [
      {
        path: '',
        index: true,
        element: <Navigate to="/admin/organisations" />, // replace with dashboard
      },
      {
        path: 'organisations',
        element: <AdminOrganisationsPage />,
      },
      {
        path: '',
        index: true,
        element: <Navigate to="/admin/chapters" />, // replace with dashboard
      },
      {
        path: 'chapters',
        element: <AdminChaptersTablePage />,
      },
      {
        path: 'chapter-basic-details',
        element: <ChapterBasicDetails />,
      }
    ],
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms-and-conditions',
        element: <TermsAndConditions />,
      },
      {
        path: 'auth',
        children: [
          {
            path: 'admin-sign-in',
            element: <AdminSignIn />,
          },
          {
            path: 'signin',
            element: <SignIn />,
          },
          {
            path: 'otp-verification',
            element: <OtpVerification />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
        ],
      },
      {
        path: 'eoi/:chapterSlug',
        element: <EOI />,
      },
      {
        path: 'member',
        element: <RequireAuth />,
        children: [
          {
            path: 'list',
            element: <MemberList />,
          },
          {
            path: 'fee',
            element: <PackageViewerPage />,
          },
          {
            path: 'fee_approval',
            element: <MemberFeeApproval />,
          },
          {
            path: 'fee-reciver-edit',
            element: <FeeReciever />,
          },
          {
            path: 'share-visitor-form',
            element: <ShareForm />,
          },
          {
            path: 'reports',
            element: <Reports />,
          },
          {
            path: 'profile',
            element: <Profile />,
          }
        ],
      },
      {
        path: 'visitor',
        children: [
          {
            path: 'list',
            element: <VisitorList />,
          },
        ],
      },
      {
        path: '*',
        index: true,
        element: <>404</>,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  // const { pathname } = useLocation();

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
