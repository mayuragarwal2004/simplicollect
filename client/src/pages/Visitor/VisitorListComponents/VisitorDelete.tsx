import React, { useState } from 'react';
import { Visitor } from '../../../models/Visitor';
import { axiosInstance } from '../../../utils/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { 
  Trash2, 
  AlertTriangle, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';

interface VisitorDeleteProps {
  setBackDropOpen: (open: boolean) => void;
  selectedVisitor: Visitor;
  fetchVisitors: () => void;
}

const VisitorDelete: React.FC<VisitorDeleteProps> = ({
  setBackDropOpen,
  selectedVisitor,
  fetchVisitors,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState<'warning' | 'success'>('warning');

  const getSafeStringValue = (value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const visitorName = `${getSafeStringValue(selectedVisitor.firstName)} ${getSafeStringValue(selectedVisitor.lastName)}`.trim();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await axiosInstance.delete(
        `/api/visitor/deleteVisitor/${selectedVisitor.visitorId}`,
      );
      
      setStep('success');
      toast.success('Visitor deleted successfully');
      
      // Wait for success animation, then close and refresh
      setTimeout(() => {
        fetchVisitors();
        setBackDropOpen(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to delete the visitor:', error);
      toast.error('Failed to delete visitor. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setBackDropOpen(false);
  };

  if (step === 'success') {
    return (
      <div className="w-full max-w-md mx-auto text-center py-6 sm:py-8 px-4">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Visitor Deleted Successfully
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
              {visitorName} has been permanently removed from the system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <DialogHeader className="pb-4">
        <DialogTitle className="flex items-center space-x-2 sm:space-x-3 text-lg sm:text-xl text-red-600 dark:text-red-400">
          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Delete Visitor</span>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 sm:space-y-6">
        {/* Warning Alert */}
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200 font-medium text-sm">
            <strong>Warning:</strong> This action cannot be undone. The visitor and all associated data will be permanently deleted.
          </AlertDescription>
        </Alert>

        {/* Visitor Information Card */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Visitor to be deleted</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Review the visitor information below before proceeding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {visitorName || 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                    {getSafeStringValue(selectedVisitor.email) || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </Label>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                    {getSafeStringValue(selectedVisitor.mobileNumber) || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company
                </Label>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                    {getSafeStringValue(selectedVisitor.companyName) || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Status:
              </span>
              {selectedVisitor.paymentAcceptedMemberId ? (
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
                  Paid
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Unpaid
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto sm:min-w-[120px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Visitor</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitorDelete;
