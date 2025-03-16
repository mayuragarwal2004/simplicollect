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

// paymentData.receivers = [
//     {
//         "receiverId": "61863305-98d6-45cc-a1c7-eb9659c4dfd0",
//         "receiverName": "Ruturaj Shinde",
//         "memberId": "ergioheohjgbiehjgbdl",
//         "chapterId": "1",
//         "paymentType": "cash",
//         "receiverAmount": null,
//         "receiverAmountType": null,
//         "qrImageLink": null,
//         "enableDate": "2024-12-31T18:30:00.000Z",
//         "disableDate": "2025-04-29T18:30:00.000Z"
//     },
// ]
const SelectReceiver = ({ setStep, handlePackagePayModalClose }) => {
  const { paymentData, setPaymentData } = usePaymentData();

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  console.log('From SelectReceiver', {
    selectedReceiver: paymentMethod.selectedReceiver,
  });
  const handleChange = (value) => {
    setPaymentData((prev) => ({
      ...prev,
      selectedReceiver: value,
    }));
  };

  const [error, setError] = useState('');
  const validateAndNext = () => {
    if (!paymentData.paymentMethod) {
      setError('Please select a payment method');
    } else if (!paymentData.selectedReceiver) {
      setError('Please select a receiver');
    } else if (
      //check if the selectedReceiver is valid for the selected paymentMethod and is present in the paymentData.receivers array
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
        <Select
          onValueChange={handleSelectChange}
          value={paymentData.selectedReceiver}
        >
          <SelectTrigger className="w-[380px]">
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
    if (paymentData.receivers.length === 0) {
      setShowPaymentMethod(false);
    } else if (
      paymentData.receivers.filter(
        (receiver) => receiver.paymentType === 'cash',
      ).length === 0
    ) {
      setPaymentData((prev) => ({
        ...prev,
        paymentMethod: 'online',
      }));
      setShowPaymentMethod(false);
    } else if (
      paymentData.receivers.filter(
        (receiver) => receiver.paymentType === 'online',
      ).length === 0
    ) {
      setPaymentData((prev) => ({
        ...prev,
        paymentMethod: 'cash',
      }));
      setShowPaymentMethod(false);
    } else {
      setShowPaymentMethod(true);
    }
  }, [paymentData.receivers]);

  console.log({ paymentMethod: paymentData.paymentMethod });

  return (
    <div>
      <h2>
        {showPaymentMethod ? 'Select Payment Method' : 'Select a receiver'}
      </h2>
      <Tabs
        value={paymentData.paymentMethod}
        defaultValue="cash"
        className="w-full"
        onValueChange={setPaymentMethod}
      >
        {showPaymentMethod && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="cash">{ReveiverSelector('cash')}</TabsContent>
        <TabsContent value="online">{ReveiverSelector('online')}</TabsContent>
      </Tabs>
      <div className="flex justify-between mt-2">
        <Button variant="outline" onClick={() => handlePackagePayModalClose()}>
          Cancel
        </Button>
        <Button onClick={validateAndNext}>
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default SelectReceiver;
