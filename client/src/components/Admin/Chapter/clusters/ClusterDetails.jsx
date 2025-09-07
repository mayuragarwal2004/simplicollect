import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '@/utils/config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'react-toastify';
import { Users, Package } from 'lucide-react';
import ClusterMembers from './ClusterMembers';
import ClusterPackages from './ClusterPackages';

const ClusterDetails = () => {
  const { chapterSlug, clusterId } = useParams();
  const [clusterInfo, setClusterInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("members");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClusterInfo();
  }, [clusterId]);

  const fetchClusterInfo = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/clusters/${clusterId}`);
      setClusterInfo(response.data);
    } catch (error) {
      toast.error('Failed to fetch cluster details');
    } finally {
      setLoading(false);
    }
  };

  const handleMembersChange = (members) => {
    // Optional: Handle members change if needed
    console.log('Members updated:', members.length);
  };

  const handlePackagesChange = (packages) => {
    // Optional: Handle packages change if needed
    console.log('Packages updated:', packages.length);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{clusterInfo?.clusterName}</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <ClusterMembers 
            clusterId={clusterId} 
            onMembersChange={handleMembersChange} 
          />
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <ClusterPackages 
            clusterId={clusterId} 
            onPackagesChange={handlePackagesChange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClusterDetails;
