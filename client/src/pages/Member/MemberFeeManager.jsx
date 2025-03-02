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
import formatDateDDMMYYYY from '../../utils/dateUtility';

const MemberFeeManager = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [chapterMeetings, setChapterMeetings] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [packageParents, setPackageParents] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [cashReceivers, setCashReceivers] = useState([]);
  const [qrReceivers, setQrReceivers] = useState([]);
  const [calculationDate, setCalculationDate] = useState(new Date());
  const [due, setDue] = useState(null);
  const { chapterData } = useData();

  console.log({ cashReceivers, qrReceivers });

  // Fetch meetings data
  useEffect(() => {
    axiosInstance
      .get(`/api/meetings/meetings/${chapterData?.chapterId}`)
      .then((data) => {
        console.log('Fetched Meetings:', data.data);
        setChapterMeetings(data.data);
      })
      .catch((error) => console.error('Error fetching meetings:', error));
  }, []);

  const processPackageData = (packages, due) => {
    return packages.map((pkg) => {
      const amountCaluculations = packageAmountCalculations(
        calculationDate,
        pkg,
        chapterMeetings,
        due,
      );
      return { ...pkg, ...amountCaluculations };
    });
  };

  const fetchDueAmount = () => {
    axiosInstance
      .get(`/api/payment/due/${chapterData?.chapterId}`)
      .then((data) => {
        console.log('Fetched Due Amount:', data.data);
        setDue(data.data.due);
      });
  };

  const fetchPackages = () => {
    axiosInstance
      .get(`/api/packages/all/${chapterData?.chapterId}`)
      .then((data) => {
        // find the unique parent types
        const parentTypes = [
          ...new Set(data.data.map((pkg) => pkg.packageParent)),
        ];
        const responseData = processPackageData(data.data, due);
        setPackageParents(parentTypes);
        setPackageData(responseData);
      })
      .catch((error) => console.error('Error fetching packages:', error));
  };

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
      .get(
        `/api/feeReciever/currentCashReceivers/${
          chapterData?.chapterId
        }?date=${formatDateDDMMYYYY(calculationDate)}`,
      )
      .then((data) => {
        console.log('Fetched Cash Receivers:', data.data);
        setCashReceivers(data.data);
      })
      .catch((error) => console.error('Error fetching cash receivers:', error));
  };

  const fetchCurrentQrReceivers = () => {
    // Fetch QR receivers
    axiosInstance
      .get(
        `/api/feeReciever/currentQRReceivers/${
          chapterData?.chapterId
        }?date=${formatDateDDMMYYYY(calculationDate)}`,
      )
      .then((data) => {
        console.log('Fetched QR Receivers:', data.data);
        setQrReceivers(data.data);
      })
      .catch((error) => console.error('Error fetching QR receivers:', error));
  };

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchDueAmount();
    }
  }, [chapterData]);

  useEffect(() => {
    if (chapterData?.chapterId && due !== null) {
      console.log(`Start Time: ${new Date().toISOString()}`);
      const startTime = Date.now();
      fetchPendingPayments();
      fetchCurrentCashReceivers();
      fetchCurrentQrReceivers();
      fetchPackages();

      console.log(`End Time: ${new Date().toISOString()}`);
      console.log(`Time taken: ${Date.now() - startTime}ms`);
    }
  }, [chapterData, calculationDate, due]);

  const handleDeleteRequest = (transactionId) => {
    axiosInstance
      .delete(`/api/payment/deleteRequest/${transactionId}`)
      .then((response) => {
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

  console.log({ chapterData });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* add alert if there are pending payments */}
      {pendingPayments.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between px-4 py-2 bg-yellow-100 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You have <strong>pending payments</strong>. Please contact admin
              to approve requests to continue.
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
                <p className="text-s text-red-800 bg-red-200 py-2 px-5 rounded-md w-fit">
                  <strong>Status:</strong> {payment.status}
                </p>
                {/* make more button like  */}
                <button
                  className="px-3 py-1 mt-2 text-sm font-semibold text-red-800 border border-red rounded-md hover:bg-red-400 dark:text-red-200 dark:bg-red-400"
                  onClick={() => handleDeleteRequest(payment.transactionId)}
                >
                  Delete Request
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between">
        {/* Left Side: DatePicker */}
        {Boolean(chapterData?.testMode) && (
          <div className="flex items-center space-x-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Calculation Date"
                value={calculationDate}
                onChange={(newDate) => setCalculationDate(newDate)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={
                      calculationDate
                        ? new Date(calculationDate).toLocaleDateString('en-GB')
                        : ''
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        )}
        {/* Right Side: Due Amount, show red for positive value, green for negative value */}
        {due !== null && (
          <div className="flex items-center justify-end mt-4">
            <div className="flex items-center space-x-2">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {due > 0 ? 'Due Amount' : 'Advance Amount'}:
              </p>
              <p
                className={`text-lg font-semibold ${
                  due > 0 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                ₹{Math.abs(due)}
              </p>
            </div>
          </div>
        )}
      </div>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="fee tabs">
            {packageParents.map((parentType, index) => (
              <Tab key={index} label={parentType} />
            ))}
            {/* {chapterFeeConfig.isPerMeetingAllowed && (
              <Tab label="Per Meeting" />
            )}
            {chapterFeeConfig.isMonthlyAllowed && <Tab label="Monthly" />}
            {chapterFeeConfig.isQuarterlyAllowed && <Tab label="Quarterly" />} */}
          </Tabs>
        </Box>
        {
          // Render the tab content based on the selected tab
          packageParents.map((parentType, index) => (
            <CustomTabPanel key={index} value={tabValue} index={index}>
              <PackageAllowed
                pendingPayments={pendingPayments}
                packageData={packageData}
                setPackageData={setPackageData}
                paymentSuccessHandler={paymentSuccessHandler}
                parentType={parentType}
                chapterMeetings={chapterMeetings}
                cashReceivers={cashReceivers}
                qrReceivers={qrReceivers}
              />
            </CustomTabPanel>
          ))
        }
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
