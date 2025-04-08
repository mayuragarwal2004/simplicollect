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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const AdminMembersTableData = () => {
  const [members, setMembers] = useState([
    {
      membersId: 1,
      membersName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChap, setEditingChap] = useState(null);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = parseInt(searchParams.get('rows')) || 10;
  const page = parseInt(searchParams.get('page')) || 0;
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
      .get(`/api/admin/members/getandsearchmembers?rows=${rows}&page=${page+1}`)
      .then((res) => {
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

  // useEffect(() => {
  //   setFilteredMembers(
  //     members.filter((member) =>
  //       member.membersName.toLowerCase().includes(searchQuery.toLowerCase()),
  //     ),
  //   );
  // }, [searchQuery, members]);

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
        membersName: formData.membersName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        numberOfMembers: parseInt(formData.numberOfMembers),
      };

      if (editingMember) {
        await axiosInstance.put(
          `/api/admin/members/${editingMember.membersId}`,
          payload,
        );
        toast.success('Member updated successfully');
      } else {
        await axiosInstance.post('/api/admin/members', payload);
        toast.success('Member added successfully');
      }
      handleCloseDialog();
      fetchMembers();
    } catch (error) {
      toast.error('Failed to submit member');
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

  const handleOpenAddDialog = () => {
    setFormData({
      membersName: '',
      email: '',
      phoneNumber: '',
      numberOfMembers: '',
    });
    setIsAddDialogOpen(true);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/admin/members', formData);
      setMembers((prevMembers) => [...prevMembers, response.data]);
      toast.success('Member added successfully');
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  const handleOpenDialog = (member = null) => {
    if (member) {
      setFormData({
        membersName: member.membersName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        numberOfMembers: member.numberOfMembers,
      });
      setEditingMember(member);
    } else {
      setFormData({
        membersName: '',
        email: '',
        phoneNumber: '',
        numberOfMembers: '',
      });
      setEditingMember(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingMember(null);
    setFormData({
      membersName: '',
      email: '',
      phoneNumber: '',
      numberOfMembers: '',
    });
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Super Admin Member Table</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddDialog}>Add Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember}>
              <Input
                name="membersName"
                placeholder="Member Name"
                value={formData.membersName}
                onChange={handleInputChange}
                className="mb-4"
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="mb-4"
                required
              />
              <Input
                name="phoneNumber"
                type="number"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mb-4"
                required
              />
              <Input
                name="numberOfMembers"
                type="number"
                placeholder="Number of Members"
                value={formData.numberOfMembers}
                onChange={handleInputChange}
                className="mb-4"
                required
              />
              <DialogFooter>
                <Button variant="secondary" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
            onEdit: handleOpenDialog,
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Edit Member' : 'Add Member'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="membersName"
              placeholder="Member Name"
              value={formData.membersName}
              onChange={handleInputChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="numberOfMembers"
              placeholder="Number of Members"
              value={formData.numberOfMembers}
              onChange={handleInputChange}
              required
            />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingMember(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editingMember ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembersTableData;
