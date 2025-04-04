import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Button } from '@material-ui/core';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddCashReceiver from '../../components/member/FeeReceiver/AddCashReceiver';
import AddOnlineReceiver from '../../components/member/FeeReceiver/AddOnlineReceiver';

const FeeReciever = () => {
  const [cashReceivers, setCashReceivers] = useState([]);
  const [qrReceivers, setQrReceivers] = useState([]);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [membersList, setMembersList] = useState([]);
  const { chapterData } = useData();
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

  useEffect(() => {
    fetchCashReceivers();
    fetchOnlineReceivers ();
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

  const fetchOnlineReceivers  = async () => {
    const response = await axiosInstance.get(
      `/api/feeReciever/qr/${chapterData.chapterId}`,
    );
    setQrReceivers(response.data);
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setModalType('');
    setIsModalOpen(false);
  };

  const handleCashSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('recieverFormData:', recieverFormData);

      const member = membersList.find(
        (member) => member.memberId === recieverFormData.memberId,
      );
      await axiosInstance.post(
        `/api/feeReciever/cash/${chapterData.chapterId}`,
        {
          ...recieverFormData,
          cashRecieverName: `${member.firstName} ${member.lastName}`,
        },
      );
      fetchCashReceivers();
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
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
      fetchOnlineReceivers ();
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  const getAmountCollected = async () => {
    const response = await axiosInstance.get(
      `/api/feeReciever/amountCollected/${chapterData.chapterId}`,
    );
    setAmountCollected(response.data);
  };

  return (
    <>
      <Breadcrumb pageName="Fee Receiver List" />
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium dark:text-white">
            Pending Fee Approvals
          </h2>
          {/* <IconButton aria-label="refresh" onClick={fetchPendingFees}>
                    <RefreshIcon className="dark:text-white" />
                </IconButton> */}
        </div>
        <div>
          <div className="mb-4 flex flex-wrap gap-4">
            <Button color="primary" onClick={() => handleAddNew('cash')}>
              Add New Cash Receiver
            </Button>
            <Button color="primary" onClick={() => handleAddNew('qr')}>
              Add New QR Receiver
            </Button>
          </div>

          <div className="overflow-x-auto mb-8">
            <h2>Cash Receivers</h2>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-left dark:bg-meta-4">
                  <th className="py-3 px-4 text-black dark:text-white">
                    Receiver Name
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Enable Date
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Disable Date
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Amount Collected
                  </th>
                </tr>
              </thead>
              <tbody>
                {cashReceivers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-black dark:text-white"
                    >
                      No cash receivers found.
                    </td>
                  </tr>
                ) : (
                  cashReceivers.map((receiver) => (
                    <tr
                      key={receiver.cashRecieverId}
                      className="border-b border-gray-300 dark:border-strokedark"
                    >
                      <td className="py-3 px-4 text-black dark:text-white">
                        {receiver.receiverName}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {new Date(receiver.enableDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {new Date(receiver.disableDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {amountCollected.find(
                          (amount) => amount.receiverId === receiver.memberId,
                        )?.totalAmountCollected || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <h2>QR Code Receivers</h2>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-left dark:bg-meta-4">
                  <th className="py-3 px-4 text-black dark:text-white">
                    QR Name
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    QR Code Image
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Enable Date
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Disable Date
                  </th>
                  <th className="py-3 px-4 text-black dark:text-white">
                    Amount Collected
                  </th>
                </tr>
              </thead>
              <tbody>
                {qrReceivers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-4 text-black dark:text-white"
                    >
                      No QR code receivers found.
                    </td>
                  </tr>
                ) : (
                  qrReceivers.map((receiver) => (
                    <tr
                      key={receiver.qrCodeId}
                      className="border-b border-gray-300 dark:border-strokedark"
                    >
                      <td className="py-3 px-4 text-black dark:text-white">
                        {receiver.receiverName}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        <img
                          src={receiver.qrImageLink}
                          alt="QR Code"
                          className="w-16 h-16"
                        />
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {new Date(receiver.enableDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {new Date(receiver.disableDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {amountCollected.find(
                          (amount) => amount.receiverId === receiver.memberId,
                        )?.totalAmountCollected || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <AddCashReceiver
            isModalOpen={isModalOpen && modalType === 'cash'}
            handleModalClose={handleModalClose}
            membersList={membersList}
            fetchCashReceivers={fetchCashReceivers}
            chapterData={chapterData}
          />

          <AddOnlineReceiver
            isModalOpen={isModalOpen && modalType === 'qr'}
            handleModalClose={handleModalClose}
            membersList={membersList}
            fetchOnlineReceivers ={fetchOnlineReceivers }
            chapterData={chapterData}
          />

          <Dialog open={false} onOpenChange={handleModalClose}>
            <DialogTrigger />
            <DialogContent className="sm:max-w-[425px]">
              <div className="modal-content p-4 bg-white rounded shadow-md">
                <h2 className="text-lg font-medium mb-4">
                  Add New {modalType === 'cash' ? 'Cash' : 'QR'} Receiver
                </h2>
                <form>
                  {modalType === 'cash' ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Receiver Name
                        </label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring indigo-500 sm:text-sm"
                          value={recieverFormData.memberId}
                          onChange={(e) =>
                            setRecieverFormData((prev) => ({
                              ...prev,
                              memberId: e.target.value,
                            }))
                          }
                        >
                          {membersList &&
                            membersList.map((member) => (
                              <option
                                key={member.memberId}
                                value={member.memberId}
                              >
                                {member.firstName} {member.lastName}
                              </option>
                            ))}
                        </select>
                      </div>
                       <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Enable Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={recieverFormData.enableDate}
                          onChange={(e) =>
                            setRecieverFormData((prev) => ({
                              ...prev,
                              enableDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Disable Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={recieverFormData.disableDate}
                          onChange={(e) =>
                            setRecieverFormData((prev) => ({
                              ...prev,
                              disableDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={handleModalClose}>
                          Close
                        </Button>
                        <Button
                          type="submit"
                          className="mr-2"
                          onClick={handleCashSubmit}
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Member Name
                        </label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring indigo-500 sm:text-sm"
                          value={qrRecieverFormData.memberId}
                          onChange={(e) =>
                            setQrRecieverFormData((prev) => ({
                              ...prev,
                              memberId: e.target.value,
                            }))
                          }
                        >
                          {membersList &&
                            membersList.map((member) => (
                              <option
                                key={member.memberId}
                                value={member.memberId}
                              >
                                {member.firstName} {member.lastName}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          QR Name
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={qrRecieverFormData.qrCodeName}
                          onChange={(e) =>
                            setQrRecieverFormData((prev) => ({
                              ...prev,
                              qrCodeName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          QR Code Image
                        </label>
                        <input
                          type="file"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring indigo-500 sm:text-sm"
                          onChange={(e) =>
                            setQrRecieverFormData((prev) => ({
                              ...prev,
                              imageFile: e.target.files[0],
                            }))
                          }
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Enable Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={qrRecieverFormData.enableDate}
                          onChange={(e) =>
                            setQrRecieverFormData((prev) => ({
                              ...prev,
                              enableDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Disable Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={qrRecieverFormData.disableDate}
                          onChange={(e) =>
                            setQrRecieverFormData((prev) => ({
                              ...prev,
                              disableDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={handleModalClose}>
                          Close
                        </Button>
                        <Button
                          type="submit"
                          className="mr-2"
                          onClick={handleQRSubmit}
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default FeeReciever;
