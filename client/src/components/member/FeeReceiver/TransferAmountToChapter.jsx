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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const TransferAmountToChapter = () => {
  const { chapterData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [transferType, setTransferType] = useState('today');
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amount, setAmount] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Fetch transactions whenever transferType changes
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance(
          `/api/chapter-payment/${chapterData.chapterId}/approved-transactions`,
          {
            params: {
              filter: {
                date:
                  transferType === 'today'
                    ? format(new Date("2025-03-18"), 'yyyy-MM-dd')
                    : undefined,
              },
            },
          },
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
  }, [transferType, isOpen]);

  console.log({ transactions, totalAmount });

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrevious = () => setCurrentStep((prev) => prev - 1);

  const handleTransfer = async () => {
    // Call backend transfer API
    console.log(`Transferring amount: ${amount}`);
    try {
      // call backend transfer API
      const response = await axiosInstance.post(
        `/api/chapter-payment/${chapterData.chapterId}/pay-to-chapter`,
        {
          filter: {
            date:
              transferType === 'today'
                ? format(new Date(), 'yyyy-MM-dd')
                : undefined,
          },
          totalAmount,
          transferredAmount: amount,
        },
      );
      console.log(response.data);
      if (response.data.success) {
        toast.success('Amount transferred successfully');
        setShowAlert(false);
        setIsOpen(false);
        setCurrentStep(1);
        setAmount('');
      }
    } catch (error) {
      console.error('Error transferring amount:', error);
      toast.error('Error transferring amount');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Transfer Amount to Chapter</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>Open Transfer Dialog</Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Transfer Amount to Chapter</DialogTitle>
          </DialogHeader>

          {currentStep === 1 && (
            <StepOne
              transferType={transferType}
              setTransferType={setTransferType}
            />
          )}
          {currentStep === 2 && (
            <StepTwo transactions={transactions} totalAmount={totalAmount} />
          )}
          {currentStep === 3 && (
            <StepThree
              amount={amount}
              setAmount={setAmount}
              totalAmount={totalAmount}
            />
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button variant="secondary" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStep < 3 && <Button onClick={handleNext}>Next</Button>}
            {currentStep === 3 && (
              <ConfirmTransferDialog
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                totalAmount={totalAmount}
                amount={amount}
                handleTransfer={handleTransfer}
              />
            )}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentStep(1);
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransferAmountToChapter;

const StepOne = ({ transferType, setTransferType }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">
      Step 1: Select Transaction Type
    </h2>
    <RadioGroup
      value={transferType}
      onValueChange={setTransferType}
      className="space-y-3"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="today" id="today" />
        <Label htmlFor="today">
          Transfer only today's approved transactions (recommended)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="all" id="all" />
        <Label htmlFor="all">Transfer including previous transactions</Label>
      </div>
    </RadioGroup>
  </div>
);

const StepTwo = ({ transactions, totalAmount }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Step 2: Review Transactions</h2>
    <table className="w-full border mb-4">
      <thead>
        <tr>
          <th>Sr No.</th>
          <th>Member Name</th>
          <th>Amount</th>
          <th>Payment Type</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, index) => (
          <tr key={tx.id}>
            <td>{index + 1}</td>
            <td>
              {tx.firstName} {tx.lastName}
            </td>
            <td>{tx.paidAmount}</td>
            <td>{tx.paymentType}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="font-semibold">Total Amount: {totalAmount}</div>
  </div>
);

const StepThree = ({ amount, setAmount, totalAmount }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">
      Step 3: Enter Transfer Amount
    </h2>
    <Input
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="Enter amount"
    />
    {/* orignal payable amount */}
    <div>Original Payable Amount: {totalAmount}</div>
  </div>
);

const ConfirmTransferDialog = ({
  showAlert,
  setShowAlert,
  totalAmount,
  amount,
  handleTransfer,
}) => (
  <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
    <AlertDialogTrigger asChild>
      <Button variant="default" onClick={() => setShowAlert(true)}>
        Transfer
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Transfer</AlertDialogTitle>
      </AlertDialogHeader>
      <div>
        <p>Original Payable Amount: {totalAmount}</p>
        <p>Entered Transfer Amount: {amount}</p>
        <p>Difference: {totalAmount - Number(amount)}</p>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleTransfer}>Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
