import { useCapacitorNotifications } from './hooks/useCapacitorNotifications';
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
import OtpVerification from './pages/Authentication/OtpVerification';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import EOI from './pages/Visitor/EOI';
import Profile from './pages/Member/Profile';
import Settings from './pages/Settings';
// import Tables from './pages/Tables';
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
import PrivacyPolicy from './pages/simpliCollectPrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiePolicy from './pages/CookiePolicy';
import NoChapterPage from './pages/NoChapterPage';
import { Bounce, ToastContainer } from 'react-toastify';
import AdminSignIn from './pages/Authentication/AdminSignIn';
import AdminOrganisationsPage from './pages/Admin/organisation/AdminOrganisationsTablePage';
import AdminChaptersTablePage from './pages/Admin/chapters/AdminChaptersTablePage';
import AdminChapterLayout from './pages/Admin/chapters/AdminChapterLayout';
import AdminChapterMemberList from './pages/Admin/chapters/AdminChapterMemberList';
import AdminChapterDashboardPage from './pages/Admin/chapters/AdminChapterDashboardPage';
import AdminChapterSettings from './pages/Admin/chapters/AdminChapterSettings';
import AdminMembersTablePage from './pages/Admin/members/AdminMembersTablePage';
import AcceptChapterPaymentPage from './pages/Member/FeeReceiver/AcceptChapterPaymentPage';
import ChapterRoles from './components/Admin/Chapter/CreateNew/ChapterRoles/ChapterRoles';
import MyLedger from './pages/Member/MyLedger';
import DashboardPage from './pages/Admin/Dashboard/DashboardPage'
import TrackVisitor from './pages/Visitor/TrackVisitor';
import SwitchChapter from './pages/Member/SwitchChapter';
import AdminPackage from './pages/Admin/Package/AdminPackage';
import AdminNotificationsPage from './pages/Admin/Notifications/AdminNotificationsPage';
import AdminContactQueriesPage from './pages/Admin/ContactQueries/AdminContactQueriesPage';
import CapacitorTestPage from './pages/Test/CapacitorTestPage';
import ContactUsPage from './pages/Contact/ContactUsPage';
import { useData } from './context/DataContext';
import Home from './pages/Home';

const routes = [
  {
    index: true,
    element: <Home />,
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
        element: <Navigate to="/admin/organisations" />,
      },
      {
        path: 'organisations',
        element: <AdminOrganisationsPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'package',
        element: <AdminPackage />,
      },
      {
        path: 'notifications',
        element: <AdminNotificationsPage />,
      },
      {
        path: 'contact-queries',
        children: [
          {
            index: true,
            element: <AdminContactQueriesPage />,
          },
          {
            path: ':queryId',
            element: <AdminContactQueriesPage />,
          },
        ],
      },
      {
        path: 'chapters',
        children: [
          {
            index: true,
            element: <AdminChaptersTablePage />,
          },
          {
            path: ':chapterSlug',
            element: <AdminChapterLayout />,
            children: [
              {
                path: "dashboard",
                element: <AdminChapterDashboardPage />,
              },
              {
                path: 'member',
                element: <AdminChapterMemberList />,
              },
              {
                path: 'roles',
                element: <ChapterRoles />,
              },
              {
                path: 'settings',
                element: <AdminChapterSettings />,
              },
            ],
          },
        ],
      },
      {
        path: 'members',
        element: <AdminMembersTablePage />,
      },
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
        path: 'cookie-policy',
        element: <CookiePolicy />,
      },
      {
        path: 'contact',
        element: <ContactUsPage />,
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
            path: 'my-ledger',
            element: <MyLedger />,
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
          },
          {
            path: 'switch-chapter',
            element: <SwitchChapter />,
          },
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
        path: 'track-visitor/:visitorId',
        element: <TrackVisitor/>,
      },
      {
        path: 'test/capacitor',
        element: <CapacitorTestPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  const [loadingLocal, setLoadingLocal] = useState<boolean>(true);
  const { loading } = useData();
  
  // Initialize Capacitor push notifications for native platforms
  const capacitorNotifications = useCapacitorNotifications();

  useEffect(() => {
    setTimeout(() => setLoadingLocal(false), 1000);
  }, []);

  // Log Capacitor notification status in development
  useEffect(() => {
    if ((import.meta as any).env.DEV) {
      console.log('Capacitor notifications status:', {
        isSupported: capacitorNotifications.isSupported,
        isInitialized: capacitorNotifications.isInitialized,
        error: capacitorNotifications.error
      });
    }
  }, [capacitorNotifications]);

  return loadingLocal ? (
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
