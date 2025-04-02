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
import AddMemberSearchDialog from './AddMemberSearchDialog';
import SearchMembers from './SearchMembers'

const AdminChaptersMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [totalRecord, setTotalRecord] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;
  const { chapterSlug } = useParams();

  useEffect(() => {
    fetchMembers();
  }, [rows, page, chapterSlug]);

  const fetchMembers = () => {
    axiosInstance
      .get(`/api/admin/chapter-member-list/${chapterSlug}/members?rows=${rows}&page=${page}`)
      .then((res) => {
        setMembers(res.data.data || res.data);
        setTotalRecord(res.data.totalRecords || res.data.length);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch Members');
        setLoading(false);
      });
  };

  return (
    <Card className="p-5 shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Super Admin Chapter Member Table
          </h2>
          <Button onClick={() => setIsSearchOpen(true)}>Add Member</Button>
        </div>
        <div className="mt-2">
          <SearchMembers chapterId={1} />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MemberTable
          data={members.map((mem) => ({ ...mem, fetchMembers }))}
          columns={MemberColumn}
          searchInputField="memberName"
          totalRecord={totalRecord}
          pagination={{ pageSize: parseInt(rows), pageIndex: parseInt(page) }}
        />
      )}

      {/* Member Search Dialog */}
      <AddMemberSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chapterSlug={chapterSlug}
        fetchMembers={fetchMembers}
      />
    </Card>
  );
};

export default AdminChaptersMemberList;