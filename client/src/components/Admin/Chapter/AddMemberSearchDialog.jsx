import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import { axiosInstance } from '../../../utils/config';

const AddMemberSearchDialog = ({ isOpen, onClose, chapterId, fetchMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchSearchResults = async (query, pageNum = 1, reset = false) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/chapter-member-list/searchmembers?searchQuery=${query}&chapterId=${chapterId}&page=${pageNum}&limit=10`
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

  const handleAddMember = async (memberId) => {
    try {
      await axiosInstance.post('/api/admin/members', { memberId, chapterId });
      toast.success('Member added successfully');
      fetchMembers();
      onClose();
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
                  <Button size="sm" onClick={() => handleAddMember(member.memberId)}>
                    Add
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberSearchDialog;