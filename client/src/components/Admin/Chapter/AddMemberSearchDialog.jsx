

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import { axiosInstance } from '../../../utils/config';
import { useParams } from 'react-router-dom';
import { DatePicker } from '@/components/ui/datepicker';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, UserPlus, Calendar, User2 } from 'lucide-react';

const AddMemberSearchDialog = ({ isOpen, onClose, chapterSlug, fetchMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null); // Track selected member for adding
  const [roles, setRoles] = useState([]); // Available roles
  const [selectedRoles, setSelectedRoles] = useState([]); // Selected role IDs
  const [joinDate, setJoinDate] = useState(new Date()); // Join date input with default current date

  console.log({selectedRoles});
  

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

  // Fetch available roles when dialog opens
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/chapters/${chapterSlug}/roles`);
        const rolesData = response.data;
        setRoles(rolesData);
        // Reset and auto-select default roles whenever the member selection changes
        const defaultRoleIds = rolesData
          .filter(role => Boolean(role.default))
          .map(role => role.roleId.toString());
        // Reset selected roles when member changes or when roles are fetched
        setSelectedRoles([]);
        // Set default roles in the next tick to ensure clean state
        setTimeout(() => setSelectedRoles(defaultRoleIds), 0);
      } catch (error) {
        toast.error('Failed to fetch roles');
      }
    };
    if (selectedMember) {
      fetchRoles();
    }
  }, [selectedMember, chapterSlug]);

  const handleAddMember = (member) => {
    setSelectedMember(member);
  };

  const handleSubmitMemberDetails = async () => {
    if (!selectedRoles.length || !joinDate) {
      toast.error('Please provide all details');
      return;
    }
    try {
      await axiosInstance.post(`/api/admin/chapter-member-list/${chapterSlug}/members/${selectedMember.memberId}/addmember`, {
        role: selectedRoles.join(','),
        joinDate: joinDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      });
      toast.success('Member added successfully');
      fetchMembers();
      onClose();
      setSelectedMember(null); // Reset selected member
      setSelectedRoles([]);
      setJoinDate(new Date());
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add member');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Member
          </DialogTitle>
          <DialogDescription>
            Search and add members to your chapter
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 mb-4"
          />
        </div>
        <ScrollArea className="h-[300px] rounded-md border p-2">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {members.length > 0 ? (
            <div className="space-y-2" onScroll={handleScroll}>
              {members.map((member) => (
                <Card key={member.memberId} className="p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.fullName}</p>
                        <p className="text-sm text-muted-foreground">{member.phoneNumber}</p>
                      </div>
                    </div>
                    {member.isInChapter === 0 && (
                      <Button size="sm" variant="outline" onClick={() => handleAddMember(member)}>
                        Add Member
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Search className="w-8 h-8 mb-2" />
              <p>No members found</p>
            </div>
          )}
        </ScrollArea>

        {/* Dialog for entering role and join date */}
        <Dialog open={selectedMember !== null} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>
                {selectedMember && `Adding ${selectedMember.fullName} to chapter`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Roles</label>
                <MultiSelect
                  options={roles.map(role => ({
                    label: role.roleName,
                    value: role.roleId.toString()
                  }))}
                  onValueChange={setSelectedRoles}
                  defaultValue={selectedRoles}
                  placeholder="Select member roles"
                  maxCount={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Join Date
                </label>
                <DatePicker
                  selected={joinDate}
                  onChange={setJoinDate}
                  className="w-full"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select join date"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedMember(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitMemberDetails}>
                  Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberSearchDialog;
