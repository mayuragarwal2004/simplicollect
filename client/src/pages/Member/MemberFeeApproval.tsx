import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import useWindowDimensions from '../../utils/useWindowDimensions';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumb';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import EditFeeDetails from '../../components/member/EditFeeDetails';
import {
  FeeApprovalList,
  ApprovalControls,
  TransferTab,
} from '../../components/member/FeeApproval';

const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  notation: 'compact',
  compactDisplay: 'long',
})

const paymentModes = [
  { value: 'cash', label: 'Cash' },
  { value: 'online', label: 'Online/UPI/QR' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'other', label: 'Other' },
];

interface MemberFee {
  transactionId: string;
  firstName: string;
  lastName: string;
  packageName: string;
  date: string;
  amountPaid: number;
  dues: number;
  advancePayment: number;
  status: 'Pending' | 'Confirmed';
}

const MemberFeeApproval: React.FC = () => {
  const [pendingFees, setPendingFees] = useState<any[]>([]);
  const [approvedFees, setApprovedFees] = useState<any[]>([]);
  const { chapterData } = useData();
  const { width } = useWindowDimensions();
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [config, setConfig] = useState<any>({
    allowAllMembersApproval: false,
    currentState: 'self_approval', // all_members_approval
  });
  const [currentTab, setCurrentTab] = useState<'pending' | 'approved'>(
    'pending',
  );
  const [metaData, setMetaData] = useState<any>({
    totalCollected: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    totalTransferredToChapter: 0,
    remainingToTransfer: 0,
  });
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [loadingApprovals, setLoadingApprovals] = useState<{
    [key: string]: boolean;
  }>({});
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [receiverList, setReceiverList] = useState<any[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<string>('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'save'>();
  const [detailsChanged, setDetailsChanged] = useState(false);
  const [canChangeReceiver, setCanChangeReceiver] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  console.log({ pendingFees });

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchFeeRequests();
      fetchIsAllowedAllMembersApproval();
    }
  }, [chapterData]);

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchFeeRequests();
      fetchMetaData();
    }
  }, [config.currentState, currentTab, chapterData]);

  // Helper to format date as DD-MM-YYYY
  const formatDateDDMMYYYY = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // Fetch current receivers for the dialog
  const fetchReceivers = async () => {
    if (!chapterData?.chapterId) return;
    try {
      const res = await axiosInstance.get(
        `/api/feeReceiver/current/${chapterData.chapterId}`,
        {
          params: {
            date: formatDateDDMMYYYY(new Date()),
          },
        },
      );
      setReceiverList(res.data || []);
    } catch (e) {
      setReceiverList([]);
    }
  };
  // Fetch all members for the dialog
  const fetchAllMembers = async () => {
    if (!chapterData?.chapterId) return;
    try {
      const res = await axiosInstance.get(
        `/api/member/all?chapterId=${chapterData.chapterId}`,
      );
      setAllMembers(res.data || []);
    } catch (e) {
      setAllMembers([]);
    }
  };

  const fetchIsAllowedAllMembersApproval = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/rights/anyMemberApprovePayment/${chapterData?.chapterId}`,
      );
      console.log({ response });
      setConfig((prev) => ({
        ...prev,
        allowAllMembersApproval: response?.data?.allowed,
      }));
    } catch (error) {
      console.error('Fetching rights failed:', error);
    }
  };

  const fetchFeeRequests = async (status = currentTab) => {
    try {
      const response = await axiosInstance.post(
        `/api/payment/paymentRequests/${chapterData?.chapterId}`,
        { status, currentState: config.currentState },
      );
      console.log({ response });

      console.log({ got: response.data });

      if (status === 'pending') {
        setPendingFees(response.data);
      } else {
        setApprovedFees(response.data);
      }
    } catch (error) {
      console.error('Fetching fees failed:', error);
    }
  };

  const fetchMetaData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/payment/metaData/${chapterData?.chapterId}`,
      );
      console.log({ response });
      setMetaData(response.data);
    } catch (error) {
      console.error('Fetching metadata failed:', error);
    }
  };

  console.log({ selectedApprovals });

  const confirmSelectedFees = async () => {
    try {
      // make an aaray of objects with transactionId and dues
      const data = pendingFees.filter((fee) =>
        selectedApprovals.includes(fee.transactionId),
      );
      console.log({ data });

      await axiosInstance.put('/api/payment/approvePendingPayment', {
        transactionDetails: data, // Send the first selected transactionId (or adjust for multiple approvals)
      });
      setPendingFees((prev) =>
        prev.filter((fee) => !selectedApprovals.includes(fee.transactionId)),
      );
      setSelectedApprovals([]);
      toast.success('Fees confirmed successfully');
    } catch (error) {
      toast.error('Could not confirm fees. Please try again later.');
      console.error('Confirming fees failed:', error);
    }
  };

  const handleDirectApproval = async (transactionId: string) => {
    try {
      setLoadingApprovals((prev) => ({ ...prev, [transactionId]: true }));
      const fee = pendingFees.find((f) => f.transactionId === transactionId);

      const response = await axiosInstance.put(
        '/api/payment/approvePendingPayment',
        {
          transactionDetails: [fee],
        },
      );

      if (response.data.success) {
        setPendingFees((prev) =>
          prev.filter((fee) => fee.transactionId !== transactionId),
        );
        toast.success('Fee approved successfully');
      } else {
        toast.error(response.data.message || 'Could not approve fee');
      }
    } catch (error: any) {
      console.error('Approving fee failed:', error);
      toast.error(
        error.response?.data?.message ||
          'Could not approve fee. Please try again later.',
      );
    } finally {
      setLoadingApprovals((prev) => ({ ...prev, [transactionId]: false }));
    }
  };

  const handleDetailedApproval = async (transactionId: string) => {
    try {
      setLoadingApprovals((prev) => ({ ...prev, [transactionId]: true }));
      const fee = pendingFees.find((f) => f.transactionId === transactionId);

      const response = await axiosInstance.put(
        '/api/payment/approvePendingPayment',
        {
          transactionDetails: [
            {
              ...fee,
              receivedAmount: parseFloat(receivedAmount),
            },
          ],
        },
      );

      if (response.data.success) {
        setPendingFees((prev) =>
          prev.filter((fee) => fee.transactionId !== transactionId),
        );
        setReceivedAmount('');
        setSelectedFee(null);
        toast.success('Fee approved successfully');
      } else {
        toast.error(response.data.message || 'Could not approve fee');
      }
    } catch (error: any) {
      console.error('Approving fee failed:', error);
      toast.error(
        error.response?.data?.message ||
          'Could not approve fee. Please try again later.',
      );
    } finally {
      setLoadingApprovals((prev) => ({ ...prev, [transactionId]: false }));
    }
  };

  // Move approved fee to pending
  const handleMoveToPending = async (transactionId: string) => {
    try {
      setLoadingApprovals((prev) => ({ ...prev, [transactionId]: true }));
      const fee = approvedFees.find((f) => f.transactionId === transactionId);
      const response = await axiosInstance.put(
        '/api/payment/moveApprovedToPending',
        {
          transactionDetails: [fee],
        },
      );
      if (response.data.success) {
        setApprovedFees((prev) =>
          prev.filter((fee) => fee.transactionId !== transactionId),
        );
        toast.success('Fee moved to pending successfully');
        fetchFeeRequests('pending'); // Refresh pending list
      } else {
        toast.error(response.data.message || 'Could not move fee');
      }
    } catch (error: any) {
      console.error('Moving fee to pending failed:', error);
      toast.error(
        error.response?.data?.message ||
          'Could not move fee. Please try again later.',
      );
    } finally {
      setLoadingApprovals((prev) => ({ ...prev, [transactionId]: false }));
    }
  };

  // Open dialog: fetch receivers and reset state
  const openApproveDialog = (fee: any) => {
    setSelectedFee(fee);
    setReceivedAmount(fee.paidAmount.toString());
    setSelectedReceiver(fee.paymentReceivedById || '');
    setSelectedPaymentMode(fee.paymentType || '');
    setDetailsChanged(false);
    setShowAllMembers(false);
    setCanChangeReceiver(false);
    fetchReceivers();
    setEditDialogOpen(true);
  };

  // When showAllMembers toggled, fetch all members if needed
  useEffect(() => {
    if (showAllMembers) fetchAllMembers();
  }, [showAllMembers]);

  // Track if details changed
  useEffect(() => {
    if (!selectedFee) return;
    setDetailsChanged(
      receivedAmount !== selectedFee.paidAmount.toString() ||
        selectedReceiver !== (selectedFee.paymentReceivedById || '') ||
        selectedPaymentMode !== (selectedFee.paymentType || ''),
    );
  }, [receivedAmount, selectedReceiver, selectedPaymentMode, selectedFee]);

  // Save changes (without approval)
  const handleSaveChanges = async () => {
    setShowConfirm(false);
    if (!selectedFee) return;
    setLoadingApprovals((prev) => ({
      ...prev,
      [selectedFee.transactionId]: true,
    }));
    try {
      await axiosInstance.put('/api/payment/saveEditedFeeDetails', {
        transactionId: selectedFee.transactionId,
        updateFields: {
          paidAmount: parseFloat(receivedAmount),
          paymentReceivedById: selectedReceiver,
          paymentType: selectedPaymentMode,
          paymentReceivedByName:
            allMembers.find((m) => m.memberId === selectedReceiver)
              ?.firstName ||
            receiverList.find((r) => r.memberId === selectedReceiver)
              ?.receiverName ||
            '',
          payableAmount: selectedFee.payableAmount,
        },
      });
      toast.success('Details saved successfully');
      fetchFeeRequests();
      setSelectedFee(null);
      setEditDialogOpen(false);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Could not save changes');
    } finally {
      setLoadingApprovals((prev) => ({
        ...prev,
        [selectedFee.transactionId]: false,
      }));
    }
  };

  // Approve with details
  const handleApproveWithDetails = async () => {
    setShowConfirm(false);
    if (!selectedFee) return;
    setLoadingApprovals((prev) => ({
      ...prev,
      [selectedFee.transactionId]: true,
    }));
    try {
      await axiosInstance.put('/api/payment/approvePendingPayment', {
        transactionDetails: [
          {
            ...selectedFee,
            paidAmount: parseFloat(receivedAmount),
            paymentReceivedById: selectedReceiver,
            paymentType: selectedPaymentMode,
            status: 'approved',
          },
        ],
      });
      toast.success('Fee approved successfully');
      fetchFeeRequests();
      setSelectedFee(null);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Could not approve fee');
    } finally {
      setLoadingApprovals((prev) => ({
        ...prev,
        [selectedFee.transactionId]: false,
      }));
    }
  };

  return (
    <>
      <Breadcrumbs items={[
        { name: 'Member Fee Approval' }
      ]} />
      <div className="rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium dark:text-white">
            Member Fee Approvals
          </h2>
          <IconButton aria-label="refresh" onClick={() => fetchFeeRequests()}>
            <RefreshIcon className="dark:text-white" />
          </IconButton>
        </div>

        <Tabs defaultValue="approval" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approval">Fee Approval</TabsTrigger>
            <TabsTrigger value="transfer">Transfer & Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="approval" className="space-y-4">
            <ApprovalControls
              config={config}
              currentTab={currentTab}
              onConfigChange={setConfig}
              onTabChange={setCurrentTab}
            />
            
            <FeeApprovalList
              pendingFees={pendingFees}
              approvedFees={approvedFees}
              currentTab={currentTab}
              config={config}
              width={width}
              loadingApprovals={loadingApprovals}
              onDirectApproval={handleDirectApproval}
              onOpenApproveDialog={openApproveDialog}
              onMoveToPending={handleMoveToPending}
              selectedApprovals={selectedApprovals}
              onConfirmSelectedFees={confirmSelectedFees}
            />
          </TabsContent>
          
          <TabsContent value="transfer" className="space-y-4">
            <TransferTab metaData={metaData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Fee Dialog */}
      <div className="flex justify-center items-center">
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent
            className="!p-0"
            style={{
              width: '100%',
              maxHeight: 'calc(100vh - 20px)',
              overflowY: 'auto',
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Edit Fee Payment</DialogTitle>
                <DialogDescription>
                  Edit details, change receiver, payment mode, or approve/save
                  changes
                </DialogDescription>
              </DialogHeader>
              <EditFeeDetails
                receivedAmount={receivedAmount}
                setReceivedAmount={setReceivedAmount}
                selectedReceiver={selectedReceiver}
                setSelectedReceiver={setSelectedReceiver}
                selectedPaymentMode={selectedPaymentMode}
                setSelectedPaymentMode={setSelectedPaymentMode}
                receiverList={receiverList}
                allMembers={allMembers}
                showAllMembers={showAllMembers}
                setShowAllMembers={setShowAllMembers}
                paymentModes={paymentModes}
                selectedFee={selectedFee}
                canChangeReceiver={canChangeReceiver}
                setCanChangeReceiver={setCanChangeReceiver}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setSelectedFee(null);
                  setReceivedAmount('');
                }}
                onSave={handleSaveChanges}
                onApprove={handleApproveWithDetails}
              />
              {/* Confirmation dialog and action buttons can be placed here if needed */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default MemberFeeApproval;
