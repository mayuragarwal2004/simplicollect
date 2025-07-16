import React, { useEffect, useState } from 'react';
import { usePaymentData } from './PaymentDataContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CreditCard, Banknote, AlertCircle, User } from 'lucide-react';

const SelectReceiver = ({ setStep, handlePackagePayModalClose }) => {
  const { paymentData, setPaymentData } = usePaymentData();
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [error, setError] = useState('');

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

    if (receiversByPaymentType.length === 0) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {paymentType === 'cash' ? 'Cash' : 'Online'} Receivers Available
              </h3>
              <p className="text-gray-500 mb-4">
                There are currently no {paymentType === 'cash' ? 'cash collection' : 'online payment'} receivers 
                set up for this chapter.
              </p>
              <p className="text-sm text-gray-400">
                Please contact your chapter admin to set up {paymentType === 'cash' ? 'cash' : 'online'} receivers.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          {paymentType === 'cash' ? (
            <Banknote className="h-5 w-5 text-green-600" />
          ) : (
            <CreditCard className="h-5 w-5 text-blue-600" />
          )}
          <h3 className="text-lg font-medium">
            Select a {paymentType === 'cash' ? 'Cash' : 'Online'} Receiver
          </h3>
        </div>
        
        <div className="grid gap-3 max-h-60 overflow-y-auto pr-2">
          {receiversByPaymentType.map((receiver) => (
            <Card
              key={receiver.receiverId}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                paymentData.selectedReceiver === receiver.receiverId
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setPaymentData((prev) => ({
                  ...prev,
                  selectedReceiver: receiver.receiverId,
                }));
                setError('');
              }}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        paymentData.selectedReceiver === receiver.receiverId
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}>
                        <User className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          paymentData.selectedReceiver === receiver.receiverId
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {receiver.receiverName}
                      </h4>
                    </div>
                  </div>
                  
                  {paymentData.selectedReceiver === receiver.receiverId && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
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
    <div className="flex flex-col h-full max-h-[80vh] overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-2">
          {showPaymentMethod ? 'Select Payment Method' : 'Payment Method'}
        </h2>
        {paymentData.receivers.length === 0 && (
          <p className="text-gray-600 text-sm">
            Choose how you'd like to make your payment
          </p>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 min-h-0">
        {paymentData.receivers.length === 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="text-center max-w-md">
                <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  No Payment Receivers Available
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  There are currently no payment receivers set up for this chapter. 
                  Payment receivers are required to process your fee payment.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm font-medium mb-2">
                    What you can do:
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1 text-left">
                    <li>• Contact your chapter administrator</li>
                    <li>• Ask them to set up cash or online receivers</li>
                    <li>• Try again once receivers are configured</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500">
                  Chapter admins can set up receivers in the Fee Receiver management section
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Tabs
            value={paymentData.paymentMethod}
            className="w-full"
            onValueChange={(value) => {
              setPaymentData((prev) => ({
                ...prev,
                paymentMethod: value,
                selectedReceiver: '', // Reset receiver when changing method
              }));
              setError('');
            }}
          >
            {showPaymentMethod ? (
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="cash" className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Cash
                </TabsTrigger>
                <TabsTrigger value="online" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Online
                </TabsTrigger>
              </TabsList>
            ) : (
              <div className="mb-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2">
                  {paymentData.paymentMethod === 'cash' ? (
                    <Banknote className="h-5 w-5 text-blue-600" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="font-medium text-blue-900">
                    {paymentData.paymentMethod === 'cash' ? 'Cash Payment' : 'Online Payment'}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    Only Available Method
                  </Badge>
                </div>
              </div>
            )}

            <TabsContent value="cash" className="mt-0">
              {ReveiverSelector('cash')}
            </TabsContent>
            <TabsContent value="online" className="mt-0">
              {ReveiverSelector('online')}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => handlePackagePayModalClose()}>
            Cancel
          </Button>
          {paymentData.receivers.length > 0 && (
            <Button onClick={validateAndNext} disabled={!paymentData.selectedReceiver}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectReceiver;