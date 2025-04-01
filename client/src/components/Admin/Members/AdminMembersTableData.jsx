import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation } from 'react-router-dom';
import { MembersTable } from './members-data-table/members-table';
import { MembersColumns } from './members-data-table/members-column';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

const AdminMembersTableData = () => {
  const [members, setMembers] = useState([
    {
      membersId: 1,
      membersName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      // numberOfMembers: '1',
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChap, setEditingChap] = useState(null);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    membersName: '',
    email: '',
    phoneNumber: '',
    numberOfMembers: '',
  });

  useEffect(() => {
    fetchMembers();
  }, [rows, page]);

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
        toast.error('Failed to fetch members');
        setLoading(false);
      });
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setFormData({
        membersName: member.membersName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        numberOfMembers: member.numberOfMembers,
      });
      setEditingChap(member);
    } else {
      setFormData({
        membersName: '',
        email: '',
        phoneNumber: '',
        numberOfMembers: '',
      });
      setEditingChap(null);
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) =>
        member.membersName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery, members]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChap(null);
    setFormData({
      membersName: '',
      email: '',
      phoneNumber: '',
      numberOfMembers: '',
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
      toast.error('Members name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (!formData.numberOfMembers.trim()) {
      toast.error('Number of members is required');
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
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
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
          toast.success('Members updated successfully');
        }
      } else {
        response = await axiosInstance.post('/api/admin/members', payload);
        if (response.data && response.data.membersId) {
          const newMember = {
            ...response.data,
          };
          setMembers((prevMembers) => [...prevMembers, newMember]);
          toast.success('Members created successfully');
        }
      }

      handleCloseModal();
      await fetchMembers();
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        (editingChap ? 'Failed to update members' : 'Failed to create members');
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (memberId) => {
    setDeleteMemberId(memberId);
  };

  const handleConfirmDelete = async () => {
    if (deleteMemberId) {
      try {
        await axiosInstance.delete(`/api/admin/members/${deleteMemberId}`);
        toast.success('Member deleted successfully');
        await fetchMembers();
      } catch (error) {
        toast.error('Failed to delete member');
        console.error('Error deleting member:', error);
      }
      setDeleteMemberId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Super Admin Member Table</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Add Member
        </button>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MembersTable
          data={members.map((member) => ({
            ...member,
            onEdit: handleOpenModal,
            onDelete: () => handleDeleteClick(member.membersId),
          }))}
          columns={MembersColumns}
          searchInputField="membersName"
          totalRecord={totalRecord}
          pagination={{
            pageSize: parseInt(rows),
            pageIndex: parseInt(page),
          }}
        />
      )}

      <AlertDialog open={!!deleteMemberId} onOpenChange={setDeleteMemberId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Are you sure you want to delete this member?</p>
          <AlertDialogFooter>
            <Button variant="secondary" onClick={() => setDeleteMemberId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
