import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import useWindowDimensions from '../../utils/useWindowDimensions';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Checkbox, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

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
  const { chapterData } = useData();
  const { width } = useWindowDimensions();
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [config, setConfig] = useState<any>({
    allowAllMembersApproval: false,
    currentState: 'self_approval', // all_members_approval
  });

  console.log({ pendingFees });

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchPendingFees();
      fetchIsAllowedAllMembersApproval();
    }
  }, [chapterData]);

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchPendingFees();
    }
  }, [config.currentState]);

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

  const fetchPendingFees = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/payment/pendingPaymentRequests/${chapterData?.chapterId}`,
        { currentState: config.currentState },
      );
      console.log({ response });

      console.log({ got: response.data });

      setPendingFees(response.data); // Access the `data` property from the response
    } catch (error) {
      console.error('Fetching pending fees failed:', error);
    }
  };

  const handleApprovalChange = (transactionId: string) => {
    setSelectedApprovals((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId],
    );
  };

  console.log({ selectedApprovals });

  const confirmSelectedFees = async () => {
    try {
      await axiosInstance.put('/api/payment/approvePendingPayment', {
        transactionIds: selectedApprovals, // Send the first selected transactionId (or adjust for multiple approvals)
      });
      setPendingFees((prev) =>
        prev.filter((fee) => !selectedApprovals.includes(fee.transactionId)),
      );
      setSelectedApprovals([]);
    } catch (error) {
      console.error('Confirming fees failed:', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Member Fee Approval" />
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium dark:text-white">
            Pending Fee Approvals
          </h2>
          <IconButton aria-label="refresh" onClick={fetchPendingFees}>
            <RefreshIcon className="dark:text-white" />
          </IconButton>
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

        {width > 700 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-left dark:bg-meta-4">
                  <th className="py-3 px-4 text-black dark:text-white">
                    Member Name
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Package Name
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">Date</th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Amount Paid
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">Dues</th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Approve
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingFees?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4 text-black dark:text-white"
                    >
                      No pending fees to approve.
                    </td>
                  </tr>
                ) : (
                  pendingFees?.map((fee) => (
                    <tr
                      key={fee.transactionId}
                      className="border-b border-gray-300 dark:border-strokedark"
                    >
                      <td className="py-3 px-4 text-black dark:text-white">
                        {fee.firstName} {fee.lastName}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {fee.packageName}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {new Date(fee.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        ₹{fee.paidAmount}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        ₹{fee.dueAmount}
                      </td>
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedApprovals.includes(
                            fee.transactionId,
                          )}
                          onChange={() =>
                            handleApprovalChange(fee.transactionId)
                          }
                          color="primary"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                    Date: {new Date(fee.transactionDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Amount Paid: ₹{fee.paidAmount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Dues: ₹{fee.dueAmount}
                  </p>
                  <div className="mt-2">
                    <Checkbox
                      checked={selectedApprovals.includes(fee.transactionId)}
                      onChange={() => handleApprovalChange(fee.transactionId)}
                      color="primary"
                    />
                    <span className="text-black dark:text-white">Approve</span>
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
      </div>
    </>
  );
};

export default MemberFeeApproval;
