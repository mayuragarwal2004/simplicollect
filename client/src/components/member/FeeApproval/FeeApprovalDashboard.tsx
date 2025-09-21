import React from 'react';
import { formatCurrencyINR } from '../../../utils/currencyUtility';

interface FeeApprovalDashboardProps {
  metaData: {
    totalCollected: number;
    pendingAmount: number;
    approvedAmount: number;
    totalTransferredToChapter: number;
    remainingToTransfer: number;
  };
}

const FeeApprovalDashboard: React.FC<FeeApprovalDashboardProps> = ({ metaData }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-md shadow">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Total Collected
        </p>
        <p className="text-lg font-semibold dark:text-white">
          {formatCurrencyINR(metaData.totalCollected)}
        </p>
      </div>
      <div className="bg-yellow-100 dark:bg-yellow-700 p-4 rounded-md shadow">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Pending Approvals
        </p>
        <p className="text-lg font-semibold dark:text-white">
          {formatCurrencyINR(metaData.pendingAmount)}
        </p>
      </div>
      <div className="bg-green-100 dark:bg-green-700 p-4 rounded-md shadow">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Approved Fees
        </p>
        <p className="text-lg font-semibold dark:text-white">
          {formatCurrencyINR(metaData.approvedAmount)}
        </p>
      </div>
      <div className="bg-blue-100 dark:bg-blue-700 p-4 rounded-md shadow">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Transferred to Chapter
        </p>
        <p className="text-lg font-semibold dark:text-white">
          {formatCurrencyINR(metaData.totalTransferredToChapter)}
        </p>
      </div>
    </div>
  );
};

export default FeeApprovalDashboard;
