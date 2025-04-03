import React, { createContext, useState, useEffect, useContext } from 'react';
import { useData } from '../../../context/DataContext';
import { axiosInstance } from '../../../utils/config';
import formatDateDDMMYYYY from '../../../utils/dateUtility';
import packageAmountCalculations from './packageAmountCalculation';
import { toast } from 'react-toastify';

// Create a context
const PaymentDataContext = createContext();

// Create a provider component
export const PaymentDataProvider = ({ children }) => {
  const { chapterData } = useData();
  const calculationDate = new Date();

  const [paymentData, setPaymentData] = useState({
    selectedReceiver: null, // maybe reset on exiting package
    saveReceiverSelection: false,
    selectedReceiverObject: null,

    receivers: [],
    selectedPackage: null, // reset on exiting package
    pendingPayments: [],
    packageData: null,
    parentType: null,
  });

  const resetPaymentData = () => {
    setPaymentData((prev) => ({
      ...prev,
      selectedPackage: null,
      selectedReceiver: null,
      paymentMethod: 'cash',
      selectedReceiverObject: null,
      saveReceiverSelection: false,
    }));
  };

  const fetchCurrentReceivers = async () => {
    // Fetch all receivers
    try {
      const data = await axiosInstance
        .get(`/api/feeReciever/currentReceivers/${chapterData?.chapterId}`, {
          params: {
            date: formatDateDDMMYYYY(calculationDate),
          },
        })
        .then((data) => {
          console.log('Fetched Current Receivers:', data.data);
          setPaymentData((prev) => ({
            ...prev,
            receivers: data.data,
          }));
        })
        .catch((error) =>
          console.error('Error fetching current receivers:', error),
        );
    } catch (error) {
      console.error('Error fetching current receivers:', error);
    }
  };

  const fetchMeetings = async () => {
    // Fetch all meetings
    axiosInstance
      .get(`/api/meetings/meetings/${chapterData?.chapterId}`)
      .then((data) => {
        console.log('Fetched Chapter Meetings:', data.data);
        setPaymentData((prev) => ({
          ...prev,
          chapterMeetings: data.data,
        }));
      })
      .catch((error) =>
        console.error('Error fetching chapter meetings:', error),
      );
  };

  const fetchDueAmount = async () => {
    // Fetch all balance payments
    axiosInstance
      .get(`/api/payment/balance/${chapterData?.chapterId}`)
      .then((data) => {
        console.log('Fetched Due Amounts:', data.data);
        setPaymentData((prev) => ({
          ...prev,
          balance: data.data.balance,
        }));
      })
      .catch((error) =>
        console.error('Error fetching balance amounts:', error),
      );
  };

  const fetchPackages = () => {
    axiosInstance
      .get(`/api/packages/all/${chapterData?.chapterId}`)
      .then((data) => {
        // find the unique parent types
        const parentTypes = [
          ...new Set(data.data.map((pkg) => pkg.packageParent)),
        ].sort((a, b) => a.localeCompare(b));
        const responseData = processPackageData(data.data, paymentData.balance);
        setPaymentData((prev) => ({
          ...prev,
          packageParents: parentTypes,
          packageData: responseData,
          lastUpdated: new Date(),
        }));
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
      });
  };

  const processPackageData = (packages) => {
    return packages.map((pkg) => {
      const amountCalculations = packageAmountCalculations(
        calculationDate,
        pkg,
        paymentData.chapterMeetings,
        paymentData.balance,
      );
      return { ...pkg, ...amountCalculations };
    });
  };

  // Pending Payments start

  // Fetch pending payments data
  const fetchPendingPayments = async () => {
    await axiosInstance
      .get('/api/payment/pendingPayments')
      .then((response) => {
        console.log('Fetched Pending Payments:', response.data);
        setPaymentData((prev) => ({
          ...prev,
          pendingPayments: response.data,
        }));
      })
      .catch((error) =>
        console.error('Error fetching pending payments:', error),
      );
  };

  const handleDeletePendingRequest = async (transactionId) => {
    await axiosInstance
      .delete(`/api/payment/deleteRequest/${transactionId}`)
      .then((response) => {
        fetchAllData(); // Refresh the package data
        toast.success('Request deleted successfully');
      })
      .catch((error) => console.error('Error deleting request:', error));
  };

  // Pending Payments end

  const fetchAllData = async () => {
    await fetchCurrentReceivers();
    await fetchPendingPayments();
    await fetchMeetings();
    await fetchDueAmount();
  };

  useEffect(() => {
    if (
      paymentData.chapterMeetings !== undefined &&
      paymentData.balance !== undefined
    ) {
      console.log('Fetching Packages');

      fetchPackages();
    }
  }, [paymentData.chapterMeetings, paymentData.balance]);

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchAllData();
    }
  }, [chapterData?.chapterId]);

  // update selectedReceiverObject when selectedReceiver changes
  useEffect(() => {
    if (paymentData.selectedReceiver) {
      const selectedReceiverObject = paymentData.receivers.find(
        (receiver) => receiver.receiverId === paymentData.selectedReceiver,
      );
      setPaymentData((prev) => ({
        ...prev,
        selectedReceiverObject,
      }));
    }
  }, [paymentData.selectedReceiver]);

  // 1st check if the data was updated in the last 5 minutes or not using paymentData.lastUpdated
  // if not updated, check if the selectedPackage was selected in the last 10 minutes or not using paymentData.lastSelectedPackageTime
  // if not selected in the last 10 minutes, reset the selectedPackage and fetchAllData
  useEffect(() => {
    const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds
    const TEN_MINUTES = 10 * 60 * 1000; // 10 minutes in milliseconds

    const interval = setInterval(() => {
      const currentTime = new Date();
      const lastUpdated = paymentData.lastUpdated;
      const lastSelectedPackageTime = paymentData.lastSelectedPackageTime;

      if (currentTime - lastUpdated > FIVE_MINUTES) {
        if (paymentData.selectedPackage) {
          if (currentTime - lastSelectedPackageTime > TEN_MINUTES) {
            toast.warn('Payment window will timeout in 10 seconds...');
            setTimeout(() => {
              toast.warn(
                'Payment window has timed out. Refreshing data now...',
              );
              resetPaymentData();
              fetchAllData();
            }, 10000); // 10 seconds timeout
          } else {
            toast.warn('Refresh coming soon');
          }
        } else {
          toast.warn('Data is stale. Refreshing now...');
          fetchAllData();
        }
      }
    }, 60 * 1000); // Run every 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [paymentData.lastUpdated, paymentData.lastSelectedPackageTime]);

  console.log('From PaymentDataContext', { paymentData });

  return (
    <PaymentDataContext.Provider
      value={{
        paymentData,
        setPaymentData,
        resetPaymentData,
        fetchAllData,
        handleDeletePendingRequest,
      }}
    >
      {children}
    </PaymentDataContext.Provider>
  );
};

// Create a custom hook to use the PaymentDataContext
export const usePaymentData = () => {
  return useContext(PaymentDataContext);
};

export default PaymentDataContext;
