import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PackageCard from '../../../components/member/Package/PackageCard';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import packageAmountCalculations from '../../../components/member/Package/packageAmountCalculation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import formatDateDDMMYYYY from '../../../utils/dateUtility';
import PackagePayMain from '../../../components/member/Package/PackagePayMain';
import { usePaymentData } from './PaymentDataContext';

const PackageViewer = () => {
  const {
    paymentData: {
      receivers,
      chapterMeetings,
      balance,
      packageParents,
      packageData,
      pendingPayments,
    },
    setPaymentData,
    fetchAllData,
    handleDeletePendingRequest,
  } = usePaymentData();
  const [tabValue, setTabValue] = React.useState(0);
  const [calculationDate, setCalculationDate] = useState(new Date());
  const { chapterData } = useData();

  const paymentSuccessHandler = () => {
    fetchAllData();
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
              onClick={fetchAllData}
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
                  onClick={() =>
                    handleDeletePendingRequest(payment.transactionId)
                  }
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
        {Boolean(chapterData?.testMode) ? (
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
        ) : (
          // display live current date time in the format of "DD/MM/YYYY HH:MM:SS"
          <div className="flex items-center space-x-4">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Current Date:
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              <CurrentDateTime />
            </p>
          </div>
        )}
        {/* Right Side: Due Amount, show red for positive value, green for negative value */}
        {Boolean(balance) && (
          <div className="flex items-center justify-end mt-4">
            <div className="flex items-center space-x-2">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {balance > 0 ? 'Advance Amount' : 'Due Amount'}:
              </p>
              <p
                className={`text-lg font-semibold ${
                  balance > 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                ₹{Math.abs(balance)}
              </p>
            </div>
          </div>
        )}
      </div>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="fee tabs">
            {packageParents?.map((parentType, index) => (
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
          packageParents?.map((parentType, index) => (
            <CustomTabPanel key={index} value={tabValue} index={index}>
              <PackageCard
                pendingPayments={pendingPayments}
                packageData={packageData}
                // setPackageData={setPackageData}
                paymentSuccessHandler={paymentSuccessHandler}
                parentType={parentType}
                receivers={receivers}
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

const CurrentDateTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // updates every second

    // Cleanup on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
      {currentTime.getDate()}-{currentTime.getMonth() + 1}-
      {currentTime.getFullYear()} {currentTime.getHours()}:
      {currentTime.getMinutes().toString().padStart(2, '0')}:
      {currentTime.getSeconds().toString().padStart(2, '0')}
    </p>
  );
};

export default PackageViewer;
