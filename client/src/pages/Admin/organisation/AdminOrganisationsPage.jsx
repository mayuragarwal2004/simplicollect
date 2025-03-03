import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation } from 'react-router-dom';
import { OrgTable } from './organisation-data-table/org-table';
import { OrgColumns } from './organisation-data-table/org-column';

const AdminOrganisationsPage = () => {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
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
    organisationName: '',
  });

  useEffect(() => {
    fetchOrganisations();
  }, [rows, page]);

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  const fetchOrganisations = () => {
    axiosInstance
      .get(`/api/organisations?rows=${rows}&page=${page}`)
      .then((res) => {
        console.log('Fetched organisations:', res.data);
        setOrganisations(res.data.data || res.data);
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching organisations:', err);
        showNotification('Failed to fetch organisations', 'error');
        setLoading(false);
      });
  };

  const handleOpenModal = (org = null) => {
    if (org) {
      setFormData({
        organisationName: org.organisationName,
      });
      setEditingOrg(org);
    } else {
      setFormData({
        organisationName: '',
      });
      setEditingOrg(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrg(null);
    setFormData({
      organisationName: '',
    });
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
    if (!formData.organisationName.trim()) {
      showNotification('Organisation name is required', 'error');
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
        organisationName: formData.organisationName.trim(),
        numberOfChapters: parseInt(formData.numberOfChapters),
      };
      console.log('Sending payload:', payload);

      let response;
      if (editingOrg) {
        response = await axiosInstance.put(
          `/api/organisations/${editingOrg.organisationId}`,
          payload,
        );
        if (response.data) {
          setOrganisations((prevOrgs) =>
            prevOrgs.map((org) =>
              org.organisationId === editingOrg.organisationId
                ? { ...org, ...response.data }
                : org,
            ),
          );
          showNotification('Organisation updated successfully', 'success');
        }
      } else {
        response = await axiosInstance.post('/api/organisations', payload);
        if (response.data && response.data.organisationId) {
          const newOrg = {
            ...response.data,
          };
          setOrganisations((prevOrgs) => [...prevOrgs, newOrg]);
          showNotification('Organisation created successfully', 'success');
        }
      }

      handleCloseModal();
      await fetchOrganisations();
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        (editingOrg
          ? 'Failed to update organisation'
          : 'Failed to create organisation');
      showNotification(errorMessage, 'error');
    }
  };

  const handleDelete = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this organisation?')) {
      try {
        await axiosInstance.delete(`/api/organisations/${orgId}`);
        showNotification('Organisation deleted successfully', 'success');
        fetchOrganisations();
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || 'Failed to delete organisation';
        showNotification(errorMessage, 'error');
        console.error('Error deleting organisation:', error);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
      {/* Notification */}
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
          Super Admin Organisation Table
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Add Organisation
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <OrgTable
          data={organisations.map(org => ({
            ...org,
            onEdit: handleOpenModal,
            onDelete: handleDelete
          }))}
          columns={OrgColumns}
          searchInputField="organisationName"
          totalRecord={totalRecord}
          pagination={{
            pageSize: parseInt(rows),
            pageIndex: parseInt(page)
          }}
        />
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingOrg ? 'Edit Organisation' : 'Add Organisation'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Organisation Name</label>
                <input
                  type="text"
                  name="organisationName"
                  value={formData.organisationName}
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
                  {editingOrg ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrganisationsPage;
