import React from 'react';
import { Button } from '../../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import EditIcon from '@mui/icons-material/Edit';

interface FeeApprovalListProps {
  pendingFees: any[];
  approvedFees: any[];
  currentTab: 'pending' | 'approved';
  config: any;
  width: number;
  loadingApprovals: { [key: string]: boolean };
  onDirectApproval: (transactionId: string) => void;
  onOpenApproveDialog: (fee: any) => void;
  onMoveToPending: (transactionId: string) => void;
  selectedApprovals: string[];
  onConfirmSelectedFees: () => void;
}

const FeeApprovalList: React.FC<FeeApprovalListProps> = ({
  pendingFees,
  approvedFees,
  currentTab,
  config,
  width,
  loadingApprovals,
  onDirectApproval,
  onOpenApproveDialog,
  onMoveToPending,
  selectedApprovals,
  onConfirmSelectedFees,
}) => {
  const fees = currentTab === 'pending' ? pendingFees : approvedFees;

  if (width > 700) {
    return (
      <>
        <div className="overflow-x-auto rounded-lg border border-solid">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Package Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Balance</TableHead>
                {config.currentState === 'all_members_approval' && currentTab === 'pending' && (
                  <TableHead>Received By</TableHead>
                )}
                <TableHead>{currentTab === 'pending' ? 'Approve' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={currentTab === 'pending' && config.currentState === 'all_members_approval' ? 7 : 6} className="text-center">
                    {currentTab === 'pending' ? 'No pending fees to approve.' : 'No approved fees.'}
                  </TableCell>
                </TableRow>
              ) : (
                fees?.map((fee) => (
                  <TableRow key={fee.transactionId}>
                    <TableCell>
                      {fee.firstName} {fee.lastName}
                    </TableCell>
                    <TableCell>{fee.packageName}</TableCell>
                    <TableCell>
                      {new Date(fee.transactionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(fee.paidAmount)}
                    </TableCell>
                    <TableCell>
                      <span className={fee.balanceAmount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }).format(Math.abs(fee.balanceAmount))}
                        {fee.balanceAmount < 0 ? ' (Due)' : ' (Advance)'}
                      </span>
                    </TableCell>
                    {config.currentState === 'all_members_approval' && currentTab === 'pending' && (
                      <TableCell>
                        {fee.paymentReceivedByName || '-'}
                      </TableCell>
                    )}
                    <TableCell>
                      {currentTab === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDirectApproval(fee.transactionId)}
                            className="h-8 px-2"
                            disabled={loadingApprovals[fee.transactionId]}
                          >
                            {loadingApprovals[fee.transactionId] ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            ) : (
                              <span className="text-xs">Quick Approve</span>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => onOpenApproveDialog(fee)}
                            disabled={loadingApprovals[fee.transactionId]}
                          >
                            <span className="text-xs flex items-center">
                              <EditIcon fontSize="small" className="mr-1" />
                              Edit
                            </span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => onMoveToPending(fee.transactionId)}
                          disabled={loadingApprovals[fee.transactionId]}
                        >
                          {loadingApprovals[fee.transactionId] ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <span className="text-xs">Move to Pending</span>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {currentTab === 'pending' && selectedApprovals?.length > 0 && (
          <button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={onConfirmSelectedFees}
          >
            Confirm Selected Approvals
          </button>
        )}
      </>
    );
  }

  // Mobile view
  return (
    <>
      <div className="flex flex-col space-y-4">
        {fees?.length === 0 ? (
          <p className="text-center text-black dark:text-white">
            {currentTab === 'pending' ? 'No pending fees to approve.' : 'No approved fees.'}
          </p>
        ) : (
          fees?.map((fee) => (
            <div
              key={fee.transactionId}
              className="border rounded-lg p-4 shadow-md dark:border-strokedark bg-white dark:bg-boxdark flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black dark:text-white font-medium text-base">
                    {fee.firstName} {fee.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Package:{' '}
                    <span className="font-semibold">
                      {fee.packageName}
                    </span>
                  </p>
                  {config.currentState === 'all_members_approval' && currentTab === 'pending' && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Received By:{' '}
                      <span className="font-semibold">
                        {fee.paymentReceivedByName || '-'}
                      </span>
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(fee.transactionDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex-1 min-w-[120px]">
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Amount Paid
                  </span>
                  <span className="block text-base font-semibold text-green-700 dark:text-green-300">
                    ₹{fee.paidAmount}
                  </span>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Balance
                  </span>
                  <span className={`block text-base font-semibold ${
                    fee.balanceAmount < 0 
                      ? 'text-red-700 dark:text-red-300' 
                      : 'text-green-700 dark:text-green-300'
                  }`}>
                    ₹{Math.abs(fee.balanceAmount)} {fee.balanceAmount < 0 ? '(Due)' : '(Advance)'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {currentTab === 'pending' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDirectApproval(fee.transactionId)}
                      className="h-8 px-2"
                      disabled={loadingApprovals[fee.transactionId]}
                    >
                      {loadingApprovals[fee.transactionId] ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        <span className="text-xs">Quick Approve</span>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => onOpenApproveDialog(fee)}
                      disabled={loadingApprovals[fee.transactionId]}
                    >
                      <span className="text-xs flex items-center">
                        <EditIcon fontSize="small" className="mr-1" />
                        Edit
                      </span>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => onMoveToPending(fee.transactionId)}
                    disabled={loadingApprovals[fee.transactionId]}
                  >
                    {loadingApprovals[fee.transactionId] ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <span className="text-xs">Move to Pending</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {currentTab === 'pending' && selectedApprovals?.length > 0 && (
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={onConfirmSelectedFees}
        >
          Confirm Selected Approvals
        </button>
      )}
    </>
  );
};

export default FeeApprovalList;
