import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import { toast } from 'react-toastify';

const AcceptChapterPayment = () => {
  const { chapterData } = useData();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!chapterData?.chapterId) return; // Ensure chapterData is available
    fetchPendingTransactions();
  }, [chapterData?.chapterId]);

  const handleAcceptPayment = async (transactionId) => {
    try {
      await axiosInstance.post(
        `/api/chapter-payment/approve-payment/${transactionId}`,
      );
      // After approving, refetch or filter it out
      fetchPendingTransactions();
      setIsDialogOpen(false);
      toast.success('Payment accepted successfully!');
    } catch (error) {
      toast.error('Error accepting payment');
      console.error('Error accepting payment:', error);
    }
  };

  const fetchPendingTransactions = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/chapter-payment/${chapterData.chapterId}/chapter-transactions`,
      );
      setTransactions(response.data.data);
    } catch (error) {
      toast.error('Error fetching transactions');
      console.error('Error fetching transactions:', error);
    }
  };

  if (!chapterData?.chapterId) return null; // Ensure chapterData is available

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Pending Payment Requests
      </h2>
      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender Name</TableHead>
              <TableHead>Payable Amount</TableHead>
              <TableHead>Transferred Amount</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.senderName}</TableCell>
                <TableCell>{transaction.payableAmount}</TableCell>
                <TableCell>{transaction.transferredAmount}</TableCell>
                <TableCell>
                  {parseFloat(transaction.payableAmount) -
                    parseFloat(transaction.transferredAmount)}
                </TableCell>
                <TableCell>
                  {transaction.approvedById
                    ? `Approved by ${transaction.approvedByName}`
                    : 'Pending'}
                </TableCell>
                <TableCell className="text-right">
                  {!transaction.approvedById ? (
                    <Dialog
                      open={
                        selectedTransaction?.id === transaction.id &&
                        isDialogOpen
                      }
                      onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setSelectedTransaction(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Accept Payment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Accept Payment from{' '}
                            {selectedTransaction?.senderName}
                          </DialogTitle>
                          <DialogDescription className="text-gray-700 dark:text-gray-300">
                            <p>
                              Payable Amount:{' '}
                              {selectedTransaction?.payableAmount}
                            </p>
                            <p>
                              Transferred Amount:{' '}
                              {selectedTransaction?.transferredAmount}
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-3 mt-4">
                          <Button
                            onClick={() =>
                              handleAcceptPayment(selectedTransaction.id)
                            }
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            Confirm
                          </Button>
                          <Button
                            onClick={() => setIsDialogOpen(false)}
                            className="bg-gray-500 text-white hover:bg-gray-600"
                          >
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-green-500 font-medium">
                      Payment Accepted
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AcceptChapterPayment;
