import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../utils/config';
import { useLocation } from 'react-router-dom';
import { ChapterRoleTable } from './chapterRule-data-table/chapterRole-table';
import { ChapterRoleColumns } from './chapterRule-data-table/chapterRole-column';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiSelect } from "@/components/ui/MultiSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

function ChapterRoles() {
  const [roles, setRoles] = useState([
    {
      roleId: 1,
      roleName: 'Admin',
      roleDescription: 'Administrator role with full access',
      rights: 'all',
      removable: false,
    },
    {
      roleId: 2,
      roleName: 'Editor',
      roleDescription: 'Editor role with limited access',
      rights: 'edit',
      removable: true,
    },
  ]);
  const [featureMaster, setFeatureMaster] = useState([
    {
      featureId: 1,
      featureName: 'Feature 1',
    },
    {
      featureId: 2,
      featureName: 'Feature 2',
    },
    {
      featureId: 3,
      featureName: 'Feature 3',
    },
  ]);
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
    rights: [], 
    removable: false,
  });

  useEffect(() => {
    fetchRoles();
    fetchFeatures();
  }, [rows, page]);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/chapter-Roles?rows=${rows}&page=${page}`
      );

      const updatedRoles = (res.data.data || res.data).map((role) => ({
        ...role,
        onEdit: () => handleOpenModal(role),
        onDelete: () => handleDelete(role.roleId),
      }));

      setRoles(updatedRoles);
      setTotalRecord(res.data.totalRecords || res.data.length);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch roles');
      setLoading(false);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await axiosInstance.get('/api/featuredMasterTable');
      setFeatureMaster(response.data);
    } catch (error) {
      toast.error('Failed to fetch features');
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setFormData({
        roleName: role.roleName,
        roleDescription: role.roleDescription,
        rights: Array.isArray(role.rights) ? role.rights : [], 
        removable: role.removable || false,
      });
      setEditingRole(role);
    } else {
      setFormData({ roleName: '', roleDescription: '', rights: [], removable: false });
      setEditingRole(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({ roleName: '', roleDescription: '', rights: [], removable: false });
  };

  const handleRightsChange = (selectedValues) => {
    setFormData((prev) => ({ ...prev, rights: Array.isArray(selectedValues) ? selectedValues : [] }));
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
    if (!formData.roleName.trim() || !formData.roleDescription.trim() || formData.rights.length === 0) {
      toast.error('All fields are required');
      return;
    }

    try {
      let response;
      if (editingRole) {
        response = await axiosInstance.put(`/api/chapter-Roles/${editingRole.roleId}`, formData);
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.roleId === editingRole.roleId
              ? { ...role, ...response.data, onEdit: () => handleOpenModal(response.data), onDelete: () => handleDelete(response.data.roleId) }
              : role
          )
        );
        toast.success('Role updated successfully');
      } else {
        response = await axiosInstance.post('/api/chapter-Roles', formData);
        setRoles((prevRoles) => [
          ...prevRoles,
          { ...response.data, onEdit: () => handleOpenModal(response.data), onDelete: () => handleDelete(response.data.roleId) },
        ]);
        toast.success('Role created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('An error occurred while saving');
    }
  };

  const handleDelete = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await axiosInstance.delete(`/api/chapter-Roles/${roleId}`);
      setRoles((prevRoles) => prevRoles.filter((role) => role.roleId !== roleId));
      toast.success('Role deleted successfully');
    } catch (error) {
      toast.error('Failed to delete role');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mt-4 relative">
      <h2 className="text-xl font-semibold mb-4">Set up Roles for the Chapters</h2>
      {loading ? <p>Loading...</p> : <ChapterRoleTable data={roles} columns={ChapterRoleColumns(handleOpenModal, handleDelete)} totalRecord={totalRecord} />}
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
          <MultiSelect options={featureMaster} onValueChange={handleRightsChange} defaultValue={formData.rights} placeholder="Select Rights" maxCount={5} />
          <DialogFooter>
            <Button onClick={handleCloseModal} variant="secondary">Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChapterRoles;