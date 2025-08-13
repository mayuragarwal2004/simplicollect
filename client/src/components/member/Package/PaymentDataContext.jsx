import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
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
  const [calculationDate, setCalculationDate] = useState(new Date());
  const isInitialLoadRef = useRef(true);
  const loadingRef = useRef(false);

  const [paymentData, setPaymentData] = useState({
    selectedReceiver: null, // maybe reset on exiting package
    saveReceiverSelection: false,
    selectedReceiverObject: null,

    receivers: [],
    selectedPackage: null, // reset on exiting package
    pendingPayments: [],
    packageData: null,
    parentType: null,
    packageParents: [],
    chapterMeetings: undefined,
    balance: undefined,
    lastUpdated: null,
    lastSelectedPackageTime: null,
    selectedMemberId: null,

    terms: [],
    selectedTermId: null, // Add selectedTermId to state
  });

  const resetPaymentData = () => {
    setPaymentData((prev) => ({
      ...prev,
      selectedPackage: null,
      selectedReceiver: null,
      selectedReceiverObject: null,
      saveReceiverSelection: false,
      lastSelectedPackageTime: null,
    }));
  };

  const selectPackage = (packageId) => {
    setPaymentData((prev) => ({
      ...prev,
      selectedPackage: packageId,
      lastSelectedPackageTime: new Date(),
    }));
  };

  const fetchCurrentReceivers = useCallback(async () => {
    if (!chapterData?.chapterId) return;
    
    try {
      const response = await axiosInstance.get(`/api/feeReceiver/current/${chapterData.chapterId}`, {
        params: {
          date: formatDateDDMMYYYY(calculationDate),
        },
      });
      
      setPaymentData((prev) => ({
        ...prev,
        receivers: response.data,
      }));
    } catch (error) {
      console.error('Error fetching current receivers:', error);
      toast.error('Failed to fetch fee receivers');
    }
  }, [chapterData?.chapterId, calculationDate]);

  const fetchTerms = async () => {
    if (!chapterData?.chapterId) {
      console.warn('Chapter ID is not available. Skipping terms fetch.');
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/api/term/chapter/${chapterData.chapterId}`);
      const activeTerms = response.data.filter(term => term.status === 'active');
      
      let selectedTermId = paymentData.selectedTermId;
      
      // Only auto-select if no term is currently selected or if selected term is not in active terms
      if (!selectedTermId || !activeTerms.find(term => term.termId === selectedTermId)) {
        const today = new Date();
        // Try to find a term where today is between startDate and endDate
        const todayTerm = activeTerms.find((term) => {
          const start = new Date(term.startDate);
          const end = new Date(term.endDate);
          return today >= start && today <= end;
        });
        
        if (todayTerm) {
          selectedTermId = todayTerm.termId;
        } else if (activeTerms.length > 0) {
          // Find the upcoming term (nearest startDate after today)
          const upcomingTerms = activeTerms.filter(
            (term) => new Date(term.startDate) > today,
          );
          if (upcomingTerms.length > 0) {
            const nearest = upcomingTerms.reduce((a, b) =>
              new Date(a.startDate) < new Date(b.startDate) ? a : b,
            );
            selectedTermId = nearest.termId;
          } else {
            // Fallback: pick the first active term
            selectedTermId = activeTerms[0].termId;
          }
        }
      }
      
      setPaymentData((prev) => ({
        ...prev,
        terms: response.data,
        selectedTermId,
      }));
    } catch (error) {
      console.error('Error fetching terms:', error);
      toast.error('Failed to fetch terms');
    }
  };

  const fetchMeetings = useCallback(async (memberId, termId = null) => {
    const selectedTermId = termId || paymentData.selectedTermId;
    if (!selectedTermId || !chapterData?.chapterId) {
      console.warn('No term selected or chapter ID missing. Skipping meetings fetch.');
      return;
    }
    
    try {
      const response = await axiosInstance.get(
        `/api/meetings/meetings/${chapterData.chapterId}`,
        {
          params: { memberId: memberId || '' },
        },
      );
      
      setPaymentData((prev) => ({
        ...prev,
        chapterMeetings: response.data,
      }));
    } catch (error) {
      console.error('Error fetching chapter meetings:', error);
      toast.error('Failed to fetch meetings');
    }
  }, [chapterData?.chapterId, paymentData.selectedTermId]);

  const fetchDueAmount = useCallback(async (memberId) => {
    if (!chapterData?.chapterId) return;
    
    try {
      const response = await axiosInstance.get(`/api/payment/balance/${chapterData.chapterId}`, {
        params: {
          memberId: memberId || '',
        },
      });
      
      setPaymentData((prev) => ({
        ...prev,
        balance: response.data.balance,
      }));
    } catch (error) {
      console.error('Error fetching balance amounts:', error);
      toast.error('Failed to fetch balance');
    }
  }, [chapterData?.chapterId]);

  const fetchPackages = useCallback(async (memberId, termId = null, meetings = null, balance = null) => {
    const selectedTermId = termId || paymentData.selectedTermId;
    const meetingsData = meetings || paymentData.chapterMeetings;
    const balanceData = balance !== null ? balance : paymentData.balance;
    
    if (!selectedTermId || !chapterData?.chapterId) {
      console.warn('No term selected or chapter ID missing. Skipping packages fetch.');
      return;
    }
    
    try {
      const response = await axiosInstance.get(
        `/api/packages/all/${chapterData.chapterId}/term/${selectedTermId}`,
        {
          params: {
            memberId: memberId || '',
            date: formatDateDDMMYYYY(calculationDate),
          },
        },
      );
      
      // find the unique parent types
      const parentTypes = [
        ...new Set(response.data.map((pkg) => pkg.packageParent)),
      ].sort((a, b) => a.localeCompare(b));
      
      console.log('Processing packages with:', {
        packages: response.data?.length || 0,
        meetings: meetingsData?.length || 0,
        balance: balanceData
      });
      
      const responseData = processPackageData(
        response.data, 
        balanceData, 
        meetingsData
      );
      
      setPaymentData((prev) => ({
        ...prev,
        packageParents: parentTypes,
        packageData: responseData,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
    }
  }, [chapterData?.chapterId, paymentData.selectedTermId, paymentData.chapterMeetings, paymentData.balance, calculationDate]);

  const processPackageData = (packages, balance, meetings) => {
    console.log('processPackageData called with:', {
      packagesCount: packages?.length || 0,
      packagesValid: Array.isArray(packages),
      meetingsCount: meetings?.length || 0,
      meetingsValid: !!meetings,
      balance
    });
    
    if (!meetings || !Array.isArray(packages)) {
      console.warn('Missing required data for package processing', {
        meetings: !!meetings,
        packages: Array.isArray(packages)
      });
      return [];
    }
    
    return packages.map((pkg) => {
      const amountCalculations = packageAmountCalculations(
        calculationDate,
        pkg,
        meetings,
        balance || 0,
      );
      return { ...pkg, ...amountCalculations };
    });
  };

  // Pending Payments start

  // Fetch pending payments data
  const fetchPendingPayments = useCallback(async (memberId) => {
    try {
      const response = await axiosInstance.get(`/api/payment/pendingPayments`, {
        params: {
          memberId: memberId || '',
        },
      });
      
      setPaymentData((prev) => ({
        ...prev,
        pendingPayments: response.data,
      }));
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast.error('Failed to fetch pending payments');
    }
  }, []);

  const handleDeletePendingRequest = async (transactionId) => {
    try {
      await axiosInstance.delete(`/api/payment/deleteRequest/${transactionId}`);
      await fetchAllData(paymentData.selectedMemberId); // Refresh the package data
      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  // Pending Payments end

  const fetchAllData = useCallback(async (memberId = paymentData.selectedMemberId) => {
    if (!chapterData?.chapterId || loadingRef.current) {
      console.warn('Chapter ID not available or already loading');
      return;
    }

    loadingRef.current = true;
    console.log('Starting fetchAllData for member:', memberId);

    try {
      // Store memberId in state
      setPaymentData(prev => ({ ...prev, selectedMemberId: memberId }));

      // First fetch basic data
      await Promise.all([
        fetchCurrentReceivers(),
        fetchPendingPayments(memberId)
      ]);

      // Fetch terms and get the selected term ID
      const response = await axiosInstance.get(`/api/term/chapter/${chapterData.chapterId}`);
      const activeTerms = response.data.filter(term => term.status === 'active');
      
      let selectedTermId = paymentData.selectedTermId;
      
      // Only auto-select if no term is currently selected or if selected term is not in active terms
      if (!selectedTermId || !activeTerms.find(term => term.termId === selectedTermId)) {
        const today = new Date();
        // Try to find a term where today is between startDate and endDate
        const todayTerm = activeTerms.find((term) => {
          const start = new Date(term.startDate);
          const end = new Date(term.endDate);
          return today >= start && today <= end;
        });
        
        if (todayTerm) {
          selectedTermId = todayTerm.termId;
        } else if (activeTerms.length > 0) {
          // Find the upcoming term (nearest startDate after today)
          const upcomingTerms = activeTerms.filter(
            (term) => new Date(term.startDate) > today,
          );
          if (upcomingTerms.length > 0) {
            const nearest = upcomingTerms.reduce((a, b) =>
              new Date(a.startDate) < new Date(b.startDate) ? a : b,
            );
            selectedTermId = nearest.termId;
          } else {
            // Fallback: pick the first active term
            selectedTermId = activeTerms[0].termId;
          }
        }
      }
      
      console.log('Selected term ID:', selectedTermId);

      // Update state with terms and selected term
      setPaymentData((prev) => ({
        ...prev,
        terms: response.data,
        selectedTermId,
      }));

      // Now fetch dependent data with the confirmed term ID
      if (selectedTermId) {
        console.log('Fetching meetings and balance...');
        const [meetingsResponse, balanceResponse] = await Promise.all([
          axiosInstance.get(
            `/api/meetings/meetings/${chapterData.chapterId}`,
            { params: { memberId: memberId || '' } }
          ),
          axiosInstance.get(`/api/payment/balance/${chapterData.chapterId}`, {
            params: { memberId: memberId || '' }
          })
        ]);

        console.log('Meetings fetched:', meetingsResponse.data?.length || 0);
        console.log('Balance fetched:', balanceResponse.data.balance);

        // Update state with meetings and balance
        setPaymentData((prev) => ({
          ...prev,
          chapterMeetings: meetingsResponse.data,
          balance: balanceResponse.data.balance,
        }));

        // Finally fetch packages with all required data available - pass the fresh data directly
        console.log('Fetching packages with fresh data...');
        await fetchPackages(memberId, selectedTermId, meetingsResponse.data, balanceResponse.data.balance);
        console.log('All data fetched successfully');
      } else {
        console.warn('No term ID available to fetch dependent data');
      }
    } catch (error) {
      console.error('Error in fetchAllData:', error);
      toast.error('Failed to fetch payment data');
    } finally {
      loadingRef.current = false;
      isInitialLoadRef.current = false;
    }
  }, [chapterData?.chapterId, paymentData.selectedTermId, fetchCurrentReceivers, fetchPendingPayments, fetchPackages]);

  // Only trigger initial load when chapter data is available
  useEffect(() => {
    if (chapterData?.chapterId && isInitialLoadRef.current) {
      console.log('Initial load triggered for chapter:', chapterData.chapterId);
      fetchAllData(paymentData.selectedMemberId);
    }
  }, [chapterData?.chapterId, fetchAllData]);

  // Refetch data when calculation date changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoadRef.current && chapterData?.chapterId) {
      console.log('Calculation date changed, refetching data');
      fetchAllData(paymentData.selectedMemberId);
    }
  }, [calculationDate]);

  // Fetch dependent data when term changes
  useEffect(() => {
    if (paymentData.selectedTermId && paymentData.selectedMemberId) {
      fetchMeetings(paymentData.selectedMemberId, paymentData.selectedTermId);
      fetchDueAmount(paymentData.selectedMemberId);
    }
  }, [paymentData.selectedTermId]);

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

  // Auto-refresh logic with improved timeout handling
  useEffect(() => {
    const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds
    const TEN_MINUTES = 10 * 60 * 1000; // 10 minutes in milliseconds

    const interval = setInterval(() => {
      const currentTime = new Date();
      const lastUpdated = paymentData.lastUpdated;
      const lastSelectedPackageTime = paymentData.lastSelectedPackageTime;

      // If data hasn't been updated in 5 minutes
      if (lastUpdated && currentTime - lastUpdated > FIVE_MINUTES) {
        if (paymentData.selectedPackage && lastSelectedPackageTime) {
          // If package is selected and it's been more than 10 minutes since selection
          if (currentTime - lastSelectedPackageTime > TEN_MINUTES) {
            toast.warn('Payment window will timeout in 10 seconds...');
            setTimeout(() => {
              toast.warn('Payment window has timed out. Refreshing data now...');
              resetPaymentData();
              fetchAllData(paymentData.selectedMemberId);
            }, 10000); // 10 seconds timeout
          } else {
            toast.info('Data will be refreshed soon due to inactivity');
          }
        } else {
          toast.info('Data is stale. Refreshing now...');
          fetchAllData(paymentData.selectedMemberId);
        }
      }
    }, 60 * 1000); // Run every 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [paymentData.lastUpdated, paymentData.lastSelectedPackageTime, paymentData.selectedPackage, paymentData.selectedMemberId]);

  console.log({mainData: paymentData.packageData});
  

  return (
    <PaymentDataContext.Provider
      value={{
        calculationDate,
        setCalculationDate,
        paymentData,
        setPaymentData,
        resetPaymentData,
        selectPackage,
        fetchAllData,
        handleDeletePendingRequest,
        // Add setter for selectedTermId
        setSelectedTermId: (termId) =>
          setPaymentData((prev) => ({ ...prev, selectedTermId: termId })),
        // Expose individual fetch functions for manual refresh
        fetchCurrentReceivers,
        fetchTerms,
        fetchMeetings,
        fetchDueAmount,
        fetchPackages,
        fetchPendingPayments,
      }}
    >
      {children}
    </PaymentDataContext.Provider>
  );
};

// Create a custom hook to use the PaymentDataContext
export const usePaymentData = () => {
  const context = useContext(PaymentDataContext);
  if (!context) {
    throw new Error('usePaymentData must be used within a PaymentDataProvider');
  }
  return context;
};

export default PaymentDataContext;
