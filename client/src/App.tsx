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
import SignIn from './pages/Authentication/SignIn';
import OtpVerification from './pages/Authentication/Otpverification';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import EOI from './pages/Visitor/EOI';
import Profile from './pages/Member/Profile';
import DefaultLayout from './layout/DefaultLayout';
import ShareForm from './pages/Visitor/ShareForm';
import VisitorList from './pages/Visitor/VisitorList';
import MemberList from './pages/Member/MemberList';
import Reports from './pages/Member/Reports';
import PackageViewerPage from './pages/Member/Package/PackageViewerPage';
import MemberFeeApproval from './pages/Member/MemberFeeApproval';
import FeeReciever from './pages/Member/FeeReciever';
import RequireAuth from './utils/RequireAut';
import PrivacyPolicy from './pages/simpliCollectPrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import NoChapterPage from './pages/NoChapterPage';
import { Bounce, ToastContainer } from 'react-toastify';
import AdminSignIn from './pages/Authentication/AdminSignIn';
import AdminOrganisationsPage from './pages/Admin/organisation/AdminOrganisationsTablePage';
import AdminChaptersTablePage from './pages/Admin/chapters/AdminChaptersTablePage';
import AdminChapterLayout from './pages/Admin/chapters/AdminChapterLayout';
import AdminChapterMemberList from './pages/Admin/chapters/AdminChapterMemberList';
import AdminMembersTablePage from './pages/Admin/members/AdminMembersTablePage';
import AcceptChapterPaymentPage from './pages/Member/FeeReceiver/AcceptChapterPaymentPage';
import ChapterRules from './components/Admin/Chapter/CreateNew/ChapterRules'

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
        children:[
          {
            index: true,
            element: <AdminChaptersTablePage />,
          },
          {
            path: ':chapterSlug',
            element: <AdminChapterLayout />,//////
            children:[
              {
                path:"member",
                element:<AdminChapterMemberList />
              },
              {
                path:"roles",
                element: <ChapterRules />,
              }
            ]
          }
        ]
      },

     
      {
        path: 'members',
        element: <AdminMembersTablePage />,
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
          },
          {
            path: 'accept-chapter-transaction',
            element: <AcceptChapterPaymentPage />,
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
