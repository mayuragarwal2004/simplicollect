import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PerMeetingAllowed from './MemberFeeManagerComponents/PerMeetingAllowed';
import PackageAllowed from './MemberFeeManagerComponents/PackageAllowed';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';

const MemberFeeManager = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [chapterMeetings, setChapterMeetings] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const { chapterData } = useData();

  const [chapterFeeConfig] = React.useState({
    isPerMeetingAllowed: true,
    isMonthlyAllowed: true,
    isQuarterlyAllowed: true,
  });

  // Fetch meetings data
  useEffect(() => {
    axiosInstance.get(`/api/meetings/meetings/${chapterData.chapterId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched Meetings:', data);
        setChapterMeetings(data);
      })
      .catch((error) => console.error('Error fetching meetings:', error));
  }, []);

  // Fetch packages data based on the selected tab's parentType
  useEffect(() => {
    let parentType = '';
    switch (tabValue) {
      case 0: // Per Meeting (no packages)
        return;
      case 1: // Monthly
        parentType = 'Monthly';
        break;
      case 2: // Quarterly
        parentType = 'Quarterly';
        break;
      default:
        return;
    }

    // Fetch packages by parentType
    fetch(`/api/packages/parent/${parentType}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Fetched ${parentType} Packages:`, data);
        setPackageData(data);
      })
      .catch((error) =>
        console.error(`Error fetching ${parentType} packages:`, error),
      );
  }, [tabValue]); // Re-fetch when tabValue changes

  // Fetch pending payments data
  const fetchPendingPayments = () => {
    axiosInstance
      .get('/api/payment/pendingPayments')
      .then((response) => {
        console.log('Fetched Pending Payments:', response.data);
        setPendingPayments(response.data);
      })
      .catch((error) =>
        console.error('Error fetching pending payments:', error),
      );
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const handleDeleteRequest = (packageId) => {
    axiosInstance
      .delete(`/api/payment/deleteRequest/${packageId}`)
      .then((response) => {
        console.log('Deleted Request:', response.data);
        fetchPendingPayments(); // Refresh the pending payments list
      })
      .catch((error) => console.error('Error deleting request:', error));
  };

  const paymentSuccessHandler = () => {
    fetchPendingPayments();
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log({ packageData });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* add alert if there are pending payments */}
      {pendingPayments.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between px-4 py-2 bg-yellow-100 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You have pending payments. Please contact admin to approve
              requests to continue.
            </p>
            <button
              className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-300 rounded-md hover:bg-yellow-400 dark:text-yellow-200 dark:bg-yellow-400"
              onClick={fetchPendingPayments}
            >
              Refresh
            </button>
          </div>
          <div className="mt-4">
            {pendingPayments.map((payment) => (
              <div
                key={payment.packageId}
                className="mb-2 p-4 border border-yellow-300 rounded-md bg-yellow-50"
              >
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Package Name:</strong> {payment.packageName}
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Number of Meetings:</strong>{' '}
                  {payment?.meetingIds?.length}
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Payable Amount:</strong> ₹{payment.payableAmount}
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Payment Date:</strong>{' '}
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Status:</strong> {payment.status}
                </p>

                <button
                  className="px-3 py-1 mt-2 text-sm font-semibold text-red-800 bg-red-300 rounded-md hover:bg-red-400 dark:text-red-200 dark:bg-red-400"
                  onClick={() => handleDeleteRequest(payment.packageId)}
                >
                  Delete Request
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="fee tabs">
            {chapterFeeConfig.isPerMeetingAllowed && (
              <Tab label="Per Meeting" />
            )}
            {chapterFeeConfig.isMonthlyAllowed && <Tab label="Monthly" />}
            {chapterFeeConfig.isQuarterlyAllowed && <Tab label="Quarterly" />}
          </Tabs>
        </Box>
        {chapterFeeConfig.isPerMeetingAllowed && (
          <CustomTabPanel value={tabValue} index={0}>
            <PerMeetingAllowed chapterMeetings={chapterMeetings} />
          </CustomTabPanel>
        )}
        {chapterFeeConfig.isMonthlyAllowed && (
          <CustomTabPanel value={tabValue} index={1}>
            <PackageAllowed
              pendingPayments={pendingPayments}
              packageData={packageData}
              paymentSuccessHandler={paymentSuccessHandler}
              parentType="Monthly"
              chapterMeetings={chapterMeetings}
            />
          </CustomTabPanel>
        )}
        {chapterFeeConfig.isQuarterlyAllowed && (
          <CustomTabPanel value={tabValue} index={2}>
            <PackageAllowed
              pendingPayments={pendingPayments}
              packageData={packageData}
              paymentSuccessHandler={paymentSuccessHandler}
              parentType="Quarterly"
              chapterMeetings={chapterMeetings}
            />
          </CustomTabPanel>
        )}
      </Box>
    </div>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default MemberFeeManager;
