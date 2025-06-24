import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select as Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multiSelect';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/ui/search-bar';
import { MemberListTable } from '../../components/member/MemberList/memberlist-table';
import { MemberListColumns } from '../../components/member/MemberList/memberlist-column';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const DUE_REASONS = [
  'Correction',
  'Payment Error',
  'Admin Adjustment',
  'Other',
];

const ROLES = ['Member', 'Admin', 'Treasurer', 'President']; // Replace with your actual roles

// Add Member Dialog
function AddMemberDialog({ open, onOpenChange, chapterId, refresh }) {
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    chapterId: chapterId,
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/member/add', [newMember]);
      if (res.status === 200) {
        setNewMember({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          role: '',
          chapterId,
          password: '',
        });
        onOpenChange(false);
        refresh();
        toast.success('Member added successfully');
      } else {
        toast.error('Failed to add member');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error adding member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            placeholder="First Name"
            value={newMember.firstName}
            onChange={(e) =>
              setNewMember({ ...newMember, firstName: e.target.value })
            }
          />
          <Input
            placeholder="Last Name"
            value={newMember.lastName}
            onChange={(e) =>
              setNewMember({ ...newMember, lastName: e.target.value })
            }
          />
          <Input
            placeholder="Email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
          />
          <Input
            placeholder="Password"
            type="password"
            value={newMember.password}
            onChange={(e) =>
              setNewMember({ ...newMember, password: e.target.value })
            }
          />
          <Input
            placeholder="Phone Number"
            value={newMember.phoneNumber}
            onChange={(e) =>
              setNewMember({ ...newMember, phoneNumber: e.target.value })
            }
          />
          <Input
            placeholder="Role"
            value={newMember.role}
            onChange={(e) =>
              setNewMember({ ...newMember, role: e.target.value })
            }
          />
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Change Role Dialog
function ChangeRoleDialog({ open, onOpenChange, member, allRoles, refresh, chapterId }) {
  const [newRole, setNewRole] = useState(member?.roleNames || '');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setNewRole(member?.roleNames || '');
  }, [member]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/member/role_update', {
        memberId: member.memberId,
        roleIds: newRole,
        chapterId,
      });
      if (res.status === 200) {
        onOpenChange(false);
        refresh();
        toast.success('Role changed successfully');
      } else {
        toast.error('Failed to change role');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error changing role');
    } finally {
      setLoading(false);
    }
  };

  const currentUserRoles = member?.roleIds.split(',') || [];

  const handleRolesChange = (selectedRoles) => {
    setNewRole(selectedRoles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Change role for{' '}
            <b>
              {member?.firstName} {member?.lastName}
            </b>
          </DialogDescription>
        </DialogHeader>
        <MultiSelect
          options={allRoles.map((role) => ({
            label: role.roleName,
            value: role.roleId.toString(),
          }))}
          onValueChange={handleRolesChange}
          defaultValue={currentUserRoles.map(String)}
          placeholder="Select Rights"
          maxCount={5}
        />
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? 'Saving...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Due Waive Off Dialog
function DueWaiveOffDialog({
  open,
  onOpenChange,
  member,
  reasons,
  refresh,
  chapterId,
}) {
  const [newDue, setNewDue] = useState(member?.balance || '');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setNewDue(member?.balance || '');
    setReason('');
    setCustomReason('');
  }, [member]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/member/balance_update', {
        memberId: member.memberId,
        newBalance: newDue,
        reason: reason === 'Other' ? customReason : reason,
        chapterId,
      });
      if (res.status === 200) {
        setNewDue('');
        setReason('');
        setCustomReason('');
        onOpenChange(false);
        refresh();
        toast.success('Due updated successfully');
      } else {
        toast.error('Failed to update due');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error updating due');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Due Waive Off</DialogTitle>
          <DialogDescription>
            Waive off due for{' '}
            <b>
              {member?.firstName} {member?.lastName}
            </b>
          </DialogDescription>
        </DialogHeader>
        <Input
          type="number"
          placeholder="New Due Amount"
          value={newDue}
          onChange={(e) => setNewDue(e.target.value)}
          className="mb-2"
        />
        <Select
          value={reason}
          onValueChange={(val) => {
            setReason(val);
            if (val !== 'Other') setCustomReason('');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Reason" />
          </SelectTrigger>
          <SelectContent>
            {reasons.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {reason === 'Other' && (
          <Input
            placeholder="Enter custom reason"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="mt-2"
          />
        )}
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? 'Saving...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Remove Member Dialog
function RemoveMemberDialog({ open, onOpenChange, member, refresh }) {
  const [leaveDate, setLeaveDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLeaveDate(format(new Date(), 'yyyy-MM-dd'));
  }, [member]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/member/remove', {
        memberId: member.memberId,
        leaveDate,
      });
      if (res.status === 200) {
        setLeaveDate(format(new Date(), 'yyyy-MM-dd'));
        onOpenChange(false);
        refresh();
        toast.success('Member removed successfully');
      } else {
        toast.error('Failed to remove member');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error removing member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            Remove{' '}
            <b>
              {member?.firstName} {member?.lastName}
            </b>{' '}
            from chapter?
          </DialogDescription>
        </DialogHeader>
        <Input
          type="date"
          value={leaveDate}
          onChange={(e) => setLeaveDate(e.target.value)}
          className="mb-2"
        />
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Removing...' : 'Remove'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const MemberList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { chapterData } = useData();
  const [totalRecord, setTotalRecord] = useState(0);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  // Action modals state
  const [roleModal, setRoleModal] = useState({ open: false, member: null });
  const [dueModal, setDueModal] = useState({ open: false, member: null });
  const [removeModal, setRemoveModal] = useState({ open: false, member: null });
  const [allRoles, setAllRoles] = useState([]);

  // Extracting query parameters
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/member/memberList?page=${page}&rows=${rows}&searchQuery=${search}`,
        {
          chapterId: chapterData.chapterId,
        },
      );
      setMembers(response.data.data);
      setFilteredMembers(response.data.data);
      setTotalRecord(response.data.totalRecords);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/chapter/${chapterData.chapterSlug}/roles`,
      );
      setAllRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    if (!chapterData || !chapterData?.chapterId) return; // Ensure chapterData is available before fetching
    fetchMembers();
    fetchRoles();
  }, [chapterData, rows, page, location.search, search]);

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) =>
        member.firstName?.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, members]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Action handlers
  const handleChangeRole = (member) => setRoleModal({ open: true, member });
  const handleDueWaiveOff = (member) => setDueModal({ open: true, member });
  const handleRemoveMember = (member) => setRemoveModal({ open: true, member });

  if (!chapterData) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
      <Breadcrumb pageName="Member List" />
      <div>
        <SearchBar
          onChange={handleSearchChange}
          value={search}
          className="mb-3 w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <MemberListTable
          data={members}
          columns={MemberListColumns({
            onChangeRole: handleChangeRole,
            onDueWaiveOff: handleDueWaiveOff,
            onRemove: handleRemoveMember,
          })}
          searchInputField="firstName"
          totalRecord={totalRecord}
          pagination={{
            pageSize: rows,
            pageIndex: page,
          }}
          state={{ pagination: { pageSize: rows, pageIndex: page } }}
        />
      </div>

      {/* Add Member Modal (shadcn) */}
      <AddMemberDialog
        open={openModal}
        onOpenChange={setOpenModal}
        chapterId={chapterData.chapterId}
        refresh={fetchMembers}
      />
      {/* Change Role Modal */}
      <ChangeRoleDialog
        open={roleModal.open}
        onOpenChange={(open) => setRoleModal((m) => ({ ...m, open }))}
        member={roleModal.member}
        allRoles={allRoles}
        refresh={fetchMembers}
        chapterId={chapterData.chapterId}
      />
      {/* Due Waive Off Modal */}
      <DueWaiveOffDialog
        open={dueModal.open}
        onOpenChange={(open) => setDueModal((m) => ({ ...m, open }))}
        member={dueModal.member}
        reasons={DUE_REASONS}
        refresh={fetchMembers}
        chapterId={chapterData.chapterId}
      />
      {/* Remove Member Modal */}
      <RemoveMemberDialog
        open={removeModal.open}
        onOpenChange={(open) => setRemoveModal((m) => ({ ...m, open }))}
        member={removeModal.member}
        refresh={fetchMembers}
        chapterId={chapterData.chapterId}
      />
    </div>
  );
};

export default MemberList;
