import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/utils/config';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ClustersPackages = ({ clusters, chapterSlug }) => {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [packages, setPackages] = useState([]);
  const [packageClusters, setPackageClusters] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, [chapterSlug]);

  useEffect(() => {
    if (selectedTerm) {
      fetchPackages();
    }
  }, [selectedTerm]);

  const fetchTerms = async () => {
    try {
      const response = await axiosInstance.get(`/api/term/chapter/${chapterSlug}`);
      setTerms(response.data);
      if (response.data.length > 0) {
        setSelectedTerm(response.data[0].termId);
      }
    } catch (error) {
      toast.error('Failed to fetch terms');
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axiosInstance.get(`/api/packages/admin/all/${chapterSlug}/term/${selectedTerm}`);
      setPackages(response.data);
      
      // Fetch existing package-cluster mappings
      const mappingResponse = await axiosInstance.get(`/api/clusters/package-mappings/${chapterSlug}/term/${selectedTerm}`);
      const existingMappings = mappingResponse.data;
      
      // Initialize package-cluster mapping
      const mapping = {};
      response.data.forEach(pkg => {
        mapping[pkg.packageId] = {};
        clusters.forEach(cluster => {
          mapping[pkg.packageId][cluster.clusterId] = existingMappings.some(
            m => m.packageId === pkg.packageId && m.clusterId === cluster.clusterId && m.isActive
          );
        });
      });
      setPackageClusters(mapping);
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to fetch packages');
    }
  };

  const handleClusterToggle = (packageId, clusterId, isChecked) => {
    setPackageClusters(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [clusterId]: isChecked
      }
    }));
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      const updates = [];
      
      Object.keys(packageClusters).forEach(packageId => {
        Object.keys(packageClusters[packageId]).forEach(clusterId => {
          updates.push({
            packageId,
            clusterId,
            isActive: packageClusters[packageId][clusterId]
          });
        });
      });

      await axiosInstance.put(`/api/clusters/bulk-update-packages/${chapterSlug}`, {
        updates
      });

      toast.success('Package cluster assignments updated successfully');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to update package assignments');
    }
  };

  // Group packages by parent type
  const groupedPackages = packages.reduce((acc, pkg) => {
    const parent = pkg.packageParent || 'Other';
    if (!acc[parent]) {
      acc[parent] = [];
    }
    acc[parent].push(pkg);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a term" />
            </SelectTrigger>
            <SelectContent>
              {terms.map(term => (
                <SelectItem key={term.termId} value={term.termId}>
                  {term.termName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasChanges && (
          <Button onClick={saveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      {selectedTerm && Object.keys(groupedPackages).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedPackages).map(([parentType, packageList]) => (
            <Card key={parentType}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {parentType}
                </CardTitle>
                <CardDescription>
                  Assign packages to clusters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-64">Package</TableHead>
                        <TableHead className="w-32">Amount</TableHead>
                        {clusters.map(cluster => (
                          <TableHead key={cluster.clusterId} className="text-center min-w-32">
                            {cluster.clusterName}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packageList.map(pkg => (
                        <TableRow key={pkg.packageId}>
                          <TableCell className="font-medium">
                            {pkg.packageName}
                          </TableCell>
                          <TableCell>
                            ₹{pkg.packageFeeAmount || 0}
                          </TableCell>
                          {clusters.map(cluster => (
                            <TableCell key={cluster.clusterId} className="text-center">
                              <Checkbox
                                checked={packageClusters[pkg.packageId]?.[cluster.clusterId] || false}
                                onCheckedChange={(checked) => 
                                  handleClusterToggle(pkg.packageId, cluster.clusterId, checked)
                                }
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : selectedTerm ? (
        <div className="text-center py-8 text-gray-500">
          No packages found for the selected term.
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Please select a term to view packages.
        </div>
      )}
    </div>
  );
};

export default ClustersPackages;
