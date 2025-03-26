import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation } from 'react-router-dom';
import { ChapterTable } from './chapters-data-table/chapter-table';
import { ChapterColumn } from './chapters-data-table/chapter-column';
import OrganisationSelection from './CreateNew/OrganistaionSeletion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminChaptersPage = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;
  const [formData, setFormData] = useState({ chapterName: '' });
  const [selectedOrganisation, setSelectedOrganisation] = useState(null);

  useEffect(() => {
    fetchChapters();
  }, [rows, page]);

  const fetchChapters = () => {
    axiosInstance
      .get(`/api/admin/chapters?rows=${rows}&page=${page}`)
      .then((res) => {
        setChapters(res.data.data || res.data);
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to fetch Chapters');
        setLoading(false);
      });
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (chapter) => {
    setFormData({ chapterName: chapter.chapterName });
    setEditingChapter(chapter);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingChapter(null);
    setFormData({ chapterName: '' });
    setSelectedOrganisation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.chapterName.trim()) {
      toast.error('Chapter name is required');
      return;
    }

    try {
      const payload = editingChapter
        ? { chapterName: formData.chapterName.trim() }
        : {
            chapterName: formData.chapterName.trim(),
            organisation: selectedOrganisation,
          };
      let response;
      if (editingChapter) {
        response = await axiosInstance.put(
          `/api/admin/chapters/${editingChapter.chapterId}`,
          payload,
        );
        setChapters((prev) =>
          prev.map((chap) =>
            chap.chapterId === editingChapter.chapterId
              ? { ...chap, ...response.data }
              : chap,
          ),
        );
        toast.success('Chapter updated successfully');
      } else {
        if (!selectedOrganisation) {
          toast.error('Please select an organisation');
          return;
        }
        response = await axiosInstance.post('/api/admin/chapters', payload);
        setChapters((prev) => [...prev, response.data]);
        toast.success('Chapter created successfully');
      }
      handleCloseModals();
      fetchChapters();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to process request');
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await axiosInstance.delete(`/api/admin/chapters/${chapterId}`);
      setChapters((prev) =>
        prev.filter((chap) => chap.chapterId !== chapterId),
      );
      toast.success('Chapter deleted successfully');
    } catch (error) {
      toast.error('Failed to delete chapter');
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Super Admin Chapter Table</h2>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 "
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
            onEdit: () => handleOpenEditModal(chap),
            onDelete: () => handleDeleteChapter(chap.chapterId),
          }))}
          columns={ChapterColumn}
          searchInputField="chapterName"
          totalRecord={totalRecord}
          pagination={{ pageSize: parseInt(rows), pageIndex: parseInt(page) }}
        />
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <OrganisationSelection
            onCancel={handleCloseModals}
            onNext={(org) => {
              setSelectedOrganisation(org);
              setIsAddModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingChapter ? 'Edit Chapter' : 'Add Chapter'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Chapter Name</label>
                <input
                  type="text"
                  name="chapterName"
                  value={formData.chapterName}
                  onChange={(e) =>
                    setFormData({ ...formData, chapterName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
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

