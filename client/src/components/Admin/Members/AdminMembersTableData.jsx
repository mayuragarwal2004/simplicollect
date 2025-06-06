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
      memberId: '1',
      firstName: 'John',
      lastName: 'Doe',
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
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [selectedMemberForPasswordChange, setSelectedMemberForPasswordChange] =
    useState(null);
  const [changePasswordForm, setChangePasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchMembers();
  }, [rows, page, searchQuery]);

  const fetchMembers = () => {
    axiosInstance
      .get(`/api/admin/members/getandsearchmembers`, {
        params: {
          searchQuery: searchQuery.trim(),
          rows: rows,
          page: page + 1, // Adjusting for 1-based pagination
        },
      })
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
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phoneNumber: member.phoneNumber,
      });
      setEditingChap(member);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      });
      setEditingChap(null);
    }
    setIsModalOpen(true);
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
    if (!formData.firstName?.trim()) {
      toast.error('First name is required');
      return false;
    }

    if (!formData.email?.trim() && !formData.phoneNumber?.trim()) {
      toast.error('Email is required or Phone number is required ');
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
        firstName: formData.firstName,
        lastName: formData.lastName || null,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber || null,
      };

      if (editingMember) {
        await axiosInstance.put(
          `/api/admin/members/${editingMember.memberId}`,
          payload,
        );
        toast.success('Member updated successfully');
        setIsDialogOpen(false);
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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
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
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phoneNumber: member.phoneNumber,
      });
      setEditingMember(member);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    });
  };

  const handleOpenChangePasswordDialog = (memberId) => {
    setSelectedMemberForPasswordChange(memberId);
    setChangePasswordForm({
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangePasswordDialogOpen(true);
  };

  const handleChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = changePasswordForm;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await axiosInstance.put(
        `/api/admin/members/updatepassword/${selectedMemberForPasswordChange}`,
        {
          password: newPassword,
          confirmPassword: confirmPassword,
        },
      );
      toast.success('Password changed successfully');
      setIsChangePasswordDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to change password');
    }
  };

  console.log({ members });

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
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mb-4"
                required
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
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
            membersName: `${member.firstName} ${member.lastName}`, // Combine for display
            onEdit: handleOpenDialog,
            onDelete: () => handleDeleteClick(member.memberId),
            onChangePassword: () =>
              handleOpenChangePasswordDialog(member.memberId),
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
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
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

      <Dialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={changePasswordForm.newPassword}
              onChange={handleChangePasswordInput}
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={changePasswordForm.confirmPassword}
              onChange={handleChangePasswordInput}
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsChangePasswordDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => isChangePasswordDialogOpen(false)}
                type="submit"
              >
                Change Password{' '}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembersTableData;
