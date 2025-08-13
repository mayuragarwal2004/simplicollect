import React from 'react';

interface ApprovalControlsProps {
  config: {
    allowAllMembersApproval: boolean;
    currentState: string;
  };
  currentTab: 'pending' | 'approved';
  onConfigChange: (newConfig: any) => void;
  onTabChange: (tab: 'pending' | 'approved') => void;
}

const ApprovalControls: React.FC<ApprovalControlsProps> = ({
  config,
  currentTab,
  onConfigChange,
  onTabChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded-l ${
            currentTab === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
          }`}
          onClick={() => onTabChange('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-r ${
            currentTab === 'approved'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
          }`}
          onClick={() => onTabChange('approved')}
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
              onConfigChange((prev: any) => ({
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
    </div>
  );
};

export default ApprovalControls;
