import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '@/utils/config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import ClustersMembers from './ClustersMembers';
import ClustersPackages from './ClustersPackages';

const ClustersManagement = () => {
  const { chapterSlug } = useParams();
  const [clusters, setClusters] = useState([]);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    fetchClusters();
  }, [chapterSlug]);

  const fetchClusters = async () => {
    try {
      const response = await axiosInstance.get(`/api/clusters/${chapterSlug}`);
      setClusters(response.data);
    } catch (error) {
      toast.error('Failed to fetch clusters');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Clusters</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cluster Management</CardTitle>
          <CardDescription>
            Manage member assignments and package assignments across all clusters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Packages
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="mt-6">
              <ClustersMembers clusters={clusters} chapterSlug={chapterSlug} />
            </TabsContent>
            
            <TabsContent value="packages" className="mt-6">
              <ClustersPackages clusters={clusters} chapterSlug={chapterSlug} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClustersManagement;
