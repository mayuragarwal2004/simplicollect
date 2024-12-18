import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { IconButton, Modal, TextField, Button } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { Member } from '../../models/Member';

const MemberList: React.FC = () => {
  const { chapterData } = useData();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    chapterId: chapterData.chapterId, // Example chapterId
    password: '',  // Added password to the state
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.post('/api/member/memberList', {
          chapterId: chapterData.chapterId,
        });
        setMembers(response.data);
        setFilteredMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) =>
        member.firstName.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, members]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddMember = async () => {
    try {
      const response = await axiosInstance.post('/api/member/add', [newMember]);
      setMembers([...members, response.data]); // Add new member to the list
      setFilteredMembers([...members, response.data]);
      setOpenModal(false);
      setNewMember({ firstName: '', lastName: '', email: '', phoneNumber: '', role: '', chapterId: chapterData.chapterId, password: '' });
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
      <Breadcrumb pageName="Member List" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Member List</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Add Member
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b dark:border-gray-600">Name</th>
              <th className="py-2 px-4 border-b dark:border-gray-600">Email</th>
              <th className="py-2 px-4 border-b dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.memberId}>
                <td className="py-2 px-4 border-b dark:border-gray-600">{member.firstName}</td>
                <td className="py-2 px-4 border-b dark:border-gray-600">{member.email}</td>
                <td className="py-2 px-4 border-b dark:border-gray-600">
                  <div className="flex space-x-2">
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteForeverIcon />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="modal-content p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-24">
          <h2 className="text-xl mb-4 text-center">Add New Member</h2>
          <TextField
            label="First Name"
            fullWidth
            value={newMember.firstName}
            onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Last Name"
            fullWidth
            value={newMember.lastName}
            onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password" // Make the input type "password"
            fullWidth
            value={newMember.password}
            onChange={(e) => setNewMember({ ...newMember, password: e.target.value })} // Corrected to handle password change
            margin="normal"
          />
          <TextField
            label="Phone Number"
            fullWidth
            value={newMember.phoneNumber}
            onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Role"
            fullWidth
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
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
