import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/utils/config';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'react-toastify';
import { Search, Plus, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ClusterMembers = ({ clusterId, onMembersChange }) => {
  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberToAdd, setMemberToAdd] = useState(null);
  const [showMoveConfirmDialog, setShowMoveConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [clusterId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/clusters/${clusterId}/members`);
      setMembers(response.data);
      onMembersChange?.(response.data);
    } catch (error) {
      toast.error('Failed to fetch cluster members');
    } finally {
      setLoading(false);
    }
  };

  const searchMembers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/clusters/${clusterId}/search-members`, {
        params: {
          search: query
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error.response?.data || error.message);
      toast.error('Failed to search members');
    }
  };

  const handleAddClick = (member) => {
    if (member.isInOtherCluster) {
      setMemberToAdd(member);
      setShowMoveConfirmDialog(true);
    } else {
      addMemberToCluster(member.memberId);
    }
  };

  const addMemberToCluster = async (memberId) => {
    try {
      await axiosInstance.post(`/api/clusters/${clusterId}/members`, { memberId });
      toast.success('Member added to cluster');
      setSearchQuery('');
      setSearchResults([]);
      setMemberToAdd(null);
      setShowMoveConfirmDialog(false);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to add member to cluster');
    }
  };

  const removeMemberFromCluster = async (memberId) => {
    try {
      await axiosInstance.delete(`/api/clusters/${clusterId}/members/${memberId}`);
      toast.success('Member removed from cluster');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to remove member from cluster');
    }
  };

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchMembers(e.target.value);
                }}
                className="pl-8"
              />
            </div>
          </div>
          {searchResults.length > 0 && (
            <Card className="mt-4">
              <ScrollArea className="h-[200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((member) => (
                      <TableRow key={member.memberId}>
                        <TableCell>
                          {`${member.firstName} ${member.lastName || ''}`.trim()}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phoneNumber}</TableCell>
                        <TableCell className="text-right">
                          {member.isInCluster ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="text-muted-foreground"
                            >
                              Already in cluster
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAddClick(member)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to cluster
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No members in this cluster yet
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.memberId}>
                      <TableCell>{`${member.firstName} ${member.lastName || ''}`.trim()}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phoneNumber}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMemberFromCluster(member.memberId)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove member</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showMoveConfirmDialog} onOpenChange={setShowMoveConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move Member to This Cluster?</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToAdd && (
                <>
                  This member is currently in cluster "{memberToAdd.clusterName}".
                  Moving them will remove them from their current cluster.
                  Are you sure you want to proceed?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => memberToAdd && addMemberToCluster(memberToAdd.memberId)}>
              Yes, Move Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClusterMembers;
