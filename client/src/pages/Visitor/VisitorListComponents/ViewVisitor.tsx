import React, { useState } from 'react';
import { Visitor } from '../../../models/Visitor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  Star,
  MessageSquare,
  Check,
  X,
  MapPin,
  Briefcase,
  Users,
  Clock,
  IndianRupee,
  FileImage
} from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ViewVisitorProps {
  setBackDropOpen: (open: boolean) => void;
  selectedVisitor: Visitor;
  fetchVisitors: () => void;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined | boolean;
  isHighlight?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, isHighlight = false }) => {
  const displayValue = React.useMemo(() => {
    if (value === null || value === undefined) return 'Not provided';
    if (typeof value === 'boolean') {
      return value === true ? 'Yes' : 'No';
    }
    // Handle string boolean values
    if (typeof value === 'string' && (value === 'Yes' || value === 'No')) {
      return value;
    }
    return String(value);
  }, [value]);

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${isHighlight ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
      <div className="flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Label>
        <p className="text-sm text-gray-900 dark:text-gray-100 mt-1 break-words">
          {displayValue}
        </p>
      </div>
    </div>
  );
};

const ViewVisitor: React.FC<ViewVisitorProps> = ({
  setBackDropOpen,
  selectedVisitor,
  fetchVisitors,
}) => {
  const getStatusBadge = (status: string | number | boolean | null | undefined) => {
    const statusStr = String(status || '').toLowerCase();
    switch (statusStr) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'declined':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Declined</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getPaymentStatusBadge = (hasPaid: boolean) => {
    return hasPaid ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100">
        <Check className="w-3 h-3 mr-1" />Paid
      </Badge>
    ) : (
      <Badge variant="destructive">
        <X className="w-3 h-3 mr-1" />Unpaid
      </Badge>
    );
  };

  const formatDate = (dateString: string | number | boolean | null | undefined) => {
    if (!dateString || typeof dateString === 'boolean') return 'Not available';
    return new Date(String(dateString)).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: string | number | boolean | null | undefined) => {
    if (!amount || typeof amount === 'boolean') return 'Not specified';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (isNaN(numAmount)) return 'Not specified';
    return `₹${numAmount.toLocaleString('en-IN')}`;
  };

  const formatTime = (timeString: string | number | boolean | null | undefined) => {
    if (!timeString || typeof timeString === 'boolean') return 'Not available';
    try {
      return new Date(`1970-01-01T${String(timeString)}`).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Invalid time';
    }
  };

  const getSafeStringValue = (value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const getSafeNumberValue = (value: string | number | boolean | null | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <DialogHeader className="pb-4">
        <DialogTitle className="flex items-center space-x-3 text-xl">
          <User className="w-6 h-6" />
          <span>{selectedVisitor.firstName} {selectedVisitor.lastName}</span>
          {getStatusBadge(selectedVisitor.visitorStatus)}
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Payment</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoItem 
                  icon={<User className="w-4 h-4" />} 
                  label="Full Name" 
                  value={`${selectedVisitor.firstName} ${selectedVisitor.lastName}`}
                  isHighlight
                />
                <InfoItem 
                  icon={<Mail className="w-4 h-4" />} 
                  label="Email" 
                  value={selectedVisitor.email} 
                />
                <InfoItem 
                  icon={<Phone className="w-4 h-4" />} 
                  label="Mobile Number" 
                  value={selectedVisitor.mobileNumber} 
                />
                <InfoItem 
                  icon={<Users className="w-4 h-4" />} 
                  label="Invited By" 
                  value={selectedVisitor.invitedBy} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Building2 className="w-5 h-5" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoItem 
                  icon={<Building2 className="w-4 h-4" />} 
                  label="Company Name" 
                  value={selectedVisitor.companyName} 
                />
                <InfoItem 
                  icon={<Briefcase className="w-4 h-4" />} 
                  label="Classification" 
                  value={selectedVisitor.classification} 
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="w-5 h-5" />
                <span>Visit Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2 md:grid-cols-2">
                <InfoItem 
                  icon={<Calendar className="w-4 h-4" />} 
                  label="Visit Date" 
                  value={formatDate(selectedVisitor.chapterVisitDate)} 
                />
                <InfoItem 
                  icon={<Clock className="w-4 h-4" />} 
                  label="Arrival Time" 
                  value={formatTime(selectedVisitor.arrivalTime)} 
                />
              </div>
              
              <Separator className="my-3" />
              
              <div className="grid gap-2 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm font-medium">Feel Welcome</span>
                  {selectedVisitor.feelWelcome === "Yes" ? 
                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Yes</Badge> : 
                    selectedVisitor.feelWelcome === "No" ?
                    <Badge variant="destructive">No</Badge> :
                    <Badge variant="outline" className="text-gray-500">Not answered</Badge>
                  }
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm font-medium">Visited BNI Before</span>
                  {selectedVisitor.visitedBniBefore === "Yes" ? 
                    <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Yes</Badge> : 
                    selectedVisitor.visitedBniBefore === "No" ?
                    <Badge variant="destructive">No</Badge> :
                    <Badge variant="outline" className="text-gray-500">Not answered</Badge>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Information</span>
                </div>
                {getPaymentStatusBadge(!!selectedVisitor.paymentAcceptedMemberId)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem 
                  icon={<IndianRupee className="w-4 h-4" />} 
                  label="Amount" 
                  value={formatCurrency(selectedVisitor.paymentAmount)}
                  isHighlight={!!selectedVisitor.paymentAmount}
                />
                <InfoItem 
                  icon={<Calendar className="w-4 h-4" />} 
                  label="Payment Date" 
                  value={formatDate(selectedVisitor.paymentRecordedDate)} 
                />
                <InfoItem 
                  icon={<CreditCard className="w-4 h-4" />} 
                  label="Payment Method" 
                  value={selectedVisitor.paymentType} 
                />
                <InfoItem 
                  icon={<Users className="w-4 h-4" />} 
                  label="Accepted By" 
                  value={
                    selectedVisitor.paymentAcceptedMemberId 
                      ? `${selectedVisitor.paymentAcceptedByFirstName || ''} ${selectedVisitor.paymentAcceptedByLastName || ''}`.trim() || selectedVisitor.paymentAcceptedMemberId
                      : 'Pending'
                  } 
                />
              </div>

              {selectedVisitor.paymentImageLink && getSafeStringValue(selectedVisitor.paymentImageLink) && (
                <div className="space-y-3">
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <FileImage className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm font-medium">Payment Receipt</Label>
                  </div>
                  <div className="relative max-w-md">
                    <img 
                      src={getSafeStringValue(selectedVisitor.paymentImageLink)} 
                      alt="Payment Receipt" 
                      className="w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => window.open(getSafeStringValue(selectedVisitor.paymentImageLink), '_blank')}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Visitor Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedVisitor.feedbackScore && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Experience Rating</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < getSafeNumberValue(selectedVisitor.feedbackScore) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {getSafeNumberValue(selectedVisitor.feedbackScore)}/10
                    </Badge>
                  </div>
                </div>
              )}

              {selectedVisitor.feedbackComments && getSafeStringValue(selectedVisitor.feedbackComments) && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comments</Label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {getSafeStringValue(selectedVisitor.feedbackComments)}
                    </p>
                  </div>
                </div>
              )}

              {selectedVisitor.nextStep && getSafeStringValue(selectedVisitor.nextStep) && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Next Steps</Label>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {getSafeStringValue(selectedVisitor.nextStep)}
                    </p>
                  </div>
                </div>
              )}

              {selectedVisitor.referralGroup && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Referral Group Experience</Label>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {getSafeStringValue(selectedVisitor.referralGroupExperience) || 'No details provided'}
                    </p>
                  </div>
                </div>
              )}

              {!selectedVisitor.feedbackScore && 
               !getSafeStringValue(selectedVisitor.feedbackComments) && 
               !getSafeStringValue(selectedVisitor.nextStep) && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No feedback provided yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewVisitor;
