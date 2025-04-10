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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeeReceiver = () => {
  const { chapterData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [cashReceivers, setCashReceivers] = useState([]);
  const [qrReceivers, setQrReceivers] = useState([]);
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
    try {
      const response = await axiosInstance.get('/api/member/all', {
        params: {
          chapterId: chapterData.chapterId,
        },
      });
      setMembersList(response.data);
    } catch (error) {
      toast.error('Failed to fetch members list');
    }
  };

  const fetchCashReceivers = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/feeReciever/cash/${chapterData.chapterId}`,
      );
      setCashReceivers(response.data);
    } catch (error) {
      toast.error('Failed to fetch cash receivers');
    }
  };

  const fetchOnlineReceivers = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/feeReciever/qr/${chapterData.chapterId}`,
      );
      setQrReceivers(response.data);
    } catch (error) {
      toast.error('Failed to fetch QR receivers');
    }
  };

  const getAmountCollected = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/feeReciever/amountCollected/${chapterData.chapterId}`,
      );
      setAmountCollected(response.data);
    } catch (error) {
      toast.error('Failed to fetch amount collected');
    }
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleQRSubmit = async (e) => {
    e.preventDefault();

    // Add validation
    if (!qrRecieverFormData.memberId) {
      toast.error('Please select a member');
      return;
    }
    if (!qrRecieverFormData.qrCodeName) {
      toast.error('Please enter a QR code name');
      return;
    }
    if (!qrRecieverFormData.enableDate) {
      toast.error('Please select an enable date');
      return;
    }
    if (!qrRecieverFormData.disableDate) {
      toast.error('Please select a disable date');
      return;
    }
    if (!isEditMode && !qrRecieverFormData.imageFile) {
      toast.error('Please select a QR code image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', qrRecieverFormData.imageFile);
      formData.append('folderName', 'memberQRCodes');

      if (qrRecieverFormData.imageFile) {
        const response = await axiosInstance.post(
          '/api/image-upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        const imageLink = response.data.imageUrl;

        if (isEditMode && editData) {
          await axiosInstance.put(`/api/feeReciever/qr/${editData.qrCodeId}`, {
            ...qrRecieverFormData,
            qrImageLink: imageLink,
            imageFile: undefined,
          });
          toast.success('QR receiver updated successfully');
        } else {
          await axiosInstance.post(
            `/api/feeReciever/qr/${chapterData.chapterId}`,
            {
              ...qrRecieverFormData,
              qrImageLink: imageLink,
              imageFile: undefined,
            },
          );
          toast.success('QR receiver added successfully');
        }
      } else if (isEditMode) {
        // If no new image is uploaded during edit
        await axiosInstance.put(`/api/feeReciever/qr/${editData.qrCodeId}`, {
          ...qrRecieverFormData,
          qrImageLink: editData.qrImageLink, // Keep existing image
          imageFile: undefined,
        });
        toast.success('QR receiver updated successfully');
      }

      await fetchOnlineReceivers(); // Refresh the table
      handleModalClose(); // Close the modal
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to save QR receiver',
      );
      handleModalClose(); // Close the modal even on error
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

    // Add validation
    if (!recieverFormData.memberId) {
      toast.error('Please select a member');
      return;
    }
    if (!recieverFormData.enableDate) {
      toast.error('Please select an enable date');
      return;
    }
    if (!recieverFormData.disableDate) {
      toast.error('Please select a disable date');
      return;
    }

    try {
      const selectedMember = membersList.find(
        (m) => m.memberId === recieverFormData.memberId,
      );

      const payload = {
        receiverName: selectedMember
          ? `${selectedMember.firstName} ${selectedMember.lastName}`
          : editData?.receiverName,
        memberId: recieverFormData.memberId || editData?.memberId,
        chapterId: chapterData.chapterId,
        enableDate: recieverFormData.enableDate,
        disableDate: recieverFormData.disableDate,
      };

      if (isEditMode && editData) {
        await axiosInstance.put(
          `/api/feeReciever/cash/${chapterData.chapterId}/${editData.receiverId}`,
          payload,
        );
        toast.success('Cash receiver updated successfully');
      } else {
        await axiosInstance.post(`/api/feeReciever/cash/${chapterData.chapterId}`, payload);
        toast.success('Cash receiver added successfully');
      }

      await fetchCashReceivers(); // Refresh the table
      handleModalClose(); // Close the modal
    } catch (error) {
      console.error('Error submitting cash receiver:', error);
      toast.error(
        error.response?.data?.message || 'Failed to save cash receiver',
      );
      handleModalClose(); // Close the modal even on error
    }
  };

  const handleDelete = async (rid, type) => {
    try {
      if (type === 'cash') {
        await axiosInstance.delete(`/api/feeReciever/cash/${chapterData.chapterId}/${rid}`);
        await fetchCashReceivers();
        toast.success('Cash receiver deleted successfully');
      } else {
        await axiosInstance.delete(`/api/feeReciever/qr/${chapterData.chapterId}/${rid}`);
        await fetchOnlineReceivers();
        toast.success('QR receiver deleted successfully');
      }
      setDeleteInfo(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete receiver');
      setDeleteInfo(null);
    }
  };

  const handleCashEdit = (receiver) => {
    setModalType('cash');
    setEditData(receiver);
    setIsEditMode(true);
    setIsModalOpen(true);

    setRecieverFormData({
      cashRecieverName: receiver.receiverName,
      memberId: receiver.memberId,
      chapterId: chapterData.chapterId,
      enableDate: receiver.enableDate?.split('T')[0] || '',
      disableDate: receiver.disableDate?.split('T')[0] || '',
    });
  };

  const handleQREdit = (receiver) => {
    setModalType('qr');
    setEditData(receiver);
    setIsEditMode(true);
    setIsModalOpen(true);

    setQrRecieverFormData({
      memberId: receiver.memberId,
      chapterId: receiver.chapterId,
      qrCodeName: receiver.receiverName,
      imageFile: null,
      enableDate: receiver.enableDate?.split('T')[0],
      disableDate: receiver.disableDate?.split('T')[0],
    });
  };

  return (
    <>
      <ToastContainer />
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
        <div className="overflow-y-auto rounded-md border">
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
                              This action cannot be undone. This will
                              permanently delete the cash receiver.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 text-white hover:bg-red-600"
                              onClick={() =>
                                handleDelete(receiver.receiverId, 'cash')
                              }
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
        </div>

        <h2 className="text-lg font-medium mt-8 mb-4">QR Code Receivers</h2>
        <div className="overflow-y-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">QR Name</TableHead>
                <TableHead className="text-white">QR Code Image</TableHead>
                <TableHead className="text-white">Enable Date</TableHead>
                <TableHead className="text-white">Disable Date</TableHead>
                <TableHead className="text-white">Amount Collected</TableHead>
                <TableHead className="text-white">Receiver Amount</TableHead>
                <TableHead className="text-white">
                  Receiver Amount Type
                </TableHead>
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
                            This action cannot be undone. This will permanently
                            delete the QR receiver.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() =>
                              handleDelete(receiver.receiverId, 'qr')
                            }
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
        </div>

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

        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => !open && handleModalClose()}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit' : 'Add New'}{' '}
                {modalType === 'cash' ? 'Cash' : 'QR'} Receiver
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
                          cashRecieverName:
                            membersList.find((m) => m.memberId === value)
                              ?.firstName +
                            ' ' +
                            membersList.find((m) => m.memberId === value)
                              ?.lastName,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isEditMode
                              ? editData?.receiverName
                              : 'Select a member'
                          }
                        />
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
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gray-800 text-white hover:bg-black"
                  >
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
                        <SelectValue
                          placeholder={
                            isEditMode
                              ? editData?.receiverName
                              : 'Select a member'
                          }
                        />
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

                  <div className='gird gap-2'>
                    <Label htmlFor="receiverAmount">Receiver Amount</Label>
                    <Input
                      id="receiverAmount"
                      type="number"
                      value={qrRecieverFormData.receiverAmount}
                      onChange={(e) =>
                        setQrRecieverFormData((prev) => ({
                          ...prev,
                          receiverAmount: e.target.value,
                        }))
                      }
                      required
                    />

                    <div className='grid gap-2'>
                      <Label htmlFor="receiverAmountType">Receiver Amount Type</Label>
                      <Select
                        value={qrRecieverFormData.receiverAmountType}
                        onValueChange={(value) =>
                          setQrRecieverFormData((prev) => ({
                            ...prev,
                            receiverAmountType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Amount Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gray-800 text-white hover:bg-black"
                  >
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
