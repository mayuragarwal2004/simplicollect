import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import EOI from './pages/Visitor/EOI';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import AlertsPage from './pages/UiElements/AlertsPage';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import ShareForm from './pages/Visitor/ShareForm';
import VisitorList from './pages/Visitor/VisitorList';
import MemberList from './pages/Member/MemberList';
import MemberFeeManager from './pages/Member/MemberFeeManager';
import MemberFeeApproval from './pages/Member/MemberFeeApproval';
import FeeReciever from './pages/Member/FeeReciever';
import RequireAuth from './utils/RequireAut';
import { Bounce, ToastContainer } from 'react-toastify';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
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
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="SimpliCollect - Meeting Fee Manager" />
              <ECommerce />
            </>
          }
        />
        <Route path="" element={<RequireAuth />}>
          <Route
            path="/member/list"
            element={
              <>
                <PageTitle title="Member List | SimpliCollect - Meeting Fee Manager" />
                <MemberList />
              </>
            }
          />
          <Route
            path="/member/fee"
            element={
              <>
                <PageTitle title="Member List | SimpliCollect - Meeting Fee Manager" />
                <MemberFeeManager />
              </>
            }
          />
          <Route
            path="/member/fee_approval"
            element={
              <>
                <PageTitle title="Member Fee Approval | SimpliCollect - Meeting Fee Manager" />
                <MemberFeeApproval />
              </>
            }
          />
          <Route
            path="/fee-reciver-edit"
            element={
              <>
                <PageTitle title="Fee Reciever | SimpliCollect - Meeting Fee Manager" />
                <FeeReciever />
              </>
            }
          />
          <Route
            path="/visitor/shareform"
            element={
              <>
                <PageTitle title="Expression of Interest | SimpliCollect - Meeting Fee Manager" />
                <ShareForm />
              </>
            }
          />
          <Route
            path="/visitor/list"
            element={
              <>
                <PageTitle title="Expression of Interest | SimpliCollect - Meeting Fee Manager" />
                <VisitorList />
              </>
            }
          />
        </Route>

        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | SimpliCollect - Meeting Fee Manager" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | SimpliCollect - Meeting Fee Manager" />
              <SignUp />
            </>
          }
        />

        <Route
          path="/eoi/:chapterSlug"
          element={
            <>
              <PageTitle title="Expression of Interest | SimpliCollect - Meeting Fee Manager" />
              <EOI />
            </>
          }
        />

        {/* template pages */}
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | SimpliCollect - Meeting Fee Manager" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | SimpliCollect - Meeting Fee Manager" />
              <Profile />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | SimpliCollect - Meeting Fee Manager" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | SimpliCollect - Meeting Fee Manager" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | SimpliCollect - Meeting Fee Manager" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | SimpliCollect - Meeting Fee Manager" />
              <AlertsPage />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | SimpliCollect - Meeting Fee Manager" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/chapter/list"
          element={
            <>
              <PageTitle title="Expression of Interest | SimpliCollect - Meeting Fee Manager" />
              <VisitorList />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
