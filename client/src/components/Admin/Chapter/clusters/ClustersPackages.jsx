import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/utils/config';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Package, ChevronDown } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const handleSelectAllForCluster = (clusterId) => {
    setPackageClusters(prev => {
      const updated = { ...prev };
      
      // Assign all packages to this cluster
      packages.forEach(pkg => {
        if (updated[pkg.packageId]) {
          updated[pkg.packageId][clusterId] = true;
        }
      });
      
      setHasChanges(true);
      return updated;
    });
  };

  const handleClearAllForCluster = (clusterId) => {
    setPackageClusters(prev => {
      const updated = { ...prev };
      
      // Remove all packages from this cluster
      packages.forEach(pkg => {
        if (updated[pkg.packageId]) {
          updated[pkg.packageId][clusterId] = false;
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
    } finally {
      setIsSaving(false);
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

  const getClusterPackageCount = (clusterId) => {
    return packages.filter(pkg => 
      packageClusters[pkg.packageId]?.[clusterId]
    ).length;
  };

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
          <Button onClick={saveChanges} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
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
                              <div className="text-xs text-gray-400">
                                ({getClusterPackageCount(cluster.clusterId)} packages)
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
                              <span>Loading packages...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : packageList.length > 0 ? (
                        packageList.map(pkg => (
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
                                  checked={Boolean(packageClusters[pkg.packageId]?.[cluster.clusterId])}
                                  onCheckedChange={(checked) => 
                                    handleClusterToggle(pkg.packageId, cluster.clusterId, checked)
                                  }
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={clusters.length + 2} className="text-center py-8 text-gray-500">
                            No packages found in this category.
                          </TableCell>
                        </TableRow>
                      )}
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
