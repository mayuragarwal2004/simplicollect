import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/utils/config';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'react-toastify';

const ClusterPackages = ({ clusterId, onPackagesChange }) => {
  const [termPackages, setTermPackages] = useState({});
  const [isUpdatingPackage, setIsUpdatingPackage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, [clusterId]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/clusters/${clusterId}/packages`);
      
      // Group packages by term
      const packagesData = response.data;
      const groupedPackages = packagesData.reduce((acc, pkg) => {
        const termId = pkg.termId;
        if (!acc[termId]) {
          acc[termId] = {
            termName: pkg.termName,
            packages: []
          };
        }
        acc[termId].packages.push(pkg);
        return acc;
      }, {});
      
      setTermPackages(groupedPackages);
      onPackagesChange?.(response.data);
    } catch (error) {
      toast.error('Failed to fetch cluster packages');
    } finally {
      setLoading(false);
    }
  };

  const togglePackageInCluster = async (packageId, isCurrentlyIncluded) => {
    // Store current scroll position
    const scrollElement = document.querySelector('[data-radix-scroll-area-viewport]');
    const scrollTop = scrollElement?.scrollTop || 0;
    
    try {
      setIsUpdatingPackage(true);
      
      if (isCurrentlyIncluded) {
        await axiosInstance.delete(`/api/clusters/${clusterId}/packages/${packageId}`);
        toast.success('Package removed from cluster');
      } else {
        await axiosInstance.post(`/api/clusters/${clusterId}/packages`, { packageId });
        toast.success('Package added to cluster');
      }
      
      await fetchPackages();
      
      // Restore scroll position after state update
      setTimeout(() => {
        if (scrollElement) {
          scrollElement.scrollTop = scrollTop;
        }
        setIsUpdatingPackage(false);
      }, 0);
      
    } catch (error) {
      setIsUpdatingPackage(false);
      toast.error('Failed to update package assignment');
    }
  };

  if (loading) {
    return <div>Loading packages...</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(termPackages).map(([termId, term]) => (
        <Card key={termId}>
          <CardHeader>
            <CardTitle>{term.termName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {term.packages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No packages available in this term
                      </TableCell>
                    </TableRow>
                  ) : (
                    term.packages.map((pkg) => (
                      <TableRow key={pkg.packageId}>
                        <TableCell>{pkg.packageName}</TableCell>
                        <TableCell>{pkg.packageFeeAmount}</TableCell>
                        <TableCell>
                          <Button
                            variant={pkg.isIncluded ? "default" : "outline"}
                            size="sm"
                            disabled={isUpdatingPackage}
                            onClick={() => togglePackageInCluster(pkg.packageId, pkg.isIncluded)}
                          >
                            {pkg.isIncluded ? 'Remove Access' : 'Grant Access'}
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
      ))}
    </div>
  );
};

export default ClusterPackages;
