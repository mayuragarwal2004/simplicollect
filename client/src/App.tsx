import { useCapacitorNotifications } from './hooks/useCapacitorNotifications';
import { useAppInstallBanner } from './hooks/useAppInstallBanner';
import { AppInstallBanner } from './components/AppInstallBanner';
import { APP_CONFIG } from './config/appConfig';
import { Suspense, useEffect, useState, lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Bounce } from 'react-toastify';
import { Capacitor } from '@capacitor/core';

import Loader from './common/Loader';
import SuspenseLoader from './components/SuspenseLoader';
import { useData } from './context/DataContext';

// Lazy load all components
const SignIn = lazy(() => import('./pages/Authentication/SignIn'));
const OtpVerification = lazy(
  () => import('./pages/Authentication/OtpVerification'),
);
const ForgotPassword = lazy(
  () => import('./pages/Authentication/ForgotPassword'),
);
const AdminSignIn = lazy(() => import('./pages/Authentication/AdminSignIn'));
const EOI = lazy(() => import('./pages/Visitor/EOI'));
const Profile = lazy(() => import('./pages/Member/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const AlertsPage = lazy(() => import('./pages/UiElements/AlertsPage'));
const Buttons = lazy(() => import('./pages/UiElements/Buttons'));
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const ShareForm = lazy(() => import('./pages/Visitor/ShareForm'));
const VisitorList = lazy(() => import('./pages/Visitor/VisitorList'));
const MemberList = lazy(() => import('./pages/Member/MemberList'));
const Home = lazy(() => import('./pages/Home'));
const RequireAuth = lazy(() => import('./utils/RequireAut'));
const PrivacyPolicy = lazy(() => import('./pages/simpliCollectPrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const ContactUsPage = lazy(() => import('./pages/Contact/ContactUsPage'));
const TrackVisitor = lazy(() => import('./pages/Visitor/TrackVisitor'));
const CapacitorTestPage = lazy(() => import('./pages/Test/CapacitorTestPage'));
const PaymentDueBroadcast = lazy(() => import('./components/member/Reports/PaymentDueBroadcast'));

// Admin components
const AdminOrganisationsPage = lazy(
  () => import('./pages/Admin/organisation/AdminOrganisationsTablePage'),
);
const DashboardPage = lazy(
  () => import('./pages/Admin/Dashboard/DashboardPage'),
);
const AdminPackage = lazy(() => import('./pages/Admin/Package/AdminPackage'));
const AdminNotificationsPage = lazy(
  () => import('./pages/Admin/Notifications/AdminNotificationsPage'),
);
const AdminContactQueriesPage = lazy(
  () => import('./pages/Admin/ContactQueries/AdminContactQueriesPage'),
);
const AdminChaptersTablePage = lazy(
  () => import('./pages/Admin/chapters/AdminChaptersTablePage'),
);
const AdminChapterLayout = lazy(
  () => import('./pages/Admin/chapters/AdminChapterLayout'),
);
const AdminChapterDashboardPage = lazy(
  () => import('./pages/Admin/chapters/AdminChapterDashboardPage'),
);
const AdminChapterMemberList = lazy(
  () => import('./pages/Admin/chapters/AdminChapterMemberList'),
);
const AdminChaptersClustersPage = lazy(
  () => import('./pages/Admin/chapters/AdminChaptersClustersPage'),
);
const AdminChapterClusterDetailsPage = lazy(
  () => import('./pages/Admin/chapters/AdminChapterClusterDetailsPage'),
);
const AdminChapterClustersManagePage = lazy(
  () => import('./pages/Admin/chapters/AdminChapterClustersManagePage'),
);
const ChapterRoles = lazy(
  () =>
    import('./components/Admin/Chapter/CreateNew/ChapterRoles/ChapterRoles'),
);
const AdminChapterSettings = lazy(
  () => import('./pages/Admin/chapters/AdminChapterSettings'),
);
const AdminMembersTablePage = lazy(
  () => import('./pages/Admin/members/AdminMembersTablePage'),
);

// Member components
const PackageViewerPage = lazy(
  () => import('./pages/Member/Package/PackageViewerPage'),
);
const MyLedger = lazy(() => import('./pages/Member/MyLedger'));
const MemberFeeApproval = lazy(
  () => import('./pages/Member/MemberFeeApproval'),
);
const FeeReciever = lazy(() => import('./pages/Member/FeeReciever'));
const Reports = lazy(() => import('./pages/Member/Reports'));
const AcceptChapterPaymentPage = lazy(
  () => import('./pages/Member/FeeReceiver/AcceptChapterPaymentPage'),
);
const SwitchChapter = lazy(() => import('./pages/Member/SwitchChapter'));

// Wrapper component for Suspense
const SuspenseWrapper = ({
  children,
  message,
}: {
  children: React.ReactNode;
  message?: string;
}) => (
  <Suspense fallback={<SuspenseLoader message={message} />}>
    {children}
  </Suspense>
);

const routes = [
  {
    index: true,
    element: (
      <SuspenseWrapper message="Loading Home">
        <Home />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/admin',
    element: (
      <SuspenseWrapper message="Loading Admin Panel">
        <RequireAuth>
          <DefaultLayout admin={true} />
        </RequireAuth>
      </SuspenseWrapper>
    ),
    children: [
      {
        path: '',
        index: true,
        element: <Navigate to="/admin/organisations" />,
      },
      {
        path: 'organisations',
        element: (
          <SuspenseWrapper message="Loading Organizations">
            <AdminOrganisationsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper message="Loading Dashboard">
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'package',
        element: (
          <SuspenseWrapper message="Loading Packages">
            <AdminPackage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'notifications',
        element: (
          <SuspenseWrapper message="Loading Notifications">
            <AdminNotificationsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'contact-queries',
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper message="Loading Contact Queries">
                <AdminContactQueriesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ':queryId',
            element: (
              <SuspenseWrapper message="Loading Contact Query">
                <AdminContactQueriesPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: 'chapters',
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper message="Loading Chapters">
                <AdminChaptersTablePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ':chapterSlug',
            element: (
              <SuspenseWrapper message="Loading Chapter">
                <AdminChapterLayout />
              </SuspenseWrapper>
            ),
            children: [
              {
                path: 'dashboard',
                element: (
                  <SuspenseWrapper message="Loading Chapter Dashboard">
                    <AdminChapterDashboardPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'member',
                element: (
                  <SuspenseWrapper message="Loading Members">
                    <AdminChapterMemberList />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'roles',
                element: (
                  <SuspenseWrapper message="Loading Roles">
                    <ChapterRoles />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'clusters',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper message="Loading Clusters">
                        <AdminChaptersClustersPage />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'manage',
                    element: (
                      <SuspenseWrapper message="Loading Cluster Management">
                        <AdminChapterClustersManagePage />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: ':clusterId',
                    element: (
                      <SuspenseWrapper message="Loading Cluster">
                        <AdminChapterClusterDetailsPage />
                      </SuspenseWrapper>
                    ),
                  },
                ],
              },
              {
                path: 'settings',
                element: (
                  <SuspenseWrapper message="Loading Settings">
                    <AdminChapterSettings />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'members',
        element: (
          <SuspenseWrapper message="Loading Members">
            <AdminMembersTablePage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/',
    element: (
      <SuspenseWrapper message="Loading Layout">
        <DefaultLayout />
      </SuspenseWrapper>
    ),
    children: [
      {
        path: 'privacy-policy',
        element: (
          <SuspenseWrapper message="Loading Privacy Policy">
            <PrivacyPolicy />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'terms-and-conditions',
        element: (
          <SuspenseWrapper message="Loading Terms & Conditions">
            <TermsAndConditions />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'cookie-policy',
        element: (
          <SuspenseWrapper message="Loading Cookie Policy">
            <CookiePolicy />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'contact',
        element: (
          <SuspenseWrapper message="Loading Contact">
            <ContactUsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'auth',
        children: [
          {
            path: 'admin-sign-in',
            element: (
              <SuspenseWrapper message="Loading Admin Sign In">
                <AdminSignIn />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'signin',
            element: (
              <SuspenseWrapper message="Loading Sign In">
                <SignIn />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'otp-verification',
            element: (
              <SuspenseWrapper message="Verifying OTP">
                <OtpVerification />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'forgot-password',
            element: (
              <SuspenseWrapper message="Loading Password Reset">
                <ForgotPassword />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: 'eoi/:chapterSlug',
        element: (
          <SuspenseWrapper message="Loading Expression of Interest">
            <EOI />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'member',
        element: (
          <SuspenseWrapper message="Loading Member Area">
            <RequireAuth />
          </SuspenseWrapper>
        ),
        children: [
          {
            path: 'list',
            element: (
              <SuspenseWrapper message="Loading Member List">
                <MemberList />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'fee',
            element: (
              <SuspenseWrapper message="Loading Fee Information">
                <PackageViewerPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'my-ledger',
            element: (
              <SuspenseWrapper message="Loading Ledger">
                <MyLedger />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'fee_approval',
            element: (
              <SuspenseWrapper message="Loading Fee Approval">
                <MemberFeeApproval />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'fee-reciver-edit',
            element: (
              <SuspenseWrapper message="Loading Fee Receiver">
                <FeeReciever />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'share-visitor-form',
            element: (
              <SuspenseWrapper message="Loading Visitor Form">
                <ShareForm />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'reports',
            element: (
              <SuspenseWrapper message="Loading Reports">
                <Reports />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'payment-due-broadcast',
            element: (
              <SuspenseWrapper message="Loading Payment Due Broadcast">
                <PaymentDueBroadcast />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'profile',
            element: (
              <SuspenseWrapper message="Loading Profile">
                <Profile />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'accept-chapter-transaction',
            element: (
              <SuspenseWrapper message="Loading Payment Page">
                <AcceptChapterPaymentPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'switch-chapter',
            element: (
              <SuspenseWrapper message="Loading Chapters">
                <SwitchChapter />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: 'visitor',
        children: [
          {
            path: 'list',
            element: (
              <SuspenseWrapper message="Loading Visitor List">
                <VisitorList />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: 'track-visitor/:visitorId',
        element: (
          <SuspenseWrapper message="Loading Visitor Details">
            <TrackVisitor />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'test/capacitor',
        element: (
          <SuspenseWrapper message="Loading Test Page">
            <CapacitorTestPage />
          </SuspenseWrapper>
        ),
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

  // Initialize app install banner for web users
  const appInstallBanner = useAppInstallBanner({
    appName: APP_CONFIG.appName,
    appStoreLinks: APP_CONFIG.storeLinks,
    showDelay: (import.meta as any).env.DEV
      ? APP_CONFIG.installBanner.development.showDelay
      : APP_CONFIG.installBanner.showDelay,
    hideAfterDays: APP_CONFIG.installBanner.hideAfterDays,
  });

  useEffect(() => {
    setTimeout(() => setLoadingLocal(false), 1000);

    // Preload critical components for Capacitor apps
    if (Capacitor.isNativePlatform()) {
      // Preload the most commonly used screens
      setTimeout(() => {
        import('./pages/Member/Profile');
        import('./pages/Member/MemberList');
        import('./pages/Authentication/SignIn');
      }, 2000); // Preload after initial load
    }
  }, []);

  // Log Capacitor notification status in development
  useEffect(() => {
    if ((import.meta as any).env.DEV) {
      console.log('Capacitor notifications status:', {
        isSupported: capacitorNotifications.isSupported,
        isInitialized: capacitorNotifications.isInitialized,
        error: capacitorNotifications.error,
      });

      console.log('App install banner status:', {
        showBanner: appInstallBanner.showBanner,
        deviceInfo: appInstallBanner.deviceInfo,
      });
    }
  }, [capacitorNotifications, appInstallBanner]);

  return loadingLocal ? (
    <SuspenseLoader message="Initializing SimpliCollect..." showLogo={true} />
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

      {/* App Install Banner for web users */}
      {APP_CONFIG.features.enableAppInstallBanner &&
        appInstallBanner.showBanner && (
          <AppInstallBanner
            appName={APP_CONFIG.appName}
            onDownload={appInstallBanner.handleDownload}
            onDismiss={appInstallBanner.dismissBanner}
            deviceInfo={appInstallBanner.deviceInfo}
          />
        )}
    </>
  );
}

export default App;
