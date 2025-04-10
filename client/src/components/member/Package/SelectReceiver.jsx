import React, { useEffect, useState } from 'react';
import { usePaymentData } from './PaymentDataContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight } from 'lucide-react';

const SelectReceiver = ({ setStep, handlePackagePayModalClose }) => {
  const { paymentData, setPaymentData } = usePaymentData();
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (value) => {
    setPaymentData((prev) => ({
      ...prev,
      selectedReceiver: value,
    }));
  };

  const validateAndNext = () => {
    if (!paymentData.paymentMethod) {
      setError('Please select a payment method');
    } else if (!paymentData.selectedReceiver) {
      setError('Please select a receiver');
    } else if (
      paymentData.receivers.filter(
        (receiver) =>
          receiver.receiverId === paymentData.selectedReceiver &&
          receiver.paymentType === paymentData.paymentMethod,
      ).length === 0
    ) {
      setError('Invalid Receiver for the selected payment method');
    } else {
      setError('');
      setStep(2);
    }
  };

  const ReveiverSelector = (paymentType) => {
    const receiversByPaymentType = paymentData.receivers.filter(
      (receiver) => receiver.paymentType === paymentType,
    );

    const handleSelectChange = (value) => {
      if (!value) {
        setError('Please select a receiver');
      } else {
        setError('');
        handleChange(value);
      }
    };

    return (
      <div>
        <h2>Select a receiver</h2>
        <Select
          onValueChange={handleSelectChange}
          value={paymentData.selectedReceiver || undefined}
        >
          <SelectTrigger>
            <SelectValue
              className="text-black placeholder-gray-500 placeholder-opacity-100"
              placeholder="Select a Receiver"
            />
          </SelectTrigger>
          <SelectContent>
            {receiversByPaymentType.map((receiver) => (
              <SelectItem value={receiver.receiverId} key={receiver.receiverId}>
                {receiver.receiverName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  };

  useEffect(() => {
    const cashReceivers = paymentData.receivers.filter(
      (receiver) => receiver.paymentType === 'cash',
    );
    const onlineReceivers = paymentData.receivers.filter(
      (receiver) => receiver.paymentType === 'online',
    );

    if (cashReceivers.length > 0 && onlineReceivers.length > 0) {
      setPaymentData((prev) => ({
        ...prev,
        paymentMethod: prev.paymentMethod || 'cash',
      }));
      setShowPaymentMethod(true);
    } else if (cashReceivers.length > 0) {
      setPaymentData((prev) => ({
        ...prev,
        paymentMethod: 'cash',
      }));
      setShowPaymentMethod(false);
    } else if (onlineReceivers.length > 0) {
      setPaymentData((prev) => ({
        ...prev,
        paymentMethod: 'online',
      }));
      setShowPaymentMethod(false);
    } else {
      setShowPaymentMethod(false);
    }
  }, [paymentData.receivers]);

  return (
    <div>
      <h2>{showPaymentMethod ? 'Select Payment Method' : 'Payment Method'}</h2>
      <Tabs
        value={paymentData.paymentMethod}
        className="w-full"
        onValueChange={(value) => {
          setPaymentData((prev) => ({
            ...prev,
            paymentMethod: value,
          }));
          if (value === 'cash' || value === 'online') {
            setError('');
          }
        }}
      >
        {showPaymentMethod ? (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
          </TabsList>
        ) : (
          <div className="my-2 p-2 border rounded">
            <strong className="capitalize">{paymentData.paymentMethod}</strong> is the only available method.
          </div>
        )}

        <TabsContent value="cash">{ReveiverSelector('cash')}</TabsContent>
        <TabsContent value="online">{ReveiverSelector('online')}</TabsContent>
      </Tabs>

      {paymentData.receivers.length === 0 && (
        <p className="text-red-500 my-5">
          No receivers available as of now, please contact admin
        </p>
      )}

      <div className="flex justify-between mt-2">
        <Button variant="outline" onClick={() => handlePackagePayModalClose()}>
          Cancel
        </Button>
        {paymentData.receivers.length === 0 ? null : (
          <Button onClick={validateAndNext}>
            Next
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SelectReceiver;