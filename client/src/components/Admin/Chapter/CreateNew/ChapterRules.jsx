import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils/config';
import { useLocation } from 'react-router-dom';
import { ChapterRuleTable } from './ChapterRules/chapterRule-data-table/chapterRule-table';
import { ChapterRuleColumns } from './ChapterRules/chapterRule-data-table/chapterRule-column';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChapterAddMember from './ChapterAddMember';

function ChapterRules() {
  const [roles, setRoles] = useState([]);
  const [showNextComponent, setShowNextComponent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;
  const [formData, setFormData] = useState({
    roleName: '',
    roleDescription: '',
    rights: '',
    removable: false,
  });

  useEffect(() => {
    fetchRoles();
  }, [rows, page]);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get(`/api/chapter-rules?rows=${rows}&page=${page}`);
      setRoles(
        (res.data.data || res.data).map((role) => ({
          ...role,
          onEdit: handleOpenModal,
          onDelete: handleDelete,
          onToggleRemovable: toggleRemovable,
        }))
      );
      setTotalRecord(res.data.totalRecords || res.data.length);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch roles');
      setLoading(false);
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setFormData({
        roleName: role.roleName,
        roleDescription: role.roleDescription,
        rights: role.rights,
        removable: role.removable,
      });
      setEditingRole(role);
    } else {
      setFormData({
        roleName: '',
        roleDescription: '',
        rights: '',
        removable: false,
      });
      setEditingRole(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({
      roleName: '',
      roleDescription: '',
      rights: '',
      removable: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roleName.trim()) {
      toast.error('Role name is required');
      return;
    }
    if (!formData.roleDescription.trim()) {
      toast.error('Role description is required');
      return;
    }
    if (!formData.rights.trim()) {
      toast.error('Rights are required');
      return;
    }

    try {
      const payload = { ...formData };
      let response;
      if (editingRole) {
        response = await axiosInstance.put(`/api/chapter-rules/${editingRole.roleId}`, payload);
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.roleId === editingRole.roleId ? { ...role, ...response.data } : role
          )
        );
        toast.success('Role updated successfully');
      } else {
        response = await axiosInstance.post('/api/chapter-rules', payload);
        setRoles((prevRoles) => [...prevRoles, { ...response.data }]);
        toast.success('Role created successfully');
      }
      handleCloseModal();
      fetchRoles();
    } catch (error) {
      toast.error('An error occurred while saving');
    }
  };

  const handleNext = () => {
    setShowNextComponent(true);
  };

  if (showNextComponent) {
    return <ChapterAddMember />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mt-4 relative">
      <h2 className="text-xl font-semibold mb-4">Set up Roles for the Chapters</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ChapterRuleTable data={roles} columns={ChapterRuleColumns} totalRecord={totalRecord} />
      )}
      <div className="flex justify-center mt-5">
        <Button onClick={() => handleOpenModal()}>Add Role</Button>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
          </DialogHeader>
          <Input name="roleName" placeholder="Role Name" value={formData.roleName} onChange={handleInputChange} />
          <Input name="roleDescription" placeholder="Role Description" value={formData.roleDescription} onChange={handleInputChange} />
          <Input name="rights" placeholder="Rights" value={formData.rights} onChange={handleInputChange} />
          <DialogFooter>
            <Button onClick={handleCloseModal} variant="secondary">Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="absolute bottom-4 right-4">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}

export default ChapterRules;
