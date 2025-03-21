import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils/config';
import { useLocation } from 'react-router-dom';
import { ChapterRuleTable } from './ChapterRules/chapterRule-data-table/chapterRule-table';
import { ChapterRuleColumns } from './ChapterRules/chapterRule-data-table/chapterRule-column';
import { Button } from '../../../../components/ui/button';
import ChapterAddMember from './ChapterAddMember';
import ChapterBasicDetails from './ChapterBasicDetails';

function ChapterRules() {
  const [roles, setRoles] = useState([]); // State for roles
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null); // State for editing role
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });
  const [formData, setFormData] = useState({
    roleName: '',
    roleDescription: '',
    rights: '',
  });

  const [showNextComponent, setShowNextComponent] = useState(false);
  const [showBackComponent, setShowBackComponent] = useState(false);

  // Fetch roles from the API
  useEffect(() => {
    fetchRoles();
  }, [rows, page]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Show notification
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  // Fetch roles from the API
  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get(`/api/chapter-rules?rows=${rows}&page=${page}`);
      console.log('Fetched roles:', res.data);
      setRoles(res.data.data || res.data); // Update state with roles
      setTotalRecord(res.data.totalRecords || res.data.length);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching roles:', err);
      showNotification('Failed to fetch roles', 'error');
      setLoading(false);
    }
  };

  // Open modal for adding/editing a role
  const handleOpenModal = (role = null) => {
    if (role) {
      setFormData({
        roleName: role.roleName,
        roleDescription: role.roleDescription,
        rights: role.rights,
      });
      setEditingRole(role);
    } else {
      setFormData({
        roleName: '',
        roleDescription: '',
        rights: '',
      });
      setEditingRole(null);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({
      roleName: '',
      roleDescription: '',
      rights: '',
    });
  };

  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form fields
  const validateForm = () => {
    if (!formData.roleName.trim()) {
      showNotification('Role name is required', 'error');
      return false;
    }
    if (!formData.roleDescription.trim()) {
      showNotification('Role description is required', 'error');
      return false;
    }
    if (!formData.rights.trim()) {
      showNotification('Rights are required', 'error');
      return false;
    }
    return true;
  };

  // Handle form submission (add/edit role)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        roleName: formData.roleName.trim(),
        roleDescription: formData.roleDescription.trim(),
        rights: formData.rights.trim(),
      };

      let response;
      if (editingRole) {
        response = await axiosInstance.put(
          `/api/chapter-rules/${editingRole.roleId}`,
          payload,
        );
        if (response.data) {
          // Update the specific role in the state
          setRoles((prevRoles) =>
            prevRoles.map((role) =>
              role.roleId === editingRole.roleId ? { ...role, ...response.data } : role,
            ),
          );
          showNotification('Role updated successfully', 'success');
        }
      } else {
        response = await axiosInstance.post('/api/chapter-rules', payload);
        if (response.data && response.data.roleId) {
          // Add the new role to the state
          const newRole = {
            ...response.data,
          };
          setRoles((prevRoles) => [...prevRoles, newRole]);
          showNotification('Role created successfully', 'success');
        }
      }

      handleCloseModal();
      await fetchRoles(); // Refresh the list after submission
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        (editingRole ? 'Failed to update role' : 'Failed to create role');
      showNotification(errorMessage, 'error');
    }
  };

  // Handle role deletion
  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await axiosInstance.delete(`/api/chapter-rules/${roleId}`);
        showNotification('Role deleted successfully', 'success');
        fetchRoles(); // Refresh the list after deletion
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || 'Failed to delete role';
        showNotification(errorMessage, 'error');
        console.error('Error deleting role:', error);
      }
    }
  };

  // Navigate to the next component
  const handleNext = () => {
    setShowNextComponent(true);
  };

  const handleBack = () => {
    setShowBackComponent(true);
  };

  // Render the next component if `showNextComponent` is true
  if (showNextComponent) {
    return <ChapterAddMember />;
  }
  if (showBackComponent) {
    return <ChapterBasicDetails />;
  }

  return (
    <div className="fixed w-auto inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="p-6 bg-white rounded-2xl shadow-lg text-center w-[600px]">
        {notification.show && (
          <div
            className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white z-50`}
          >
            {notification.message}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Set up Roles for the Chapters
          </h2>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ChapterRuleTable
            data={roles.map((role) => ({
              ...role,
              onEdit: handleOpenModal,
              onDelete: handleDelete,
            }))}
            columns={ChapterRuleColumns}
            searchInputField="roleName"
            totalRecord={totalRecord}
            pagination={{
              pageSize: parseInt(rows),
              pageIndex: parseInt(page),
            }}
          />
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {editingRole ? 'Edit Role' : 'Add Role'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Role Name</label>
                  <input
                    type="text"
                    name="roleName"
                    value={formData.roleName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Role Description</label>
                  <input
                    type="text"
                    name="roleDescription"
                    value={formData.roleDescription}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Rights</label>
                  <input
                    type="text"
                    name="rights"
                    value={formData.rights}
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
                    {editingRole ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-5">
          <button
            className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
            onClick={() => handleOpenModal()}
          >
            Add Role
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            onClick={handleBack}
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChapterRules;