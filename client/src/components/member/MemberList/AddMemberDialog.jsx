import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../utils/config';

export default function AddMemberDialog({ open, onOpenChange, chapterId, refresh }) {
  const [mode, setMode] = useState('search'); // 'search' or 'addNew'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedJoinDate, setSelectedJoinDate] = useState('');
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    chapterId: chapterId,
    joinDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setMode('search');
      setSearchQuery('');
      setSearchResults([]);
      setSelectedMember(null);
      setSelectedJoinDate('');
      setNewMember({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        chapterId: chapterId,
        joinDate: '',
      });
    }
  }, [open, chapterId]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/member/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExisting = async () => {
    if (!selectedMember || !selectedJoinDate) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/member/add', [
        {
          memberId: selectedMember.memberId,
          chapterId,
          joinDate: selectedJoinDate,
          email: selectedMember.email || null,
          phoneNumber: selectedMember.phoneNumber || null,
        },
      ]);
      if (res.data?.results?.[0]?.error) {
        toast.error(res.data.results[0].error);
      } else {
        toast.success('Member added to chapter');
        onOpenChange(false);
        refresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error adding member');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/member/add', [
        {
          ...newMember,
          chapterId,
          joinDate: newMember.joinDate || new Date().toISOString().slice(0, 10),
          password: null, // always null
        },
      ]);
      if (res.data?.results?.[0]?.error) {
        toast.error(res.data.results[0].error);
      } else {
        toast.success('New member invited and added');
        onOpenChange(false);
        refresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error inviting member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Button variant={mode === 'search' ? 'default' : 'outline'} onClick={() => setMode('search')}>Search Existing</Button>
          <Button variant={mode === 'addNew' ? 'default' : 'outline'} onClick={() => setMode('addNew')}>Invite New</Button>
        </div>
        {mode === 'search' ? (
          <div>
            <Input
              placeholder="Search by email, phone, or name"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="mb-2"
            />
            <Button onClick={handleSearch} disabled={loading || !searchQuery} className="mb-2">{loading ? 'Searching...' : 'Search'}</Button>
            <div className="max-h-48 overflow-y-auto">
              {searchResults.length === 0 && searchQuery && !loading && <div className="text-gray-500">No members found.</div>}
              {searchResults.map(member => (
                <div
                  key={member.memberId}
                  className={`p-2 border rounded mb-2 cursor-pointer ${selectedMember?.memberId === member.memberId ? 'bg-blue-100' : ''}`}
                  onClick={() => {
                    setSelectedMember(member);
                    setSelectedJoinDate('');
                  }}
                >
                  <div><b>{member.firstName} {member.lastName}</b> ({member.email || member.phoneNumber})</div>
                </div>
              ))}
            </div>
            {selectedMember && (
              <div className="mt-2">
                <Input
                  type="date"
                  placeholder="Join Date"
                  value={selectedJoinDate}
                  onChange={e => setSelectedJoinDate(e.target.value)}
                />
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleAddExisting} disabled={!selectedMember || !selectedJoinDate || loading} className="w-full mt-2">
                {loading ? 'Adding...' : 'Add to Chapter'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="First Name*"
              value={newMember.firstName}
              onChange={e => setNewMember({ ...newMember, firstName: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={newMember.lastName}
              onChange={e => setNewMember({ ...newMember, lastName: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={newMember.email}
              onChange={e => setNewMember({ ...newMember, email: e.target.value })}
            />
            <Input
              placeholder="Phone Number"
              value={newMember.phoneNumber}
              onChange={e => setNewMember({ ...newMember, phoneNumber: e.target.value })}
            />
            <Input
              placeholder="Join Date"
              type="date"
              value={newMember.joinDate}
              onChange={e => setNewMember({ ...newMember, joinDate: e.target.value })}
            />
            <DialogFooter>
              <Button onClick={handleAddNew} className="w-full" disabled={loading}>
                {loading ? 'Inviting...' : 'Invite & Add'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
