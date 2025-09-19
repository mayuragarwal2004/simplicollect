// AdminChaptersMemberList.js
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation, useParams } from 'react-router-dom';
import { MemberTable } from '../Chapter/chapter-member-data-table/chapter-member-table';
import { MemberColumn } from '../Chapter/chapter-member-data-table/chapter-member-column';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multiSelect';
import AddMemberSearchDialog from './AddMemberSearchDialog';
import SearchMembers from './SearchMembers';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { SearchBar } from '@/components/ui/search-bar';
import AddMemberBulkDialog from './AddMemberBulkDialog';

const AdminChaptersMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = parseInt(searchParams.get('rows')) || 10;
  const page = parseInt(searchParams.get('page')) || 0;
  const { chapterSlug } = useParams();
  const [allRoles, setAllRoles] = useState([
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
    {
      roleId: 3,
      roleName: 'Viewer',
      roleDescription: 'Viewer role with read-only access',
      rights: 'view',
      removable: true,
    },
    {
      roleId: 6,
      roleName: 'Member',
      roleDescription: 'Member role with limited access',
      rights: 'view',
      removable: true,
    },
  ]);

  useEffect(() => {
    fetchMembers();
    fetchRoles();
  }, [rows, page, chapterSlug, searchQuery]);

  const fetchMembers = () => {
    axiosInstance
      .get(
        `/api/admin/chapter-member-list/${chapterSlug}/members?rows=${rows}&page=${page + 1}&searchQuery=${searchQuery}`,
      )
      .then((res) => {
        const updatedMembers = res.data.data.map((member) => ({
          ...member,
          onRoleEdit: () => {
            handleRoleSelection(
              member.memberId,
              member.roles.map((role) => role.roleId),
              allRoles,
            );
          },
        }));
        setMembers(updatedMembers);
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch Members');
        setLoading(false);
      });
  };

  const fetchRoles = () => {
    axiosInstance
      .get(`/api/admin/chapters/${chapterSlug}/roles`)
      .then((res) => {
        setAllRoles(res.data);
      })
      .catch(() => {
        toast.error('Failed to fetch roles');
      });
  };

  return (
    <Card className="p-5 shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-semibold">
            Super Admin Chapter Member Table
          </h2>
          <div className='flex gap-2 flex-wrap sm:gap-5'>
            <Button onClick={() => setIsSearchOpen(true)}>Add Member</Button>
            <Button onClick={() => setIsBulkOpen(true)}>Add Bulk Member</Button>
          </div>
        </div>
        <div className="mt-2">
          {/* searchbox to be added here  */}
          <SearchBar
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            placeholder="Search by member name, email, phone number or role"
            className="mb-3 w-full"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MemberTable
          data={members.map((mem) => ({ ...mem, fetchMembers }))}
          columns={MemberColumn(allRoles)}
          searchInputField="memberName"
          totalRecord={totalRecord}
          pagination={{ pageSize: parseInt(rows), pageIndex: parseInt(page) }}
        />
      )}

      <AddMemberSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chapterSlug={chapterSlug}
        fetchMembers={fetchMembers}
      />

      <AddMemberBulkDialog
        isAddDialogOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        fetchMembers={fetchMembers}
      />
    </Card>
  );
};

export default AdminChaptersMemberList;
