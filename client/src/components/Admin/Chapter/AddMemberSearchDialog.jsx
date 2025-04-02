

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import { axiosInstance } from '../../../utils/config';
import { useParams } from 'react-router-dom';
import { Select } from '@/components/ui/select'; // Assuming this is a ShadCN component
import { DatePicker } from '@/components/ui/datepicker'; // Assuming this is a ShadCN component

const AddMemberSearchDialog = ({ isOpen, onClose, chapterSlug, fetchMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null); // Track selected member for adding
  const [role, setRole] = useState(''); // Role input
  const [joinDate, setJoinDate] = useState(null); // Join date input

  const fetchSearchResults = async (query, pageNum = 1, reset = false) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/chapter-member-list/searchmemberstoadd?searchQuery=${query}&chapterSlug=${chapterSlug}&page=${pageNum}&limit=10`
      );
      
      const newMembers = response.data || [];
      
      setMembers(prev => 
        reset ? newMembers : [...new Set([...prev, ...newMembers])] // Avoid duplicates
      );
      
      setHasMore(newMembers.length === 10); // Check if more data exists
    } catch (error) {
      toast.error('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce((query) => fetchSearchResults(query, 1, true), 500), []);

  useEffect(() => {
    setPage(1);
    setMembers([]);
    setHasMore(true);
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      !loading && hasMore
    ) {
      fetchSearchResults(searchTerm, page + 1);
      setPage(prev => prev + 1);
    }
  };

  const handleAddMember = (member) => {
    setSelectedMember(member);
  };

  const handleSubmitMemberDetails = async () => {
    if (!role || !joinDate) {
      toast.error('Please provide all details');
      return;
    }
    try {
      await axiosInstance.post(`/api/admin/chapter-member-list/${chapterSlug}/members/${selectedMember.memberId}/addmember`, {
        role,
        joinDate,
      });
      toast.success('Member added successfully');
      fetchMembers();
      onClose();
      setSelectedMember(null); // Reset selected member
      setRole('');
      setJoinDate(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add member');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Members</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div onScroll={handleScroll} className="h-64 overflow-y-auto">
          {loading && <p>Loading...</p>}
          {members.length > 0 ? (
            members.map((member) => (
              <div key={member.memberId} className="flex justify-between items-center p-2 border rounded-md">
                <p>{member.fullName} ({member.phoneNumber})</p>
                {member.isInChapter === 0 && (
                  <Button size="sm" onClick={() => handleAddMember(member)}>
                    Add
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>

        {/* Dialog for entering role and join date */}
        <Dialog open={selectedMember !== null} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Member Details</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <label>Role</label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter role"
                className="mt-2"
              />
            </div>
            <div className="mb-4">
              <label>Join Date</label>
              <DatePicker
                selected={joinDate}
                onChange={setJoinDate}
                className="mt-2"
              />
            </div>
            <Button onClick={handleSubmitMemberDetails}>Add Member</Button>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberSearchDialog;
