import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/utils/config';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
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

const AdminChaptersClusters = () => {
  const { chapterSlug } = useParams();
  const navigate = useNavigate();
  const [clusters, setClusters] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clusterToDelete, setClusterToDelete] = useState(null);
  const [formData, setFormData] = useState({
    clusterName: '',
    description: ''
  });

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdd = async () => {
    try {
      await axiosInstance.post(`/api/clusters/${chapterSlug}`, formData);
      toast.success('Cluster created successfully');
      setShowAddDialog(false);
      setFormData({ clusterName: '', description: '' });
      fetchClusters();
    } catch (error) {
      toast.error('Failed to create cluster');
    }
  };

  const handleEdit = async () => {
    try {
      await axiosInstance.put(`/api/clusters/${selectedCluster.clusterId}`, formData);
      toast.success('Cluster updated successfully');
      setShowEditDialog(false);
      setSelectedCluster(null);
      setFormData({ clusterName: '', description: '' });
      fetchClusters();
    } catch (error) {
      toast.error('Failed to update cluster');
    }
  };

  const handleDeleteClick = (cluster) => {
    setClusterToDelete(cluster);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!clusterToDelete) return;
    
    try {
      await axiosInstance.delete(`/api/clusters/${clusterToDelete.clusterId}`);
      toast.success('Cluster deleted successfully');
      setShowDeleteDialog(false);
      setClusterToDelete(null);
      fetchClusters();
    } catch (error) {
      toast.error('Failed to delete cluster');
    }
  };

  const openEditDialog = (cluster) => {
    setSelectedCluster(cluster);
    setFormData({
      clusterName: cluster.clusterName,
      description: cluster.description || ''
    });
    setShowEditDialog(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chapter Clusters</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Cluster
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cluster</DialogTitle>
              <DialogDescription>
                Create a new cluster for this chapter.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="clusterName">Cluster Name</Label>
                <Input
                  id="clusterName"
                  name="clusterName"
                  value={formData.clusterName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAdd}>Add Cluster</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster) => (
          <Card key={cluster.clusterId}>
            <CardHeader>
              <CardTitle>{cluster.clusterName}</CardTitle>
              <CardDescription>{cluster.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{cluster.memberCount} Members</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin/chapters/${chapterSlug}/clusters/${cluster.clusterId}`)}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(cluster)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteClick(cluster)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the cluster "{clusterToDelete?.clusterName}". This action cannot be undone.
              {clusterToDelete?.memberCount > 0 && (
                <p className="mt-2 text-red-500">
                  Warning: This cluster has {clusterToDelete.memberCount} members. Deleting it will remove these members from the cluster.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Cluster
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cluster</DialogTitle>
            <DialogDescription>
              Update cluster information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-clusterName">Cluster Name</Label>
              <Input
                id="edit-clusterName"
                name="clusterName"
                value={formData.clusterName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChaptersClusters;