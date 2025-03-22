import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation } from 'react-router-dom';
import { MembersTable } from './members-data-table/members-table';
import { MembersColumns } from './members-data-table/members-column';

const AdminMembersTableData = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChap, setEditingChap] = useState(null);
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
  const [formData, setFormData] = useState({
    membersName: '',
  });

  useEffect(() => {
    fetchMembers();
  }, [rows, page]);

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  const fetchMembers = () => {
    axiosInstance
      .get(`/api/admin/members?rows=${rows}&page=${page}`)
      .then((res) => {
        console.log('Fetched members:', res.data);
        setMembers(res.data.data || res.data);
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching members:', err);
        showNotification('Failed to fetch members', 'error');
        setLoading(false);
      });
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setFormData({
        membersName: member.membersName,
      });
      setEditingChap(member);
    } else {
      setFormData({
        membersName: '',
      });
      setEditingChap(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChap(null);
    setFormData({
      membersName: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.membersName.trim()) {
      showNotification('Members name is required', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        membersName: formData.membersName.trim(),
        numberOfMembers: parseInt(formData.numberOfMembers),
      };
      console.log('Sending payload:', payload);

      let response;
      if (editingChap) {
        response = await axiosInstance.put(
          `/api/admin/members/${editingChap.membersId}`,
          payload,
        );
        if (response.data) {
          setMembers((prevMembers) =>
            prevMembers.map((member) =>
              member.membersId === editingChap.membersId
                ? { ...member, ...response.data }
                : member,
            ),
          );
          showNotification('Members updated successfully', 'success');
        }
      } else {
        response = await axiosInstance.post('/api/admin/members', payload);
        if (response.data && response.data.membersId) {
          const newMember = {
            ...response.data,
          };
          setMembers((prevMembers) => [...prevMembers, newMember]);
          showNotification('Members created successfully', 'success');
        }
      }

      handleCloseModal();
      await fetchMembers();
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        (editingChap
          ? 'Failed to update members'
          : 'Failed to create members');
      showNotification(errorMessage, 'error');
    }
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axiosInstance.delete(`/api/admin/members/${memberId}`);
        showNotification('Member deleted successfully', 'success');
        await fetchMembers();
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || 'Failed to delete member';
        showNotification(errorMessage, 'error');
        console.error('Error deleting member:', error);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
      {/* Notification */}
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
        <h2 className="text-xl font-semibold">
          Super Admin Member Table
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Add Member
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MembersTable
          data={members.map(member => ({
            ...member,
            onEdit: handleOpenModal,
            onDelete: handleDelete
          }))}
          columns={MembersColumns}
          searchInputField="membersName"
          totalRecord={totalRecord}
          pagination={{
            pageSize: parseInt(rows),
            pageIndex: parseInt(page)
          }}
        />
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingChap ? 'Edit Member' : 'Add Member'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Member Name</label>
                <input
                  type="text"
                  name="membersName"
                  value={formData.membersName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Phone Number</label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Number of Members</label>
                <input
                  type="number"
                  name="numberOfMembers"
                  value={formData.numberOfMembers}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  {editingChap ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembersTableData;
