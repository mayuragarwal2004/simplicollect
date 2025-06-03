import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import useWindowDimensions from '../../utils/useWindowDimensions';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import { Checkbox, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import TransferAmountToChapter from '../../components/member/FeeReceiver/TransferAmountToChapter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

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
  const [loadingApprovals, setLoadingApprovals] = useState<{ [key: string]: boolean }>({});
  const [receivedAmount, setReceivedAmount] = useState<string>('');

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
  }

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
      setLoadingApprovals(prev => ({ ...prev, [transactionId]: true }));
      const fee = pendingFees.find(f => f.transactionId === transactionId);
      
      const response = await axiosInstance.put('/api/payment/approvePendingPayment', {
        transactionDetails: [fee],
      });

      if (response.data.success) {
        setPendingFees((prev) =>
          prev.filter((fee) => fee.transactionId !== transactionId)
        );
        toast.success('Fee approved successfully');
      } else {
        toast.error(response.data.message || 'Could not approve fee');
      }
    } catch (error: any) {
      console.error('Approving fee failed:', error);
      toast.error(error.response?.data?.message || 'Could not approve fee. Please try again later.');
    } finally {
      setLoadingApprovals(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const handleDetailedApproval = async (transactionId: string) => {
    try {
      setLoadingApprovals(prev => ({ ...prev, [transactionId]: true }));
      const fee = pendingFees.find(f => f.transactionId === transactionId);
      
      const response = await axiosInstance.put('/api/payment/approvePendingPayment', {
        transactionDetails: [{
          ...fee,
          receivedAmount: parseFloat(receivedAmount)
        }],
      });

      if (response.data.success) {
        setPendingFees((prev) =>
          prev.filter((fee) => fee.transactionId !== transactionId)
        );
        setReceivedAmount('');
        setSelectedFee(null);
        toast.success('Fee approved successfully');
      } else {
        toast.error(response.data.message || 'Could not approve fee');
      }
    } catch (error: any) {
      console.error('Approving fee failed:', error);
      toast.error(error.response?.data?.message || 'Could not approve fee. Please try again later.');
    } finally {
      setLoadingApprovals(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  return (
    <>
      <Breadcrumb pageName="Member Fee Approval" />
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium dark:text-white">
            Member Fee Approvals
          </h2>
          <IconButton aria-label="refresh" onClick={() => fetchFeeRequests()}>
            <RefreshIcon className="dark:text-white" />
          </IconButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-md shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total Collected
            </p>
            <p className="text-lg font-semibold dark:text-white">
              ₹{metaData.totalCollected}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-700 p-4 rounded-md shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Pending Approvals
            </p>
            <p className="text-lg font-semibold dark:text-white">
              ₹{metaData.pendingAmount}
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-700 p-4 rounded-md shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Approved Fees
            </p>
            <p className="text-lg font-semibold dark:text-white">
              ₹{metaData.approvedAmount}
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-700 p-4 rounded-md shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Transferred to Chapter
            </p>
            <p className="text-lg font-semibold dark:text-white">
              ₹{metaData.totalTransferredToChapter}
            </p>
          </div>
        </div>

        {metaData.remainingToTransfer > 0 ? (
          <TransferAmountToChapter />
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-300 mt-4">
            🎉 All approved fees have been transferred to the chapter!
          </div>
        )}

        <div className="flex mb-4">
          <button
            className={`px-4 py-2 rounded-l ${
              currentTab === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
            }`}
            onClick={() => setCurrentTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-r ${
              currentTab === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
            }`}
            onClick={() => setCurrentTab('approved')}
          >
            Approved
          </button>
        </div>
        {config.allowAllMembersApproval && (
          <div className="flex items-center mb-4">
            <label className="mr-2 text-black dark:text-white">
              Approval Mode:
            </label>
            <button
              className={`px-4 py-2 rounded ${
                config.currentState === 'self_approval'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
              }`}
              onClick={() => {
                setConfig((prev) => ({
                  ...prev,
                  currentState:
                    prev.currentState === 'self_approval'
                      ? 'all_members_approval'
                      : 'self_approval',
                }));
              }}
            >
              {config.currentState === 'self_approval'
                ? 'Switch To All Requests'
                : 'Switch To My Requests'}
            </button>
          </div>
        )}
        {currentTab === 'pending' ? (
          <>
            {width > 700 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member Name</TableHead>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Dues</TableHead>
                      <TableHead>Approve</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingFees?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No pending fees to approve.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingFees?.map((fee) => (
                        <TableRow key={fee.transactionId}>
                          <TableCell>
                            {fee.firstName} {fee.lastName}
                          </TableCell>
                          <TableCell>{fee.packageName}</TableCell>
                          <TableCell>
                            {new Date(fee.transactionDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>₹{fee.paidAmount}</TableCell>
                          <TableCell>₹{fee.balanceAmount}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDirectApproval(fee.transactionId)}
                                className="h-8 px-2"
                                disabled={loadingApprovals[fee.transactionId]}
                              >
                                {loadingApprovals[fee.transactionId] ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                ) : (
                                  <span className="text-xs">Quick Approve</span>
                                )}
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => {
                                      setSelectedFee(fee);
                                      setReceivedAmount(fee.paidAmount.toString());
                                    }}
                                    disabled={loadingApprovals[fee.transactionId]}
                                  >
                                    <span className="text-xs">Approve with Details</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Approve Fee Payment</DialogTitle>
                                    <DialogDescription>
                                      Enter the amount received and confirm the approval
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Member Details:</p>
                                      <p className="text-sm">
                                        {selectedFee?.firstName} {selectedFee?.lastName}
                                      </p>
                                      <p className="text-sm">Package: {selectedFee?.packageName}</p>
                                      <p className="text-sm">
                                        Expected Amount: ₹{selectedFee?.paidAmount}
                                      </p>
                                      <p className="text-sm">
                                        Dues: ₹{selectedFee?.balanceAmount}
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="amount">Amount Received</Label>
                                      <Input
                                        id="amount"
                                        type="number"
                                        value={receivedAmount}
                                        onChange={(e) => setReceivedAmount(e.target.value)}
                                        placeholder="Enter amount received"
                                        className="w-full"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedFee(null);
                                          setReceivedAmount('');
                                        }}
                                        disabled={loadingApprovals[selectedFee?.transactionId]}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleDetailedApproval(selectedFee.transactionId)}
                                        disabled={loadingApprovals[selectedFee?.transactionId] || !receivedAmount}
                                      >
                                        {loadingApprovals[selectedFee?.transactionId] ? (
                                          <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Approving...
                                          </div>
                                        ) : (
                                          'Confirm Approval'
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {pendingFees?.length === 0 ? (
                  <p className="text-center text-black dark:text-white">
                    No pending fees to approve.
                  </p>
                ) : (
                  pendingFees?.map((fee) => (
                    <div
                      key={fee.transactionId}
                      className="border rounded-lg p-4 shadow-md dark:border-strokedark"
                    >
                      <p className="text-black dark:text-white font-medium">
                        {fee.firstName} {fee.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Package: {fee.packageName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Date:{' '}
                        {new Date(fee.transactionDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Amount Paid: ₹{fee.paidAmount}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Dues: ₹{fee.balanceAmount}
                      </p>
                      <div className="mt-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDirectApproval(fee.transactionId)}
                            className="h-8 px-2"
                            disabled={loadingApprovals[fee.transactionId]}
                          >
                            {loadingApprovals[fee.transactionId] ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            ) : (
                              <span className="text-xs">Quick Approve</span>
                            )}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => {
                                  setSelectedFee(fee);
                                  setReceivedAmount(fee.paidAmount.toString());
                                }}
                                disabled={loadingApprovals[fee.transactionId]}
                              >
                                <span className="text-xs">Approve with Details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Approve Fee Payment</DialogTitle>
                                <DialogDescription>
                                  Enter the amount received and confirm the approval
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Member Details:</p>
                                  <p className="text-sm">
                                    {selectedFee?.firstName} {selectedFee?.lastName}
                                  </p>
                                  <p className="text-sm">Package: {selectedFee?.packageName}</p>
                                  <p className="text-sm">
                                    Expected Amount: ₹{selectedFee?.paidAmount}
                                  </p>
                                  <p className="text-sm">
                                    Dues: ₹{selectedFee?.balanceAmount}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="amount">Amount Received</Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    value={receivedAmount}
                                    onChange={(e) => setReceivedAmount(e.target.value)}
                                    placeholder="Enter amount received"
                                    className="w-full"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedFee(null);
                                      setReceivedAmount('');
                                    }}
                                    disabled={loadingApprovals[selectedFee?.transactionId]}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => handleDetailedApproval(selectedFee.transactionId)}
                                    disabled={loadingApprovals[selectedFee?.transactionId] || !receivedAmount}
                                  >
                                    {loadingApprovals[selectedFee?.transactionId] ? (
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Approving...
                                      </div>
                                    ) : (
                                      'Confirm Approval'
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedApprovals?.length > 0 && (
              <button
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={confirmSelectedFees}
              >
                Confirm Selected Approvals
              </button>
            )}
          </>
        ) : (
          <>
            {width > 700 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member Name</TableHead>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Dues</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedFees?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No approved fees.
                        </TableCell>
                      </TableRow>
                    ) : (
                      approvedFees?.map((fee) => (
                        <TableRow key={fee.transactionId}>
                          <TableCell>
                            {fee.firstName} {fee.lastName}
                          </TableCell>
                          <TableCell>{fee.packageName}</TableCell>
                          <TableCell>
                            {new Date(fee.transactionDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>₹{fee.paidAmount}</TableCell>
                          <TableCell>₹{fee.balanceAmount}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {approvedFees?.length === 0 ? (
                  <p className="text-center text-black dark:text-white">
                    No approved fees.
                  </p>
                ) : (
                  approvedFees?.map((fee) => (
                    <div
                      key={fee.transactionId}
                      className="border rounded-lg p-4 shadow-md dark:border-strokedark"
                    >
                      <p className="text-black dark:text-white font-medium">
                        {fee.firstName} {fee.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Package: {fee.packageName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Date:{' '}
                        {new Date(fee.transactionDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Amount Paid: ₹{fee.paidAmount}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Dues: ₹{fee.balanceAmount}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MemberFeeApproval;
