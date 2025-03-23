import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation ,useParams} from 'react-router-dom';
import { MemberTable } from '../Chapter/chapter-member-data-table/chapter-member-table';
import { MemberColumn } from '../Chapter/chapter-member-data-table/chapter-member-column';

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
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({ memberName: '', email: '' });
  const [selectedOrganisation, setSelectedOrganisation] = useState(null);
     
  const { chapterSlug } = useParams();
  
  useEffect(() => {
    fetchMembers();
  }, [rows, page, chapterSlug]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const fetchMembers = () => {
    axiosInstance
      .get(`/api/admin/chapter-member-list/${chapterSlug}/members?rows=${rows}&page=${page}`)
      .then((res) => {
        setMembers(res.data.members || res.data);
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch(() => {
        showNotification('Failed to fetch Members', 'error');
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
      showNotification('All fields are required', 'error');
      return;
    }
    if (!selectedOrganisation) {
      showNotification('Please select an organisation', 'error');
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
        showNotification('Member updated successfully', 'success');
      } else {
        response = await axiosInstance.post('/api/admin/members', payload);
        setMembers((prev) => [...prev, response.data]);
        showNotification('Member added successfully', 'success');
      }
      handleCloseModal();
      fetchMembers();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to process request', 'error');
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
        <h2 className="text-xl font-semibold">Super Admin Member Table</h2>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">
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
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">{editingMember ? 'Edit Member' : 'Add Member'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Member Name</label>
                <input 
                  type="text" 
                  name="memberName" 
                  value={formData.memberName} 
                  onChange={(e) => setFormData({ ...formData, memberName: e.target.value })} 
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full p-2 border rounded" 
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
