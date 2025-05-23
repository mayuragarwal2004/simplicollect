import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChapterAddMemberTable } from './AddMember/chapAddMember-data-table/chapterAddMember-table';
import { ChapterAddMemberColumns } from './AddMember/chapAddMember-data-table/chapterAddMember-column';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import ChapterRoles from './ChapterRoles/ChapterRoles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

function ChapterAddMember() {
  const navigate = useNavigate();
  const [showBackComponent, setShowBackComponent] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;

  useEffect(() => {
    fetchMembers();
  }, [rows, page]);

  const fetchMembers = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/chapter-members?rows=${rows}&page=${page}`,
      );
      setMembers(res.data.data || res.data);
      setTotalRecord(res.data.totalRecords || res.data.length);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch members');
      setLoading(false);
    }
  };

  const handleNext = () => {
    navigate('/admin/chapters');
  };

  const handleAddMember = () => {
    const newMember = {
      memberId: `new-${Date.now()}`,
      memberName: '',
      role: '',
      isNew: true,
    };
    setMembers((prev) => [newMember, ...prev]);
    setEditingRow(newMember.memberId);
  };

  const handleEditRow = (memberId, field, value) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.memberId === memberId ? { ...member, [field]: value } : member,
      ),
    );
  };

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
        response = await axiosInstance.post('/api/chapter-members', payload);
        if (response.data && response.data.memberId) {
          toast.success('Member created successfully');
          fetchMembers();
        }
      } else {
        response = await axiosInstance.put(
          `/api/chapter-members/${memberId}`,
          payload,
        );
        if (response.data) {
          toast.success('Member updated successfully');
          fetchMembers();
        }
      }
      setEditingRow(null);
    } catch (error) {
      toast.error('Failed to save member');
    }
  };

  const handleDeleteClick = (memberId) => {
    setDeleteMemberId(memberId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteMemberId) return;
    try {
      await axiosInstance.delete(`/api/chapter-members/${deleteMemberId}`);
      toast.success('Member deleted successfully');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
    setDeleteMemberId(null);
  };

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post(
        '/api/chapter-members/bulk-upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      if (response.data) {
        toast.success('Members uploaded successfully');
        fetchMembers();
        setIsBulkUploadOpen(false);
        setFile(null);
      }
    } catch (error) {
      toast.error('Failed to upload members');
    }
  };

  const handleAddAllNewMembers = async () => {
    const newMembers = members.filter((member) => member.isNew);

    if (newMembers.length === 0) {
      toast.error('No new members to add.');
      return;
    }

    try {
      for (const member of newMembers) {
        if (!member.memberName.trim() || !member.role.trim()) {
          toast.error('All new members must have a name and role.');
          return;
        }

        const payload = {
          memberName: member.memberName.trim(),
          email: member.email?.trim() || '',
          role: member.role.trim(),
        };

        await axiosInstance.post('/api/chapter-members', payload);
      }

      toast.success('All new members added successfully');
      fetchMembers(); // Refresh the table
    } catch (error) {
      toast.error('Failed to add members');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBack = () => {
    setShowBackComponent(true);
  };

  if (showBackComponent) {
    return <ChapterRoles />;
  }

  return (
    <Card className="p-6 bg-white rounded-lg shadow-lg mt-4">
      {/* Page Title */}
      <h2 className="text-xl font-semibold mb-4">Add Members to the Chapter</h2>

      {/* Members Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ChapterAddMemberTable
          data={members.map((member) => ({
            ...member,
            onEdit: handleEditRow,
            onSave: handleSaveRow,
            onDelete: () => handleDeleteClick(member.memberId),
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

      <AlertDialog open={!!deleteMemberId} onOpenChange={setDeleteMemberId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Are you sure you want to delete this member?</p>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteMemberId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add and Bulk Upload Buttons */}
      <div className="flex justify-start gap-5 mt-4">
        <Button variant="outline" onClick={handleAddMember}>
          Add New Member
        </Button>
        <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
          Bulk Member Upload
        </Button>
      </div>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Member Upload</DialogTitle>
          </DialogHeader>
          <Input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="w-full"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Back & Next Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleAddAllNewMembers}>Add</Button>
      </div>
    </Card>
  );
}

export default ChapterAddMember;
