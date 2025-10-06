import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/utils/config';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Save, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ClustersMembers = ({ clusters, chapterSlug }) => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberClusters, setMemberClusters] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [chapterSlug]);

  useEffect(() => {
    // Re-initialize memberClusters when clusters change
    if (members.length > 0 && clusters.length > 0) {
      const mapping = {};
      members.forEach(member => {
        mapping[member.memberId] = {};
        clusters.forEach(cluster => {
          // Ensure both values are strings for comparison
          const memberClusterId = member.clusterId ? String(member.clusterId) : null;
          const clusterIdToCompare = String(cluster.clusterId);
          mapping[member.memberId][cluster.clusterId] = memberClusterId === clusterIdToCompare;
        });
      });
      setMemberClusters(mapping);
    }
  }, [clusters, members]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/member/search/chapter/${chapterSlug}?query=${searchTerm}&includeWithoutCluster=true`);
      setMembers(response.data);
      
      // Initialize member-cluster mapping
      const mapping = {};
      response.data.forEach(member => {
        mapping[member.memberId] = {};
        clusters.forEach(cluster => {
          // Ensure both values are strings for comparison
          const memberClusterId = member.clusterId ? String(member.clusterId) : null;
          const clusterIdToCompare = String(cluster.clusterId);
          mapping[member.memberId][cluster.clusterId] = memberClusterId === clusterIdToCompare;
        });
      });
      setMemberClusters(mapping);
      setHasChanges(false); // Reset changes flag when fetching fresh data
    } catch (error) {
      toast.error('Failed to fetch members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMembers();
  };

  const handleClusterToggle = (memberId, clusterId, isChecked) => {
    setMemberClusters(prev => {
      const updated = { ...prev };
      
      // If checking a cluster, uncheck all others (one cluster per member)
      if (isChecked) {
        Object.keys(updated[memberId]).forEach(cId => {
          updated[memberId][cId] = cId === clusterId;
        });
      } else {
        // If unchecking, just uncheck this cluster
        updated[memberId][clusterId] = false;
      }
      
      setHasChanges(true);
      return updated;
    });
  };

  const handleSelectAllForCluster = (clusterId) => {
    setMemberClusters(prev => {
      const updated = { ...prev };
      
      // Assign all filtered members to this cluster
      filteredMembers.forEach(member => {
        if (updated[member.memberId]) {
          // Uncheck all other clusters for this member
          Object.keys(updated[member.memberId]).forEach(cId => {
            updated[member.memberId][cId] = cId === clusterId;
          });
        }
      });
      
      setHasChanges(true);
      return updated;
    });
  };

  const handleClearAllForCluster = (clusterId) => {
    setMemberClusters(prev => {
      const updated = { ...prev };
      
      // Remove all filtered members from this cluster
      filteredMembers.forEach(member => {
        if (updated[member.memberId]) {
          updated[member.memberId][clusterId] = false;
        }
      });
      
      setHasChanges(true);
      return updated;
    });
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      const updates = [];
      
      Object.keys(memberClusters).forEach(memberId => {
        const selectedCluster = Object.keys(memberClusters[memberId]).find(
          clusterId => memberClusters[memberId][clusterId]
        );
        
        const originalMember = members.find(m => m.memberId === memberId);
        if (originalMember && originalMember.clusterId !== selectedCluster) {
          updates.push({
            memberId,
            clusterId: selectedCluster || null
          });
        }
      });

      if (updates.length === 0) {
        toast.info('No changes to save');
        return;
      }

      await axiosInstance.put(`/api/clusters/bulk-update-members/${chapterSlug}`, {
        updates
      });

      toast.success('Member cluster assignments updated successfully');
      setHasChanges(false);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to update member assignments');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );

  const getClusterMemberCount = (clusterId) => {
    return filteredMembers.filter(member => 
      memberClusters[member.memberId]?.[clusterId]
    ).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search members by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} variant="outline">
          Search
        </Button>
        {hasChanges && (
          <Button onClick={saveChanges} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Member</TableHead>
              <TableHead className="w-32">Phone</TableHead>
              {clusters.map(cluster => (
                <TableHead key={cluster.clusterId} className="text-center min-w-32">
                  <div className="space-y-2 flex flex-col items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="font-medium p-0 h-auto hover:bg-gray-100 flex items-center gap-1"
                        >
                          {cluster.clusterName}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center">
                        <DropdownMenuItem 
                          onClick={() => handleSelectAllForCluster(cluster.clusterId)}
                          className="cursor-pointer"
                        >
                          Select All
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleClearAllForCluster(cluster.clusterId)}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          Unselect All
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="text-xs text-gray-300">
                      ({getClusterMemberCount(cluster.clusterId)} members)
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={clusters.length + 2} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span>Loading members...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <TableRow key={member.memberId}>
                  <TableCell className="font-medium">
                    {member.name}
                  </TableCell>
                  <TableCell>
                    {member.phone}
                  </TableCell>
                  {clusters.map(cluster => (
                    <TableCell key={cluster.clusterId} className="text-center">
                      <Checkbox
                        checked={Boolean(memberClusters[member.memberId]?.[cluster.clusterId])}
                        onCheckedChange={(checked) => 
                          handleClusterToggle(member.memberId, cluster.clusterId, checked)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={clusters.length + 2} className="text-center py-8 text-gray-500">
                  No members found. Try adjusting your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClustersMembers;
