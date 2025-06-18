import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select as ShadSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

interface Receiver {
  receiverId: string;
  receiverName: string;
  memberId: string;
  chapterId: string;
  paymentType: string;
  receiverAmount: number | null;
  receiverAmountType: string | null;
  qrImageLink: string | null;
  enableDate: string;
  disableDate: string;
  receiverFeeOptional: number;
}

interface EditFeeDetailsProps {
  receivedAmount: string;
  setReceivedAmount: (v: string) => void;
  selectedReceiver: string;
  setSelectedReceiver: (v: string) => void;
  selectedPaymentMode: string;
  setSelectedPaymentMode: (v: string) => void;
  receiverList: Receiver[];
  allMembers: any[];
  showAllMembers: boolean;
  setShowAllMembers: (v: boolean) => void;
  paymentModes: { value: string; label: string }[];
  selectedFee: any;
  canChangeReceiver: boolean;
  setCanChangeReceiver: (v: boolean) => void;
  onCancel?: () => void;
  onSave: () => void;
  onApprove: () => void;
  saveDisabled?: boolean;
  approveDisabled?: boolean;
}

const EditFeeDetails: React.FC<EditFeeDetailsProps> = ({
  receivedAmount,
  setReceivedAmount,
  selectedReceiver,
  setSelectedReceiver,
  selectedPaymentMode,
  setSelectedPaymentMode,
  receiverList,
  allMembers,
  showAllMembers,
  setShowAllMembers,
  paymentModes,
  selectedFee,
  canChangeReceiver,
  setCanChangeReceiver,
  onCancel,
  onSave,
  onApprove,
  saveDisabled,
  approveDisabled,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState<number | null>(null);
  const [amountPaidToChapter, setAmountPaidToChapter] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedFee) return;
    const paid = parseFloat(receivedAmount) || 0;
    const original = parseFloat(selectedFee.payableAmount) || 0;
    const platformFee = parseFloat(selectedFee.platformFee) || 0;
    const receiverFee = parseFloat(selectedFee.receiverFee) || 0;
    setBalanceAmount(paid - original);
    setAmountPaidToChapter(paid - platformFee - receiverFee);
  }, [receivedAmount, selectedFee]);

  const currentReceiver = receiverList.find(
    (r) => r.memberId === selectedReceiver,
  );
  return (
    <div className="space-y-4 py-4 w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl px-2 sm:px-4" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <div className="space-y-2">
        <p className="text-sm font-medium">Member Details:</p>
        <p className="text-sm">
          {selectedFee?.firstName} {selectedFee?.lastName}
        </p>
        <p className="text-sm">Package: {selectedFee?.packageName}</p>
        <p className="text-sm">Original Payable Amount: ₹{selectedFee?.payableAmount}</p>
        <p className="text-sm">Expected Amount: ₹{selectedFee?.paidAmount}</p>
        <p className="text-sm">Dues: ₹{selectedFee?.balanceAmount}</p>
        {/* <p className="text-sm">System Remarks: <span className="break-words whitespace-pre-line">{selectedFee?.systemRemarks || '-'}</span></p> */}
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount Received</Label>
        <Input
          id="amount"
          type="number"
          value={receivedAmount}
          onChange={(e) => setReceivedAmount(e.target.value)}
          placeholder="Enter amount received"
          className="w-full"
        />
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-xs text-gray-600 dark:text-gray-300">Live Balance Amount: <span className={balanceAmount === 0 ? 'text-green-700 dark:text-green-300' : balanceAmount < 0 ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'}>₹{balanceAmount ?? '-'}</span></span>
          <span className="text-xs text-gray-600 dark:text-gray-300">Amount Paid to Chapter: <span className="text-blue-700 dark:text-blue-300">₹{amountPaidToChapter ?? '-'}</span></span>
        </div>
      </div>
      {/* Receiver selection logic */}
      <div className="space-y-2">
        <Label htmlFor="receiver">Receiver</Label>
        {!canChangeReceiver && (
          <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            {currentReceiver ? (
              <>
                {currentReceiver.receiverName} is the receiver for this payment.{' '}
                <button
                  className="text-blue-600 underline ml-1"
                  type="button"
                  onClick={() => setCanChangeReceiver(true)}
                >
                  Not the receiver? Click here to change
                </button>
              </>
            ) : (
              <>
                Receiver not found.{' '}
                <button
                  className="text-blue-600 underline ml-1"
                  type="button"
                  onClick={() => setCanChangeReceiver(true)}
                >
                  Click here to select
                </button>
              </>
            )}
          </div>
        )}
        {canChangeReceiver && (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => setShowDropdown((v) => !v)}
            >
              {(() => {
                const r = (showAllMembers ? allMembers : receiverList).find(
                  (r: any) => r.memberId === selectedReceiver,
                );
                return r ? r.receiverName || r.firstName + ' ' + r.lastName : 'Select receiver';
              })()}
              <span className="ml-2">▼</span>
            </Button>
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-boxdark border rounded shadow-lg max-h-60 overflow-y-auto">
                <Command className="w-full border-none shadow-none">
                  <CommandInput placeholder="Search receiver..." />
                  <CommandList>
                    {(showAllMembers ? allMembers : receiverList).length === 0 && (
                      <CommandEmpty>No receivers found.</CommandEmpty>
                    )}
                    {(showAllMembers ? allMembers : receiverList).map((r: any) => (
                      <CommandItem
                        key={r.memberId}
                        value={r.memberId}
                        onSelect={() => {
                          setSelectedReceiver(r.memberId);
                          setShowDropdown(false);
                        }}
                        className={
                          selectedReceiver === r.memberId
                            ? 'bg-blue-100 dark:bg-blue-700'
                            : ''
                        }
                      >
                        {r.receiverName || r.firstName + ' ' + r.lastName}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </div>
            )}
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                checked={showAllMembers}
                onChange={() => setShowAllMembers(!showAllMembers)}
                id="showAllMembers"
                className="mr-2"
              />
              <label htmlFor="showAllMembers" className="text-xs">
                Show all members
              </label>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="paymentMode">Payment Mode</Label>
        <ShadSelect value={selectedPaymentMode} onValueChange={setSelectedPaymentMode}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment mode" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {paymentModes.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadSelect>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onSave}
          disabled={saveDisabled}
        >
          Save Changes
        </Button>
        <Button
          onClick={onApprove}
          disabled={approveDisabled}
        >
          Save & Approve
        </Button>
      </div>
    </div>
  );
};

export default EditFeeDetails;
