import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import { toast } from 'react-toastify';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

const TransferAmountToChapter = () => {
  const { chapterData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const resetDialog = () => {
    setAmount('');
    setRemark('');
    setShowAlert(false);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance(
          `/api/chapter-payment/${chapterData.chapterId}/approved-transactions`,
        );
        const data = response.data;
        setTransactions(data.transactions);
        setTotalAmount(data.totalAmount);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen]);

  const handleTransfer = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/chapter-payment/${chapterData.chapterId}/pay-to-chapter`,
        {
          totalAmount,
          transferredAmount: amount,
          remark,
        },
      );
      if (response.data.success) {
        toast.success('Amount transferred successfully');
        resetDialog();
      }
    } catch (error) {
      console.error('Error transferring amount:', error);
      toast.error('Error transferring amount');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-2">Transfer Collected Fees</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Transfer all approved & untransferred transactions to your chapter.
      </p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>Transfer Now</Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl">
          <DialogHeader className="mb-4">
            <DialogTitle>Confirm Transfer Details</DialogTitle>
          </DialogHeader>

          <div className="mb-4 space-y-4">
            <div className="overflow-y-auto rounded-md border max-h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr No.</TableHead>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, index) => (
                    <TableRow key={tx.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {tx.firstName} {tx.lastName}
                      </TableCell>
                      <TableCell>{tx.paidAmount}</TableCell>
                      <TableCell>{tx.paymentType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <p className="font-medium">
                Original Total Amount: {totalAmount}
              </p>
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount you are transferring"
            />
            <Textarea
              placeholder="Add a remark (optional)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <ConfirmTransferDialog
              showAlert={showAlert}
              setShowAlert={setShowAlert}
              totalAmount={totalAmount}
              amount={amount}
              remark={remark}
              handleTransfer={handleTransfer}
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" onClick={resetDialog}>
                Cancel & Reset
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransferAmountToChapter;

const ConfirmTransferDialog = ({
  showAlert,
  setShowAlert,
  totalAmount,
  amount,
  remark,
  handleTransfer,
}) => {
  const difference = totalAmount - Number(amount);
  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogTrigger asChild>
        <Button variant="default" onClick={() => setShowAlert(true)}>
          Confirm Transfer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to transfer?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-2">
          <p>Total Collected: ₹{totalAmount}</p>
          <p>Transfer Amount: ₹{amount}</p>
          <p className="text-yellow-600">
            {difference !== 0 &&
              `Note: Difference of ₹${difference > 0 ? difference : -difference}`}
          </p>
          {remark && <p>Remark: {remark}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleTransfer}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
