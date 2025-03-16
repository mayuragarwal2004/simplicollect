import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, Loader2 } from 'lucide-react';

const PackageFinalAmountInput = ({ setStep }) => {
  const [totalAmount] = useState(4800);
  const [currentPayment, setCurrentPayment] = useState(4800);
  const netBalance = totalAmount - currentPayment;
  const overpaidAmount =
    currentPayment > totalAmount ? currentPayment - totalAmount : 0;
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);

    // Simulate API call (Replace with actual API call)
    setTimeout(() => {
      setLoading(false);
      setShowConfirm(false);
      alert(`Payment of ₹${currentPayment} confirmed!`);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Total Payable Amount: ₹{totalAmount}
      </h2>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-700">
          Enter Amount to Pay:
        </h3>
        <input
          type="number"
          value={currentPayment}
          onChange={(e) => {
            let val = Number(e.target.value);
            if (val < 0) val = 0;
            setCurrentPayment(val);
          }}
          className="w-full p-2 border border-gray-300 rounded text-center"
        />
      </div>

      {currentPayment <= totalAmount ? (
        <h3 className="text-xl font-semibold text-gray-700">
          Net Balance Amount: ₹{netBalance}
        </h3>
      ) : (
        <h3 className="text-xl font-semibold text-green-700">
          You have overpaid by ₹{overpaidAmount}
        </h3>
      )}

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <div className="flex justify-between mt-2">
          <Button variant="outline" onClick={() => setStep(2)}>
            <ChevronLeft />
            Back
          </Button>
          <Button onClick={() => setShowConfirm(true)}>Confirm</Button>
        </div>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm payment of ₹{currentPayment}?
              {currentPayment > totalAmount && (
                <div className="mt-2 text-green-700 font-semibold">
                  (You will overpay by ₹{overpaidAmount})
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className="flex items-center justify-center"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PackageFinalAmountInput;
