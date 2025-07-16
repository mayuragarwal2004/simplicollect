import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { toast } from 'react-toastify';
import { Plus, CreditCard, QrCode, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ReceiverForm from '../../components/FeeReceiver/ReceiverForm';
import ReceiverTable from '../../components/FeeReceiver/ReceiverTable';
import { useFeeReceiverApi } from '../../hooks/useFeeReceiverApi';
import { axiosInstance } from '../../utils/config';

const FeeReceiver = () => {
  const { chapterData } = useData();
  const [activeTab, setActiveTab] = useState('cash');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [cashReceivers, setCashReceivers] = useState([]);
  const [qrReceivers, setQrReceivers] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [amountCollected, setAmountCollected] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, receiverId: null, paymentType: null });

  // Unified form data state
  const [formData, setFormData] = useState({
    receiverName: '',
    memberId: '',
    enableDate: '',
    disableDate: '',
    paymentType: 'cash',
    imageFile: null,
    qrImageLink: '',
    receiverAmountType: '',
    receiverAmount: '',
  });

  const {
    loading,
    fetchReceiversByType,
    addReceiver,
    updateReceiver,
    deleteReceiver,
    fetchAmountCollected,
  } = useFeeReceiverApi(chapterData.chapterId);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    await Promise.all([
      fetchMembers(),
      fetchCashReceivers(),
      fetchOnlineReceivers(),
      getAmountCollected(),
    ]);
  };

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get('/api/member/all', {
        params: { chapterId: chapterData.chapterId },
      });
      setMembersList(response.data);
    } catch (error) {
      toast.error('Failed to fetch members list');
    }
  };

  const fetchCashReceivers = async () => {
    try {
      const receivers = await fetchReceiversByType('cash');
      setCashReceivers(receivers);
    } catch (error) {
      console.error('Error fetching cash receivers:', error);
    }
  };

  const fetchOnlineReceivers = async () => {
    try {
      const receivers = await fetchReceiversByType('online');
      setQrReceivers(receivers);
    } catch (error) {
      console.error('Error fetching online receivers:', error);
    }
  };

  const getAmountCollected = async () => {
    try {
      const amounts = await fetchAmountCollected();
      setAmountCollected(amounts);
    } catch (error) {
      console.error('Error fetching amount collected:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      receiverName: '',
      memberId: '',
      enableDate: '',
      disableDate: '',
      paymentType: 'cash',
      imageFile: null,
      qrImageLink: '',
      receiverAmountType: '',
      receiverAmount: '',
    });
    setEditData(null);
    setIsEditMode(false);
  };

  const handleAddNew = (type) => {
    resetForm();
    setFormData(prev => ({ ...prev, paymentType: type }));
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.memberId) {
      toast.error('Please select a member');
      return;
    }
    if (!formData.receiverName) {
      toast.error('Please enter a receiver name');
      return;
    }
    if (!formData.enableDate || !formData.disableDate) {
      toast.error('Please select enable and disable dates');
      return;
    }
    if (formData.paymentType === 'online' && !isEditMode && !formData.imageFile) {
      toast.error('Please select a QR code image');
      return;
    }

    try {
      const receiverData = {
        receiverName: formData.receiverName,
        memberId: formData.memberId,
        enableDate: formData.enableDate,
        disableDate: formData.disableDate,
        paymentType: formData.paymentType,
        ...(formData.paymentType === 'online' && {
          receiverAmountType: formData.receiverAmountType,
          receiverAmount: formData.receiverAmount,
          qrImageLink: editData?.qrImageLink || '', // Keep existing image for edits
        }),
      };

      if (isEditMode && editData) {
        await updateReceiver(editData.receiverId, receiverData, formData.imageFile);
      } else {
        await addReceiver(receiverData, formData.imageFile);
      }

      // Refresh data
      if (formData.paymentType === 'cash') {
        await fetchCashReceivers();
      } else {
        await fetchOnlineReceivers();
      }
      await getAmountCollected();

      handleModalClose();
    } catch (error) {
      console.error('Error saving receiver:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (receiver) => {
    setEditData(receiver);
    setIsEditMode(true);
    setFormData({
      receiverName: receiver.receiverName,
      memberId: receiver.memberId,
      enableDate: receiver.enableDate,
      disableDate: receiver.disableDate,
      paymentType: receiver.paymentType,
      imageFile: null,
      qrImageLink: receiver.qrImageLink || '',
      receiverAmountType: receiver.receiverAmountType || '',
      receiverAmount: receiver.receiverAmount || '',
    });
    setModalType(receiver.paymentType);
    setIsModalOpen(true);
  };

  const handleDelete = async (receiverId, paymentType) => {
    setDeleteDialog({ open: true, receiverId, paymentType });
  };

  const confirmDelete = async () => {
    const { receiverId, paymentType } = deleteDialog;
    
    try {
      await deleteReceiver(receiverId, paymentType);
      
      // Refresh data
      if (paymentType === 'cash') {
        await fetchCashReceivers();
      } else {
        await fetchOnlineReceivers();
      }
      await getAmountCollected();
    } catch (error) {
      console.error('Error deleting receiver:', error);
    } finally {
      setDeleteDialog({ open: false, receiverId: null, paymentType: null });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Fee Receivers Management
          </CardTitle>
          <CardDescription>
            Manage cash and online payment receivers for your chapter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cash" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Cash Receivers
                <Badge variant="secondary" className="ml-1">
                  {cashReceivers.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="online" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Receivers
                <Badge variant="secondary" className="ml-1">
                  {qrReceivers.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cash" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Cash Receivers</h3>
                  <p className="text-sm text-muted-foreground">
                    Members who collect cash payments
                  </p>
                </div>
                <Button 
                  onClick={() => handleAddNew('cash')}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add Cash Receiver
                </Button>
              </div>
              
              {loading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Loading receivers...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ReceiverTable
                  receivers={cashReceivers}
                  receiverType="cash"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  amountCollected={amountCollected}
                />
              )}
            </TabsContent>

            <TabsContent value="online" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">QR Code Receivers</h3>
                  <p className="text-sm text-muted-foreground">
                    Members who collect online payments via QR codes
                  </p>
                </div>
                <Button 
                  onClick={() => handleAddNew('online')}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add QR Receiver
                </Button>
              </div>
              
              {loading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Loading receivers...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ReceiverTable
                  receivers={qrReceivers}
                  receiverType="online"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  amountCollected={amountCollected}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalType === 'cash' ? (
                <CreditCard className="h-5 w-5" />
              ) : (
                <QrCode className="h-5 w-5" />
              )}
              {isEditMode ? 'Edit' : 'Add'} {modalType === 'cash' ? 'Cash' : 'QR'} Receiver
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the' : 'Add a new'} {modalType === 'cash' ? 'cash' : 'QR code'} receiver for your chapter.
            </DialogDescription>
          </DialogHeader>
          <ReceiverForm
            formData={formData}
            setFormData={setFormData}
            membersList={membersList}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            isEditMode={isEditMode}
            receiverType={modalType}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, receiverId: null, paymentType: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteDialog.paymentType} receiver and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FeeReceiver;
