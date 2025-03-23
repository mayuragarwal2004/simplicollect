import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation, useParams } from 'react-router-dom';
import { MemberTable } from '../Chapter/chapter-member-data-table/chapter-member-table';
import { MemberColumn } from '../Chapter/chapter-member-data-table/chapter-member-column';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white z-50`}>
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Super Admin Chapter Slug Member Table</h2>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white dark:bg-black rounded hover:bg-opacity-90">
          Add Member
        </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg w-full max-w-lg dark:bg-boxdark">
            <h3 className="text-xl font-semibold mb-4">{editingMember ? 'Edit Member' : 'Add Member'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Member Name</label>
                <input 
                  type="text" 
                  name="memberName" 
                  value={formData.memberName} 
                  onChange={(e) => setFormData({ ...formData, memberName: e.target.value })} 
                  className="w-full p-2 border rounded bg-background dark:bg-boxdark dark:text-white" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full p-2 border rounded bg-background dark:bg-boxdark dark:text-white" 
                  required 
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
                  {editingMember ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChaptersMemberList;