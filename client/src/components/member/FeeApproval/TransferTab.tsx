import React from 'react';
import FeeApprovalDashboard from './FeeApprovalDashboard';
import TransferAmountToChapter from '../FeeReceiver/TransferAmountToChapter';

interface TransferTabProps {
  metaData: {
    totalCollected: number;
    pendingAmount: number;
    approvedAmount: number;
    totalTransferredToChapter: number;
    remainingToTransfer: number;
  };
}

const TransferTab: React.FC<TransferTabProps> = ({ metaData }) => {
  return (
    <div className="space-y-6">
      <FeeApprovalDashboard metaData={metaData} />
      
      {metaData.remainingToTransfer > 0 ? (
        <TransferAmountToChapter />
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-300 mt-4 p-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            All Set!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            All approved fees have been transferred to the chapter!
          </p>
        </div>
      )}
    </div>
  );
};

export default TransferTab;
