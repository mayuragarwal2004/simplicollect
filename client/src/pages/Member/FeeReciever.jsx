import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Checkbox } from '@material-ui/core';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const FeeReciever = () => {
  const [cashReceivers, setCashReceivers] = useState([]);
  const [qrReceivers, setQrReceivers] = useState([]);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    fetchCashReceivers();
    fetchQrReceivers();
  }, []);

  const fetchCashReceivers = async () => {
    const response = await axios.get('/api/cash-receivers');
    setCashReceivers(response.data);
  };

  const fetchQrReceivers = async () => {
    const response = await axios.get('/api/qr-receivers');
    setQrReceivers(response.data);
  };

  const handleApprovalChange = (transactionId) => {
    setSelectedApprovals((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId],
    );
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Breadcrumb pageName="Member Fee Approval" />
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
          <div className="mb-4 flex gap-4">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddNew('cash')}
            >
              Add New Cash Receiver
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddNew('qr')}
            >
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
                    Approve
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
                      key={receiver.transactionId}
                      className="border-b border-gray-300 dark:border-strokedark"
                    >
                      <td className="py-3 px-4 text-black dark:text-white">
                        {receiver.firstName} {receiver.lastName}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {new Date(receiver.enableDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        {new Date(receiver.disableDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedApprovals.includes(
                            receiver.transactionId,
                          )}
                          onChange={() =>
                            handleApprovalChange(receiver.transactionId)
                          }
                          color="primary"
                        />
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
                    Approve
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
                      key={receiver.transactionId}
                      className="border-b border-gray-300 dark:border-strokedark"
                    >
                      <td className="py-3 px-4 text-black dark:text-white">
                        {receiver.qrName}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-white">
                        <img
                          src={receiver.qrCodeImage}
                          alt="QR Code"
                          className="w-16 h-16"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedApprovals.includes(
                            receiver.transactionId,
                          )}
                          onChange={() =>
                            handleApprovalChange(receiver.transactionId)
                          }
                          color="primary"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Modal open={isModalOpen} onClose={handleModalClose}>
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
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Enable Date
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Disable Date
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        QR Name
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        QR Code Image URL
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="mr-2"
                  >
                    Save
                  </Button>
                  <Button variant="contained" onClick={handleModalClose}>
                    Close
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default FeeReciever;
