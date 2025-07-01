import { axiosInstance } from '@/utils/config';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Recipient {
  memberId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface BulkResult {
  success: boolean;
  totalSent: number;
  recipients: Recipient[];
}

const AdminNotificationsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<any[]>([]);
  const [roles, setRoles] = useState<string[]>(['Leader', 'Member', 'Treasurer', 'Secretary']);
  
  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [priority, setPriority] = useState('medium');
  const [isPersistent, setIsPersistent] = useState(true);
  const [targetType, setTargetType] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [customRecipients, setCustomRecipients] = useState('');
  
  // Results
  const [lastResult, setLastResult] = useState<BulkResult | null>(null);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/chapters');
      setChapters(response.data.chapters || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    setLoading(true);
    
    try {
      let targetData: any = {};
      
      switch (targetType) {
        case 'chapter':
          if (!selectedChapter) {
            toast.error('Please select a chapter');
            return;
          }
          targetData = { chapterId: selectedChapter };
          break;
          
        case 'role':
          if (!selectedRole) {
            toast.error('Please select a role');
            return;
          }
          targetData = { role: selectedRole };
          if (selectedChapter) {
            targetData.chapterId = selectedChapter;
          }
          break;
          
        case 'custom':
          if (!customRecipients.trim()) {
            toast.error('Please provide custom recipients');
            return;
          }
          
          const recipients = customRecipients.split('\n').map(line => line.trim()).filter(line => line);
          const memberIds: string[] = [];
          const phoneNumbers: string[] = [];
          const emails: string[] = [];
          
          recipients.forEach(recipient => {
            if (recipient.includes('@')) {
              emails.push(recipient);
            } else if (/^\d+$/.test(recipient)) {
              phoneNumbers.push(recipient);
            } else {
              memberIds.push(recipient);
            }
          });
          
          targetData = { memberIds, phoneNumbers, emails };
          break;
      }

      const notificationData = {
        title,
        message,
        type,
        priority,
        isPersistent,
        targetType,
        targetData
      };

      const response = await axiosInstance.post('/api/notifications/send-bulk', notificationData);

      if (response.data.success) {
        toast.success(`Notifications sent to ${response.data.totalSent} recipients`);
        setLastResult(response.data);
        
        // Clear form
        setTitle('');
        setMessage('');
        setCustomRecipients('');
      } else {
        toast.error(response.data.message || 'Failed to send notifications');
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast.error('Failed to send notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Send Notifications
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Send notifications to members across your organization
        </p>
      </div>

      <form onSubmit={handleSendNotification} className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Notification Content
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Notification title"
                required
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="payment">Payment</option>
                <option value="report">Report</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Notification message"
              required
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="persistent"
                checked={isPersistent}
                onChange={(e) => setIsPersistent(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="persistent" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Persistent Notification
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recipients
          </h2>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Type
            </label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Members</option>
              <option value="chapter">Specific Chapter</option>
              <option value="role">Specific Role</option>
              <option value="custom">Custom List</option>
            </select>
          </div>

          {targetType === 'chapter' && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Chapter
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Choose a chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter.chapterId} value={chapter.chapterId}>
                    {chapter.chapterName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'role' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Choose a role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chapter (Optional)
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All chapters</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.chapterId} value={chapter.chapterId}>
                      {chapter.chapterName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {targetType === 'custom' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Recipients
              </label>
              <textarea
                value={customRecipients}
                onChange={(e) => setCustomRecipients(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter member IDs, phone numbers, or email addresses (one per line)&#10;Example:&#10;member123&#10;+919876543210&#10;user@example.com"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter one recipient per line. You can use member IDs, phone numbers, or email addresses.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Notification'
            )}
          </button>
        </div>
      </form>

      {lastResult && (
        <div className="mt-8 rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
            Notification Sent Successfully
          </h3>
          <p className="mt-2 text-green-700 dark:text-green-300">
            Sent to {lastResult.totalSent} recipients
          </p>
          
          <details className="mt-4">
            <summary className="cursor-pointer text-green-800 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
              View Recipients ({lastResult.recipients.length})
            </summary>
            <div className="mt-2 max-h-40 overflow-y-auto">
              <ul className="text-sm text-green-700 dark:text-green-300">
                {lastResult.recipients.map((recipient, index) => (
                  <li key={index} className="py-1">
                    {recipient.name} ({recipient.email || recipient.phoneNumber})
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;
