

import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation } from 'react-router-dom';
import { ChapterTable } from './chapters-data-table/chapter-table';
import { ChapterColumn } from './chapters-data-table/chapter-column';

const AdminChaptersPage = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
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
    ChapterName: '',
  });

  useEffect(() => {
    fetchChapters();
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

  const fetchChapters = () => {
    axiosInstance
      .get(`/api/admin/chapters?rows=${rows}&page=${page}`)
      .then((res) => {
        console.log('Fetched chapters:', res.data);
        setChapters(res.data.data || res.data);
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Chapters:', err);
        showNotification('Failed to fetch Chapters', 'error');
        setLoading(false);
      });
  };

  const handleOpenModal = (chap = null) => {
    if (chap) {
      setFormData({
        chapterName: chap.chapterName,
      });
      setEditingChapter(chap);
    } else {
      setFormData({
        chapterName: '',
      });
      setEditingChapter(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChapter(null);
    setFormData({
      chapterName: '',
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
    if (!formData.chapterName.trim()) {
      showNotification('Chapter name is required', 'error');
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
        chapterName: formData.chapterName.trim(),
        numberOfChapters: parseInt(formData.numberOfChapters),
      };
      console.log('Sending payload:', payload);

      let response;
      if (editingChapter) {
        response = await axiosInstance.put(
          `/api/admin/chapters/${editingChapter.chapterId}`,
          payload,
        );
        if (response.data) {
          setChpaters((prevChap) =>
            prevChap.map((chap) =>
              chap.chapterId === editingChapter.chapterId
                ? { ...chap, ...response.data }
                : chap,
            ),
          );
          showNotification('Chapters updated successfully', 'success');
        }
      } else {
        response = await axiosInstance.post('/api/admin/chapters', payload);
        if (response.data && response.data.chapterId) {
          const newChap = {
            ...response.data,
          };
          setChapters((prevChap) => [...prevChap, newChap]);
          showNotification('Chapters created successfully', 'success');
        }
      }

      handleCloseModal();
      await fetchChapters();
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        (editingChapter
          ? 'Failed to update chapter'
          : 'Failed to create chapter');
      showNotification(errorMessage, 'error');
    }
  };

  const handleDelete = async (chapId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        await axiosInstance.delete(`/api/admin/chapters/${chapId}`);
        showNotification('Chapter deleted successfully', 'success');
        fetchChapters();
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || 'Failed to delete chapter';
        showNotification(errorMessage, 'error');
        console.error('Error deleting chapter:', error);
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
        <h2 className="text-xl font-semibold">Super Admin Chapter Table</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Add Chapter
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ChapterTable
          data={chapters.map((chap) => ({
            ...chap,
            onEdit: handleOpenModal,
            onDelete: handleDelete,
          }))}
          columns={ChapterColumn}
          searchInputField="chapterName"
          totalRecord={totalRecord}
          pagination={{
            pageSize: parseInt(rows),
            pageIndex: parseInt(page),
          }}
        />
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingChapter ? 'Edit Chapter' : 'Add Chapters'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Chapter Name</label>
                <input
                  type="text"
                  name="chapterName"
                  value={formData.chapterName}
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
                  {editingChapter ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChaptersPage;
