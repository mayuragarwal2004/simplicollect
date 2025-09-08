import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/utils/config';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Save } from 'lucide-react';
import { toast } from 'react-toastify';
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

  useEffect(() => {
    fetchMembers();
  }, [chapterSlug]);

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get(`/api/member/search/chapter/${chapterSlug}?query=${searchTerm}&includeWithoutCluster=true`);
      setMembers(response.data);
      
      // Initialize member-cluster mapping
      const mapping = {};
      response.data.forEach(member => {
        mapping[member.memberId] = {};
        clusters.forEach(cluster => {
          mapping[member.memberId][cluster.clusterId] = member.clusterId === cluster.clusterId;
        });
      });
      setMemberClusters(mapping);
    } catch (error) {
      toast.error('Failed to fetch members');
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

  const saveChanges = async () => {
    try {
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
    }
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );

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
          <Button onClick={saveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
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
                  {cluster.clusterName}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map(member => (
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
                      checked={memberClusters[member.memberId]?.[cluster.clusterId] || false}
                      onCheckedChange={(checked) => 
                        handleClusterToggle(member.memberId, cluster.clusterId, checked)
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No members found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

export default ClustersMembers;
