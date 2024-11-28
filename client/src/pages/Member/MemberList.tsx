import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FilterTags from '../../components/FilterTags';

import { IconButton, Backdrop } from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  CurrencyRupee,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import ViewVisitor from '../Visitor/VisitorListComponents/ViewVisitor';
import ExportVisitorData from '../Visitor/VisitorListComponents/ExportVisitorData';
import { Member } from '../../models/Member';

const MemberList: React.FC = () => {
  const { chapterData } = useData();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.post('/api/member/memberList', {
          chapterId: 1,
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

  const handleDeleteMember = async (memberId: string) => {
    try {
      await axiosInstance.delete(`/members/${memberId}`);
      setMembers(members.filter((member) => member.id !== memberId));
    } catch (error) {
      console.error('Error deleting member:', error);
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
          <IconButton onClick={() => setBackDropOpen(true)}>
            <FileDownloadIcon />
          </IconButton>
        </div>
      </div>
      {/* <FilterTags  /> */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b dark:border-gray-600">Name</th>
              <th className="py-2 px-4 border-b dark:border-gray-600">Email</th>
              <th className="py-2 px-4 border-b dark:border-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.memberId}>
                <td className="py-2 px-4 border-b dark:border-gray-600">
                  {member.firstName}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-600">
                  {member.email}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-600">
                  <div className="flex space-x-2">
                    <IconButton onClick={() => setSelectedMember(member)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteMember(member.id)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Backdrop open={backDropOpen} onClick={() => setBackDropOpen(false)}>
        {/* <ExportVisitorData /> */}
      </Backdrop>
      {/* {selectedMember && (
        <ViewVisitor
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )} */}
    </div>
  );
  return <></>;
};

export default MemberList;
