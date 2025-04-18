import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import { IconButton, Modal, TextField, Button } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { MemberListTable } from '../../components/member/MemberList/memberlist-table';
import { MemberListColumns } from '../../components/member/MemberList/memberlist-column';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/ui/search-bar';

const MemberList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { chapterData } = useData();
  const [totalRecord, setTotalRecord] = useState(0);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    chapterId: chapterData?.chapterId, // Example chapterId
    password: '', // Added password to the state
  });

  // Extracting query parameters
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/member/memberList?page=${page}&rows=${rows}&searchQuery=${search}`,
        {
          chapterId: chapterData.chapterId,
        },
      );
      setMembers(response.data.data);
      setFilteredMembers(response.data.data);
      setTotalRecord(response.data.totalRecords);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };
  
  useEffect(() => {
    if (!chapterData || !chapterData?.chapterId) return; // Ensure chapterData is available before fetching
    fetchMembers();
  }, [chapterData, rows, page, location.search, search]);

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) =>
        member.firstName?.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, members]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleAddMember = async () => {
    try {
      const response = await axiosInstance.post('/api/member/add', [newMember]);
      setMembers([...members, response.data]); // Add new member to the list
      setFilteredMembers([...members, response.data]);
      setOpenModal(false);
      setNewMember({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        chapterId: chapterData.chapterId,
        password: '',
      });
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  if (!chapterData) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
      <Breadcrumb pageName="Member List" />
      <div>
        <SearchBar
          onChange={handleSearchChange}
          value={search}
          className="mb-3 w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <MemberListTable
          data={members}
          columns={MemberListColumns} // Pass refetch function for actions
          searchInputField="firstName" // Searchable field
          totalRecord={totalRecord}
          pagination={{
            pageSize: rows,
            pageIndex: page,
          }}
          state={{ pagination: { pageSize: rows, pageIndex: page } }}
        />
      </div>

      {/* Add Member Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="modal-content p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-24">
          <h2 className="text-xl mb-4 text-center">Add New Member</h2>
          <TextField
            label="First Name"
            fullWidth
            value={newMember.firstName}
            onChange={(e) =>
              setNewMember({ ...newMember, firstName: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Last Name"
            fullWidth
            value={newMember.lastName}
            onChange={(e) =>
              setNewMember({ ...newMember, lastName: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Password"
            type="password" // Make the input type "password"
            fullWidth
            value={newMember.password}
            onChange={(e) =>
              setNewMember({ ...newMember, password: e.target.value })
            } // Corrected to handle password change
            margin="normal"
          />
          <TextField
            label="Phone Number"
            fullWidth
            value={newMember.phoneNumber}
            onChange={(e) =>
              setNewMember({ ...newMember, phoneNumber: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Role"
            fullWidth
            value={newMember.role}
            onChange={(e) =>
              setNewMember({ ...newMember, role: e.target.value })
            }
            margin="normal"
          />
          <div className="flex justify-center mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddMember}
              className="w-1/2"
            >
              Add Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MemberList;
