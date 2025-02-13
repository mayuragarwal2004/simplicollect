import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PerMeetingAllowed from './MemberFeeManagerComponents/PerMeetingAllowed';
import PackageAllowed from './MemberFeeManagerComponents/PackageAllowed';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import packageAmountCalculations from './MemberFeeManagerComponents/packageAmountCalculation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

const MemberFeeManager = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [chapterMeetings, setChapterMeetings] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [cashReceivers, setCashReceivers] = useState([]);
  const [qrReceivers, setQrReceivers] = useState([]);
  const [calculationDate, setCalculationDate] = useState(new Date());
  const { chapterData } = useData();

  const [chapterFeeConfig] = React.useState({
    isPerMeetingAllowed: true,
    isMonthlyAllowed: true,
    isQuarterlyAllowed: true,
  });

  // Fetch meetings data
  useEffect(() => {
    axiosInstance
      .get(`/api/meetings/meetings/${chapterData.chapterId}`)
      .then((data) => {
        console.log('Fetched Meetings:', data.data);
        setChapterMeetings(data.data);
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
    axiosInstance
      .get(`/api/packages/parent/${parentType}`)
      .then((data) => {
        console.log(`Fetched ${parentType} Packages:`, data.data);
        const responseData = processPackageData(data.data);
        setPackageData(responseData);
      })
      .catch((error) =>
        console.error(`Error fetching ${parentType} packages:`, error),
      );
  }, [tabValue]); // Re-fetch when tabValue changes

  const processPackageData = (packages) => {
    return packages.map((pkg) => {
      // Calculate penalty and discount
      const amountCaluculations = packageAmountCalculations(calculationDate, pkg, chapterMeetings);
      return { ...pkg, ...amountCaluculations };
    });
  };

  useEffect(() => {
    const new_val = processPackageData(packageData);
    setPackageData(new_val);
  }, [calculationDate, chapterMeetings]);

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

  const fetchCurrentCashReceivers = () => {
    // Fetch cash receivers
    axiosInstance
      .get(`/api/feeReciever/currentCashReceivers/${chapterData.chapterId}`)
      .then((data) => {
        console.log('Fetched Cash Receivers:', data.data);
        setCashReceivers(data.data);
      })
      .catch((error) => console.error('Error fetching cash receivers:', error));
  };

  const fetchCurrentQrReceivers = () => {
    // Fetch QR receivers
    axiosInstance
      .get(`/api/feeReciever/currentQRReceivers/${chapterData.chapterId}`)
      .then((data) => {
        console.log('Fetched QR Receivers:', data.data);
        setQrReceivers(data.data);
      })
      .catch((error) => console.error('Error fetching QR receivers:', error));
  };

  useEffect(() => {
    fetchPendingPayments();
    fetchCurrentCashReceivers();
    fetchCurrentQrReceivers();
  }, []);

  const handleDeleteRequest = (transactionId) => {
    axiosInstance
      .delete(`/api/payment/deleteRequest/${transactionId}`)
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
                  onClick={() => handleDeleteRequest(payment.transactionId)}
                >
                  Delete Request
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Left Side: DatePicker */}
      <div className="flex items-center space-x-4">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Calculation Date"
            value={calculationDate}
            onChange={(newDate) => setCalculationDate(newDate)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

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
              setPackageData={setPackageData}
              paymentSuccessHandler={paymentSuccessHandler}
              parentType="Monthly"
              chapterMeetings={chapterMeetings}
              cashReceivers={cashReceivers}
              qrReceivers={qrReceivers}
            />
          </CustomTabPanel>
        )}
        {chapterFeeConfig.isQuarterlyAllowed && (
          <CustomTabPanel value={tabValue} index={2}>
            <PackageAllowed
              pendingPayments={pendingPayments}
              packageData={packageData}
              setPackageData={setPackageData}
              paymentSuccessHandler={paymentSuccessHandler}
              parentType="Quarterly"
              chapterMeetings={chapterMeetings}
              cashReceivers={cashReceivers}
              qrReceivers={qrReceivers}
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
