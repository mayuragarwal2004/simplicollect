import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation, useParams } from 'react-router-dom';
import { MemberTable } from '../Chapter/chapter-member-data-table/chapter-member-table';
import { MemberColumn } from '../Chapter/chapter-member-data-table/chapter-member-column';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const AdminChaptersMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;
  const [formData, setFormData] = useState({ memberName: '', email: '' });
  const [selectedOrganisation, setSelectedOrganisation] = useState(null);
  
  const { chapterSlug } = useParams();

  useEffect(() => {
    fetchMembers();
  }, [rows, page, chapterSlug]);

  const fetchMembers = () => {
    axiosInstance
      .get(`/api/admin/chapter-member-list/${chapterSlug}/members?rows=${rows}&page=${page}`)
      .then((res) => {
        setMembers(res.data.data || res.data);
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch Members');
        setLoading(false);
      });
  };
  const handleOpenModal = (member = null) => {
    if (member) {
      setFormData({ memberName: member.memberName, email: member.email });
      setEditingMember(member);
    } else {
      setFormData({ memberName: '', email: '' });
      setEditingMember(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData({ memberName: '', email: '' });
    setSelectedOrganisation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.memberName.trim() || !formData.email.trim()) {
      toast.error('All fields are required');
      return;
    }
    if (!selectedOrganisation) {
      toast.error('Please select an organisation');
      return;
    }

    try {
      const payload = { 
        memberName: formData.memberName.trim(), 
        email: formData.email.trim(), 
        organisation: selectedOrganisation 
      };
      let response;
      if (editingMember) {
        response = await axiosInstance.put(`/api/admin/members/${editingMember.memberId}`, payload);
        setMembers((prev) => prev.map((mem) => (mem.memberId === editingMember.memberId ? { ...mem, ...response.data } : mem)));
        toast.success('Member updated successfully');
      } else {
        response = await axiosInstance.post('/api/admin/members', payload);
        setMembers((prev) => [...prev, response.data]);
        toast.success('Member added successfully');
      }
      handleCloseModal();
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to process request');
    }
  };

  return (
    <Card className="p-5 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Super Admin Chapter Member Table</h2>
        <Button onClick={() => handleOpenModal()}>Add Member</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MemberTable 
          data={members.map((mem) => ({ ...mem, onEdit: handleOpenModal, onDelete: fetchMembers }))}
          columns={MemberColumn}
          searchInputField="memberName"
          totalRecord={totalRecord}
          pagination={{ pageSize: parseInt(rows), pageIndex: parseInt(page) }}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Member' : 'Add Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Member Name</Label>
              <Input 
                type="text" 
                value={formData.memberName} 
                onChange={(e) => setFormData({ ...formData, memberName: e.target.value })} 
                required 
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingMember ? 'Update' : 'Add'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminChaptersMemberList;
