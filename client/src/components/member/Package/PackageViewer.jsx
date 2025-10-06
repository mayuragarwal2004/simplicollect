import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PackageCard from '../../../components/member/Package/PackageCard';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import packageAmountCalculations from '../../../components/member/Package/packageAmountCalculation';
import { usePaymentData } from './PaymentDataContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ChooseMember from '../ChooseMemberPopoverCommand';

// Component for displaying pending payments
const PendingPaymentsView = ({ pendingPayments, handleDeletePendingRequest, fetchAllData }) => {
  if (pendingPayments.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 py-3 bg-yellow-100 rounded-md">
        <p className="text-base font-medium text-yellow-800 dark:text-yellow-200">
          You have <strong>pending payments</strong>. Please contact admin
          to approve requests to continue.
        </p>
        <button
          className="px-4 py-2 text-sm font-semibold text-yellow-800 bg-yellow-300 rounded-md hover:bg-yellow-400 dark:text-yellow-200 dark:bg-yellow-400 transition-colors"
          onClick={fetchAllData}
        >
          Refresh
        </button>
      </div>
      <div className="mt-4 space-y-4">
        {pendingPayments.map((payment) => (
          <div
            key={payment.transactionId}
            className="p-4 sm:p-6 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-yellow-900/20"
          >
            {/* Header with Package Name and Status */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <div>
                <h4 className="text-xl sm:text-2xl font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  {payment.packageName}
                </h4>
                <p className="text-base text-yellow-700 dark:text-yellow-300">
                  {payment.packageFeeType} • {new Date(payment.paymentDate).toLocaleDateString()}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 self-start sm:self-center">
                {payment.status.toUpperCase()}
              </span>
            </div>

            {/* Payment Summary - Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Show only one amount if paid and payable are the same */}
              {payment.paidAmount === payment.payableAmount ? (
                <div className="flex flex-col">
                  <span className="text-base text-yellow-700 dark:text-yellow-300 mb-1">Amount:</span>
                  <span className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                    ₹{payment.paidAmount?.toLocaleString()}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col">
                    <span className="text-base text-yellow-700 dark:text-yellow-300 mb-1">Paid:</span>
                    <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                      ₹{payment.paidAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base text-yellow-700 dark:text-yellow-300 mb-1">Original Amount:</span>
                    <span className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                      ₹{payment.payableAmount?.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              
              {/* Only show balance if it's not zero */}
              {payment.balanceAmount !== 0 && (
                <div className="flex flex-col">
                  <span className="text-base text-yellow-700 dark:text-yellow-300 mb-1">Balance:</span>
                  <span className={`text-lg font-semibold ${
                    payment.balanceAmount < 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    ₹{Math.abs(payment.balanceAmount)?.toLocaleString()} 
                    {payment.balanceAmount < 0 ? ' Due' : ' Advance'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-yellow-200 gap-3">
              <div className="text-base text-yellow-700 dark:text-yellow-300">
                <span className="capitalize font-medium">{payment.paymentType}</span>
                <span className="mx-2">•</span>
                <span>{payment.paymentReceivedByName || 'Unknown'}</span>
              </div>
              <button
                className="px-4 py-2 text-base font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-600 transition-colors self-start sm:self-center"
                onClick={() => handleDeletePendingRequest(payment.transactionId)}
              >
                Delete Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PackageViewer = () => {
  const {
    paymentData: {
      receivers,
      chapterMeetings,
      balance,
      packageParents,
      packageData,
      pendingPayments,
      terms,
      selectedTermId,
    },
    calculationDate,
    setCalculationDate,
    setPaymentData,
    fetchAllData,
    handleDeletePendingRequest,
    setSelectedTermId,
  } = usePaymentData();
  const { chapterData, memberData } = useData();
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedMember, setSelectedMember] = useState({
    value: memberData?.memberId,
    label: `${memberData?.firstName} ${memberData?.lastName}`,
  });
  const [filteredMembers, setFilteredMembers] = useState([]); // Filtered list
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);

  const [changeMemberRights, setChangeMemberRights] = useState(false);
  const [changeDateRights, setChangeDateRights] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(() => {
    // Enhanced localStorage with error handling for mobile environments
    try {
      const stored = localStorage.getItem('packageViewer-additionalSettings-accordion');
      return stored || '';
    } catch (error) {
      // Fallback for environments where localStorage might not be available
      console.warn('localStorage not available:', error);
      return '';
    }
  });

  useEffect(() => {
    if (memberData?.memberId && !selectedMember.value) {
      setSelectedMember({
        value: memberData?.memberId,
        label: `${memberData?.firstName} ${memberData?.lastName}`,
      });
    }
  }, [memberData]);

  const paymentSuccessHandler = () => {
    fetchAllData(selectedMember.value);
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get(`/api/member/all`, {
        params: { chapterId: chapterData?.chapterId },
      });
      setMembers(response.data);
      setFilteredMembers(response.data); // Initialize filtered list
    } catch (error) {
      toast.error('Error fetching members');
    }
  };

  useEffect(() => {
    if (chapterData?.chapterId && changeMemberRights) {
      fetchMembers();
    }
  }, [chapterData, changeMemberRights]);

  useEffect(() => {
    if (selectedMember) {
      fetchAllData(selectedMember.value);
      setPaymentData((prev) => ({
        ...prev,
        selectedMemberId: selectedMember.value,
        selectedMemberName: selectedMember.label,
      }));
    }
  }, [selectedMember]);

  useEffect(() => {
    if (chapterData?.chapterId) {
      axiosInstance
        .get(`/api/rights/anyMemberMaketransaction/${chapterData.chapterId}`)
        .then((response) => {
          setChangeMemberRights(response.data.allowed);
        })
        .catch((error) => {
          console.error('Error fetching member transaction rights:', error);
        });
      axiosInstance
        .get(`/api/rights/changeDate/${chapterData.chapterId}`)
        .then((response) => {
          setChangeDateRights(response.data.allowed);
        })
        .catch((error) => {
          console.error('Error fetching change date rights:', error);
        });
    }
  }, [chapterData]);  

  // Handle accordion state change and persist to localStorage
  const handleAccordionChange = (value) => {
    setAccordionOpen(value);
    
    // Enhanced localStorage with error handling for mobile environments
    try {
      localStorage.setItem('packageViewer-additionalSettings-accordion', value);
    } catch (error) {
      // Fallback for environments where localStorage might not be available
      console.warn('localStorage write failed:', error);
    }
  };  

  return (
    <div className="rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Pending Payments Alert */}
      <PendingPaymentsView 
        pendingPayments={pendingPayments}
        handleDeletePendingRequest={handleDeletePendingRequest}
        fetchAllData={() => fetchAllData(selectedMember.value)}
      />
      
      <div className="flex justify-between items-start flex-wrap">
        <div>
          <div className="flex items-center space-x-4">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-nowrap">
              Current Date:
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-nowrap">
              <CurrentDateTime />
            </p>
          </div>
          {(changeDateRights || changeMemberRights) && (
            <Accordion 
              type="single" 
              collapsible 
              value={accordionOpen}
              onValueChange={handleAccordionChange}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>Additional Settings</AccordionTrigger>
                {/* add border */}
                <AccordionContent>
                  {/* Left Side: DatePicker */}
                  {changeDateRights && (
                    <div className="flex items-center space-x-4">
                      <Input
                        type="date"
                        value={calculationDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setCalculationDate(date);
                          packageAmountCalculations(
                            date,
                            packageData,
                            chapterMeetings,
                            setPaymentData,
                            receivers,
                          );
                        }}
                        // className="w-1/2"
                        placeholder="Calculation Date"
                      />
                    </div>
                  )}
                  {changeMemberRights && (
                    <div className="flex items-center space-x-4 mt-4">
                      <ChooseMember
                        members={members}
                        selectedMember={selectedMember}
                        setSelectedMember={setSelectedMember}
                      />
                    </div>
                  )}
                  
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {terms &&
            terms.filter((term) => term.status === 'active').length > 1 && (
              <div className="flex items-center space-x-4 mt-4">
                <label className="text-md font-semibold">
                  Select Active Term:
                </label>
                <Select
                  value={selectedTermId || ''}
                  onValueChange={(value) => {
                    setSelectedTermId(value);
                    fetchAllData(selectedMember?.value);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms
                      .filter((term) => term.status === 'active')
                      .map((term) => (
                        <SelectItem key={term.termId} value={term.termId}>
                          {term.termName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
        </div>

        {/* Right Side: Due Amount, show red for positive value, green for negative value */}
        {Boolean(balance) && (
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2 text-nowrap">
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
          receivers &&
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
    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
      {currentTime.getDate()}-{currentTime.getMonth() + 1}-
      {currentTime.getFullYear()} {currentTime.getHours()}:
      {currentTime.getMinutes().toString().padStart(2, '0')}:
      {currentTime.getSeconds().toString().padStart(2, '0')}
    </span>
  );
};

export default PackageViewer;
