import React, { useState } from 'react';
import { Visitor } from '../../../models/Visitor';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Upload, 
  X, 
  Check, 
  Loader2, 
  User, 
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  Trash2
} from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';

interface AcceptPaymentProps {
  setBackDropOpen: (open: boolean) => void;
  selectedVisitor: Visitor;
  fetchVisitors: () => void;
}

const AcceptPayment: React.FC<AcceptPaymentProps> = ({
  setBackDropOpen,
  selectedVisitor,
  fetchVisitors,
}) => {
  const { chapterData } = useData();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(
    Number(selectedVisitor.paymentAmount) || Number(chapterData?.visitorPerMeetingFee) || 0,
  );
  const [paymentType, setPaymentType] = useState('cash');

  const getSafeStringValue = (value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const visitorName = `${getSafeStringValue(selectedVisitor.firstName)} ${getSafeStringValue(selectedVisitor.lastName)}`.trim();
  const isAlreadyPaid = !!selectedVisitor.paymentAcceptedMemberId;

  const markAsPaid = async () => {
    if (paymentAmount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    setLoading(true);
    setError('');
    
    let imageURL = '';
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);
      try {
        const response = await axiosInstance.post(
          '/api/image-upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        imageURL = response.data.imageUrl;
      } catch (error) {
        setError('Failed to upload image. Please try again.');
        setLoading(false);
        return;
      }
    }

    try {
      await axiosInstance.post('/api/visitor/mark-as-paid', {
        visitorId: selectedVisitor.visitorId,
        paymentImageLink: imageURL,
        paymentAmount: paymentAmount,
        paymentType,
      });
      
      setSuccess(true);
      toast.success('Payment recorded successfully');
      
      // Wait for success animation, then close and refresh
      setTimeout(() => {
        fetchVisitors();
        setBackDropOpen(false);
      }, 1500);
    } catch (error) {
      setError('Failed to record payment. Please try again.');
      toast.error('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleCancel = () => {
    setBackDropOpen(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-6 sm:py-8 px-4">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Payment Recorded Successfully
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
              Payment of ₹{paymentAmount} for {visitorName} has been recorded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-0">
      <DialogHeader className="pb-3">
        <DialogTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Accept Payment</span>
          </div>
          {isAlreadyPaid && (
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
              Already Paid
            </Badge>
          )}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-3">
        {/* Visitor Info - Compact */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visitor</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {visitorName || 'Unknown'}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {getSafeStringValue(selectedVisitor.email) || 'No email provided'}
          </p>
        </div>

        {/* Payment Details - Combined */}
        <Card>
          <CardContent className="p-4 space-y-3">
            {/* Amount and Method in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount (₹)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="text-base mt-1"
                  disabled={loading}
                />
                {chapterData?.visitorPerMeetingFee && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Default: ₹{chapterData.visitorPerMeetingFee}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium">Payment Method</Label>
                <RadioGroup
                  value={paymentType}
                  onValueChange={setPaymentType}
                  className="flex flex-row space-x-4 mt-2"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="text-sm cursor-pointer">Cash</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="text-sm cursor-pointer">Online</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Receipt Upload - Compact */}
            <div>
              <Label className="text-sm font-medium">Receipt (Optional)</Label>
              
              {/* Existing payment image */}
              {selectedVisitor.paymentImageLink && !selectedImage && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current:</p>
                  <img
                    src={getSafeStringValue(selectedVisitor.paymentImageLink)}
                    alt="Current receipt"
                    className="w-20 h-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}

              {/* Selected new image */}
              {selectedImage && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">New receipt:</p>
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected receipt"
                      className="w-20 h-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 w-6 h-6 p-0 rounded-full"
                      onClick={handleImageRemove}
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload button - compact */}
              {!selectedImage && (
                <div className="mt-2">
                  <Label htmlFor="receipt-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Upload receipt
                        </span>
                      </div>
                    </div>
                  </Label>
                  <input
                    id="receipt-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedImage(e.target.files[0]);
                      }
                    }}
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Already Paid Warning */}
        {isAlreadyPaid && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Note:</strong> Payment will be updated.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
          
          <Button
            onClick={markAsPaid}
            disabled={loading || paymentAmount <= 0}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto sm:min-w-[130px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Mark as Paid</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcceptPayment;
