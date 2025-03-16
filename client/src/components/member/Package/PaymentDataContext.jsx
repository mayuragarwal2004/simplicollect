import React, { createContext, useState, useEffect, useContext } from 'react';
import { useData } from '../../../context/DataContext';
import { axiosInstance } from '../../../utils/config';
import formatDateDDMMYYYY from '../../../utils/dateUtility';
import packageAmountCalculations from './packageAmountCalculation';

// Create a context
const PaymentDataContext = createContext();

// Create a provider component
export const PaymentDataProvider = ({ children }) => {
  const { chapterData } = useData();
  const calculationDate = new Date();

  const [paymentData, setPaymentData] = useState({
    selectedReceiver: null, // maybe reset on exiting package
    saveReceiverSelection: false,
    receivers: [],
    selectedPackage: null, // reset on exiting package
    pendingPayments: [],
    packageData: null,
    parentType: null,
  });

  const resetPaymentData = () => {
    setPaymentData((prev) => ({
      ...prev,
      selectedReceiver: null,
      paymentMethod: 'cash',

      saveReceiverSelection: false,
      receivers: [],
      selectedPackage: null,
      pendingPayments: [],
      packageData: null,
      parentType: null,
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
    // Fetch all due payments
    axiosInstance
      .get(`/api/payment/due/${chapterData?.chapterId}`)
      .then((data) => {
        console.log('Fetched Due Amounts:', data.data);
        setPaymentData((prev) => ({
          ...prev,
          due: data.data.due,
        }));
      })
      .catch((error) => console.error('Error fetching due amounts:', error));
  };

  const fetchPackages = () => {
    axiosInstance
      .get(`/api/packages/all/${chapterData?.chapterId}`)
      .then((data) => {
        // find the unique parent types
        const parentTypes = [
          ...new Set(data.data.map((pkg) => pkg.packageParent)),
        ];
        const responseData = processPackageData(data.data, paymentData.due);
        setPaymentData((prev) => ({
          ...prev,
          packageParents: parentTypes,
          packageData: responseData,
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
        paymentData.due,
      );
      return { ...pkg, ...amountCalculations };
    });
  };

  const fetchAllData = async () => {
    let updatedValues = await fetchCurrentReceivers();
    await fetchMeetings();
    await fetchDueAmount();
  };

  useEffect(() => {
    if (
      paymentData.chapterMeetings !== undefined &&
      paymentData.due !== undefined
    ) {
      console.log('Fetching Packages');

      fetchPackages();
    }
  }, [paymentData.chapterMeetings, paymentData.due]);

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchAllData();
    }
  }, [chapterData?.chapterId]);

  console.log('From PaymentDataContext', { paymentData });

  return (
    <PaymentDataContext.Provider
      value={{ paymentData, setPaymentData, resetPaymentData }}
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
