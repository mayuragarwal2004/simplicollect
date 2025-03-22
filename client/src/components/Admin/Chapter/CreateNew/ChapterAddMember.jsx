import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChapterAddMemberTable } from './AddMember/chapAddMember-data-table/chapterAddMember-table';
import { ChapterAddMemberColumns } from './AddMember/chapAddMember-data-table/chapterAddMember-column';
import { Button } from '../../../../components/ui/button';
import ChapterRules from './ChapterRules';

function ChapterAddMember() {
  const navigate = useNavigate();
  const [showBackComponent, setShowBackComponent] = useState(false);
  const [members, setMembers] = useState([]); // State for members
  const [loading, setLoading] = useState(true);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false); // State for bulk upload modal
  const [file, setFile] = useState(null); // State for uploaded file
  const [editingRow, setEditingRow] = useState(null); // State for editing row in the table
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });

  const handleNext = () => {
    navigate('/admin/chapters');
  }

  // Fetch members from the API
  useEffect(() => {
    fetchMembers();
  }, [rows, page]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Show notification
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  // Fetch members from the API
  const fetchMembers = () => {
    axiosInstance
      .get(`/api/chapter-members?rows=${rows}&page=${page}`)
      .then((res) => {
        console.log('Fetched members:', res.data);
        setMembers(res.data.data || res.data); // Update state with members
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching members:', err);
        showNotification('Failed to fetch members', 'error');
        setLoading(false);
      });
  };

  // Add a new row for inline editing
  const handleAddMember = () => {
    const newMember = {
      memberId: `new-${Date.now()}`, // Temporary ID for new member
      memberName: '',
      role: '',
      isNew: true, // Flag to identify new rows
    };
    setMembers((prev) => [newMember, ...prev]);
    setEditingRow(newMember.memberId); // Set the new row in edit mode
  };

  // Handle inline editing
  const handleEditRow = (memberId, field, value) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.memberId === memberId ? { ...member, [field]: value } : member,
      ),
    );
  };

  // Save the edited row
  const handleSaveRow = async (memberId) => {
    const member = members.find((m) => m.memberId === memberId);
    if (!member) return;

    try {
      const payload = {
        memberName: member.memberName.trim(),
        email: member.email.trim(),
        role: member.role.trim(),
      };

      let response;
      if (member.isNew) {
        // Add new member
        response = await axiosInstance.post('/api/chapter-members', payload);
        if (response.data && response.data.memberId) {
          showNotification('Member created successfully', 'success');
          fetchMembers(); // Refresh the list
        }
      } else {
        // Update existing member
        response = await axiosInstance.put(
          `/api/chapter-members/${memberId}`,
          payload,
        );
        if (response.data) {
          showNotification('Member updated successfully', 'success');
          fetchMembers(); // Refresh the list
        }
      }
      setEditingRow(null); // Exit edit mode
    } catch (error) {
      console.error('Error saving member:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to save member';
      showNotification(errorMessage, 'error');
    }
  };

  // Handle bulk upload
  const handleBulkUpload = async () => {
    if (!file) {
      showNotification('Please select a file to upload', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/api/chapter-members/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        showNotification('Members uploaded successfully', 'success');
        fetchMembers(); // Refresh the list
        setIsBulkUploadOpen(false); // Close the modal
        setFile(null); // Reset file input
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to upload members';
      showNotification(errorMessage, 'error');
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle member deletion
  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axiosInstance.delete(`/api/chapter-members/${memberId}`);
        showNotification('Member deleted successfully', 'success');
        fetchMembers(); // Refresh the list after deletion
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || 'Failed to delete member';
        showNotification(errorMessage, 'error');
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleBack = () => {
    setShowBackComponent(true);
  };

  if (showBackComponent) {
    return <ChapterRules />;
  }

  return (
    <div className="fixed w-auto inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="p-6 bg-white rounded-2xl shadow-lg text-center w-[600px]">
        {notification.show && (
          <div
            className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white z-50`}
          >
            {notification.message}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Members to the Chapter</h2>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ChapterAddMemberTable
            data={members.map((member) => ({
              ...member,
              onEdit: handleEditRow,
              onSave: handleSaveRow,
              onDelete: handleDelete,
              isEditing: editingRow === member.memberId,
            }))}
            columns={ChapterAddMemberColumns}
            searchInputField="memberName"
            totalRecord={totalRecord}
            pagination={{
              pageSize: parseInt(rows),
              pageIndex: parseInt(page),
            }}
          />
        )}

        <div className="flex justify-start gap-5">
          <Button
            className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 my-5 rounded-lg border-2"
            onClick={handleAddMember}
          >
            Add New Member
          </Button>
          <Button
            className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 my-5 rounded-lg border-2"
            onClick={() => setIsBulkUploadOpen(true)}
          >
            Bulk Member Upload
          </Button>
        </div>

        {isBulkUploadOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Bulk Member Upload</h3>
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsBulkUploadOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkUpload}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button
            onClick={handleBack}
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChapterAddMember;