import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FeeReceiver = () => {
  const [cashReceivers, setCashReceivers] = useState([]);
  const [qrReceivers, setQrReceivers] = useState([]);
  const { chapterData } = useData();
  // const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [membersList, setMembersList] = useState([]);
  const [recieverFormData, setRecieverFormData] = useState({
    cashRecieverName: '',
    memberId: '',
    chapterId: chapterData.chapterId,
    enableDate: '',
    disableDate: '',
  });
  const [qrRecieverFormData, setQrRecieverFormData] = useState({
    memberId: '',
    chapterId: chapterData.chapterId,
    imageFile: null,
    qrCodeName: '',
    enableDate: '',
    disableDate: '',
  });
  const [amountCollected, setAmountCollected] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  useEffect(() => {
    fetchCashReceivers();
    fetchOnlineReceivers();
    fetchMembersList();
    getAmountCollected();
  }, []);

  const fetchMembersList = async () => {
    const response = await axiosInstance.get('/api/member/all', {
      params: {
        chapterId: chapterData.chapterId,
      },
    });
    setMembersList(response.data);
  };

  const fetchCashReceivers = async () => {
    const response = await axiosInstance.get(
      `/api/feeReciever/cash/${chapterData.chapterId}`,
    );
    setCashReceivers(response.data);
  };

  const fetchOnlineReceivers = async () => {
    const response = await axiosInstance.get(
      `/api/feeReciever/qr/${chapterData.chapterId}`,
    );
    setQrReceivers(response.data);
  };

  const getAmountCollected = async () => {
    const response = await axiosInstance.get(
      `/api/feeReciever/amountCollected/${chapterData.chapterId}`,
    );
    setAmountCollected(response.data);
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleQRSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image', qrRecieverFormData.imageFile);
      formData.append('folderName', 'memberQRCodes');

      const response = await axiosInstance.post('/api/image-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageLink = response.data.imageUrl;

      await axiosInstance.post(`/api/feeReciever/qr/${chapterData.chapterId}`, {
        ...qrRecieverFormData,
        qrImageLink: imageLink,
        imageFile: undefined,
      });
      fetchOnlineReceivers();
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRecieverFormData({
      cashRecieverName: '',
      memberId: '',
      chapterId: chapterData.chapterId,
      enableDate: '',
      disableDate: '',
    });
    setQrRecieverFormData({
      memberId: '',
      chapterId: chapterData.chapterId,
      imageFile: null,
      qrCodeName: '',
      enableDate: '',
      disableDate: '',
    });
    setEditData(null);
    setIsEditMode(false);
  };

  const handleCashRecieverSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Is Edit Mode:', isEditMode);
    console.log('Edit Data:', editData);
    console.log('Form Data:', recieverFormData);

    try {
      const selectedMember = membersList.find(m => m.memberId === recieverFormData.memberId);
      console.log('Selected Member:', selectedMember);
      
      const payload = {
        receiverName: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : editData?.receiverName,
        memberId: recieverFormData.memberId || editData?.memberId,
        chapterId: chapterData.chapterId,
        enableDate: recieverFormData.enableDate,
        disableDate: recieverFormData.disableDate,
      };
      console.log('Payload:', payload);

      if (isEditMode && editData) {
        console.log('Updating receiver with ID:', editData.cashRecieverId);
        await axiosInstance.put(
          `/api/feeReciever/cash/${editData.cashRecieverId}`,
          payload
        );
      } else {
        console.log('Creating new receiver');
        await axiosInstance.post("/api/feeReciever/cash", payload);
      }

      await fetchCashReceivers();
      handleModalClose();
    } catch (error) {
      console.error('Error submitting cash receiver:', error);
    }
  };
  

  const handleDelete = async (id, type) => {
    try {
      if (type === 'cash') {
        await axiosInstance.delete(`/api/feeReciever/cash/${id}`);
        fetchCashReceivers();
      } else {
        await axiosInstance.delete(`/api/feeReciever/qr/${id}`);
        fetchOnlineReceivers();
      }
      setDeleteInfo(null);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleCashEdit = (receiver) => {
    setModalType("cash");
    setEditData(receiver);
    setIsEditMode(true);
    setIsModalOpen(true);

    setRecieverFormData({
      cashRecieverName: receiver.receiverName,
      memberId: receiver.memberId,
      chapterId: chapterData.chapterId,
      enableDate: receiver.enableDate?.split("T")[0] || '',
      disableDate: receiver.disableDate?.split("T")[0] || '',
    });
  };

  const handleQREdit = (receiver) => {
    setModalType("qr");
    setEditData(receiver);
    setIsEditMode(true);
    setIsModalOpen(true);

    setQrRecieverFormData({
      memberId: receiver.memberId,
      chapterId: receiver.chapterId,
      qrCodeName: receiver.receiverName,
      imageFile: null,
      enableDate: receiver.enableDate?.split("T")[0],
      disableDate: receiver.disableDate?.split("T")[0],
    });
  };

  return (
    <>
      <Breadcrumb pageName="Fee Receiver List" />
      <div className="rounded-sm border bg-white p-5 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium dark:text-white">
            Pending Fee Approvals
          </h2>
          {/* <IconButton aria-label="refresh" onClick={fetchPendingFees}>
                    <RefreshIcon className="dark:text-white" />
                </IconButton> */}
        </div>
        <div className="mb-4 flex flex-wrap gap-4">
          <Button color="primary" onClick={() => handleAddNew('cash')}>
            Add New Cash Receiver
          </Button>
          <Button color="primary" onClick={() => handleAddNew('qr')}>
            Add New QR Receiver
          </Button>
        </div>

        <h2 className="text-lg font-medium mb-4">Cash Receivers</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Receiver Name</TableHead>
              <TableHead className="text-white">Enable Date</TableHead>
              <TableHead className="text-white">Disable Date</TableHead>
              <TableHead className="text-white">Amount Collected</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashReceivers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-black dark:text-white"
                >
                  No cash receivers found.
                </TableCell>
              </TableRow>
            ) : (
              cashReceivers.map((receiver) => (
                <TableRow
                  key={receiver.cashRecieverId}
                  className="border-b border-gray-300 dark:border-strokedark"
                >
                  <TableCell className="py-3 px-4 text-black dark:text-white">
                    {receiver.receiverName}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-black dark:text-white">
                    {new Date(receiver.enableDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-black dark:text-white">
                    {new Date(receiver.disableDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-black dark:text-white">
                    {amountCollected.find(
                      (amount) => amount.receiverId === receiver.memberId,
                    )?.totalAmountCollected || 0}
                  </TableCell>
                  <TableCell className="py-3 px-4 space-x-2">
                    <Button 
                      variant="outline" 
                      className="text-gray-800 hover:text-black"
                      onClick={() => handleCashEdit(receiver)}
                    >
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the cash receiver.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => handleDelete(receiver.cashRecieverId, 'cash')}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <h2 className="text-lg font-medium mt-8 mb-4">QR Code Receivers</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">QR Name</TableHead>
              <TableHead className="text-white">QR Code Image</TableHead>
              <TableHead className="text-white">Enable Date</TableHead>
              <TableHead className="text-white">Disable Date</TableHead>
              <TableHead className="text-white">Amount Collected</TableHead>
              <TableHead className="text-white">Receiver Amount</TableHead>
              <TableHead className="text-white">Receiver Amount Type</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qrReceivers.map((receiver) => (
              <TableRow key={receiver.qrCodeId}>
                <TableCell>{receiver.receiverName}</TableCell>
                <TableCell>
                  <img
                    src={receiver.qrImageLink}
                    alt="QR Code"
                    className="w-16 h-16"
                  />
                </TableCell>
                <TableCell>
                  {new Date(receiver.enableDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(receiver.disableDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-3 px-4 text-black dark:text-white">
                  {amountCollected.find(
                    (amount) => amount.receiverId === receiver.memberId,
                  )?.totalAmountCollected || 0}
                </TableCell>
                <TableCell className="py-3 px-4 text-black dark:text-white">
                  {receiver.receiverAmount}
                </TableCell>
                <TableCell className="py-3 px-4 text-black dark:text-white">
                  {receiver.receiverAmountType}
                </TableCell>
                <TableCell className="py-3 px-4 space-x-2">
                  <Button 
                    variant="outline" 
                    className="text-gray-800 hover:text-black"
                    onClick={() => handleQREdit(receiver)}
                  >
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the QR receiver.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 text-white hover:bg-red-600"
                          onClick={() => handleDelete(receiver.qrCodeId, 'qr')}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AlertDialog
          open={!!deleteInfo}
          onOpenChange={() => setDeleteInfo(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this{' '}
                {deleteInfo?.type === 'cash' ? 'Cash' : 'QR'} Receiver?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteInfo(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(deleteInfo.id, deleteInfo.type)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit' : 'Add New'} {modalType === 'cash' ? 'Cash' : 'QR'} Receiver
              </DialogTitle>
            </DialogHeader>
            
            {modalType === 'cash' ? (
              // Cash Receiver Form
              <form onSubmit={handleCashRecieverSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="member">Receiver Name</Label>
                    <Select
                      value={recieverFormData.memberId}
                      onValueChange={(value) =>
                        setRecieverFormData((prev) => ({
                          ...prev,
                          memberId: value,
                          cashRecieverName: membersList.find(m => m.memberId === value)?.firstName + ' ' + 
                                          membersList.find(m => m.memberId === value)?.lastName
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isEditMode ? editData?.receiverName : "Select a member"} />
                      </SelectTrigger>
                      <SelectContent>
                        {membersList.map((member) => (
                          <SelectItem 
                            key={member.memberId} 
                            value={member.memberId}
                          >
                            {member.firstName} {member.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="enableDate">Enable Date</Label>
                    <Input
                      id="enableDate"
                      type="date"
                      value={recieverFormData.enableDate}
                      onChange={(e) =>
                        setRecieverFormData((prev) => ({
                          ...prev,
                          enableDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="disableDate">Disable Date</Label>
                    <Input
                      id="disableDate"
                      type="date"
                      value={recieverFormData.disableDate}
                      onChange={(e) =>
                        setRecieverFormData((prev) => ({
                          ...prev,
                          disableDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gray-800 text-white hover:bg-black">
                    {isEditMode ? 'Update' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              // QR Receiver Form
              <form onSubmit={handleQRSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="member">Member Name</Label>
                    <Select
                      value={qrRecieverFormData.memberId}
                      onValueChange={(value) =>
                        setQrRecieverFormData((prev) => ({
                          ...prev,
                          memberId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isEditMode ? editData?.receiverName : "Select a member"} />
                      </SelectTrigger>
                      <SelectContent>
                        {membersList.map((member) => (
                          <SelectItem 
                            key={member.memberId} 
                            value={member.memberId}
                          >
                            {member.firstName} {member.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="qrName">QR Name</Label>
                    <Input
                      id="qrName"
                      type="text"
                      value={qrRecieverFormData.qrCodeName}
                      onChange={(e) =>
                        setQrRecieverFormData((prev) => ({
                          ...prev,
                          qrCodeName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="qrImage">QR Code Image</Label>
                    <Input
                      id="qrImage"
                      type="file"
                      onChange={(e) =>
                        setQrRecieverFormData((prev) => ({
                          ...prev,
                          imageFile: e.target.files[0],
                        }))
                      }
                      required={!isEditMode}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="enableDate">Enable Date</Label>
                    <Input
                      id="enableDate"
                      type="date"
                      value={qrRecieverFormData.enableDate}
                      onChange={(e) =>
                        setQrRecieverFormData((prev) => ({
                          ...prev,
                          enableDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="disableDate">Disable Date</Label>
                    <Input
                      id="disableDate"
                      type="date"
                      value={qrRecieverFormData.disableDate}
                      onChange={(e) =>
                        setQrRecieverFormData((prev) => ({
                          ...prev,
                          disableDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gray-800 text-white hover:bg-black">
                    {isEditMode ? 'Update' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default FeeReceiver;
