import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const ReceiverForm = ({
  formData,
  setFormData,
  membersList,
  onSubmit,
  onCancel,
  isEditMode,
  receiverType,
}) => {
  const [enableReceiverFee, setEnableReceiverFee] = useState(false);
  const [dateError, setDateError] = useState('');

  // Check if receiver fee should be enabled based on existing data
  React.useEffect(() => {
    if (formData.receiverAmountType || formData.receiverAmount) {
      setEnableReceiverFee(true);
    }
  }, [formData.receiverAmountType, formData.receiverAmount]);

  // Validate dates whenever they change
  React.useEffect(() => {
    if (formData.enableDate && formData.disableDate) {
      const enableDate = new Date(formData.enableDate);
      const disableDate = new Date(formData.disableDate);
      
      if (disableDate < enableDate) {
        setDateError('Disable date cannot be before enable date');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  }, [formData.enableDate, formData.disableDate]);

  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'imageFile') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleReceiverFeeToggle = (checked) => {
    setEnableReceiverFee(checked);
    if (!checked) {
      // Clear receiver fee data when disabled
      setFormData((prev) => ({
        ...prev,
        receiverAmountType: '',
        receiverAmount: '',
      }));
    }
  };

  const isOnlineReceiver = receiverType === 'online';

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Check for date validation error
    if (dateError) {
      return; // Don't submit if there's a date error
    }
    
    onSubmit(e);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="memberId" className="text-sm font-medium">
              Member *
            </Label>
            <Select
              value={formData.memberId}
              onValueChange={(value) => handleSelectChange('memberId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {membersList.map((member) => (
                  <SelectItem key={member.memberId} value={member.memberId}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiverName" className="text-sm font-medium">
              {isOnlineReceiver ? 'QR Code Name' : 'Receiver Name'} *
            </Label>
            <Input
              id="receiverName"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleInputChange}
              placeholder={
                isOnlineReceiver ? 'Enter QR code name' : 'Enter receiver name'
              }
              required
            />
          </div>

          {isOnlineReceiver && (
            <>
              <div className="space-y-2">
                <Label htmlFor="imageFile" className="text-sm font-medium">
                  QR Code Image {!isEditMode && '*'}
                </Label>
                <Input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  onChange={handleInputChange}
                  accept="image/*"
                  required={!isEditMode}
                />
                {isEditMode && (
                  <p className="text-sm text-muted-foreground">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
            </>
          )}

          {/* Receiver Fee Settings Section - Available for both cash and online */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Set Receiver Fee Amount
                </Label>
                <p className="text-xs text-gray-600">
                  Configure if this receiver should charge a fee and how much
                </p>
              </div>
              <Switch
                checked={enableReceiverFee}
                onCheckedChange={handleReceiverFeeToggle}
              />
            </div>

            {enableReceiverFee && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="receiverAmountType"
                    className="text-sm font-medium"
                  >
                    Amount Type
                  </Label>
                  <Select
                    value={formData.receiverAmountType || ''}
                    onValueChange={(value) =>
                      handleSelectChange('receiverAmountType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lumpsum">Lumpsum</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.receiverAmountType === 'lumpsum' && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="receiverAmount"
                      className="text-sm font-medium"
                    >
                      Amount
                    </Label>
                    <Input
                      id="receiverAmount"
                      name="receiverAmount"
                      type="number"
                      value={formData.receiverAmount || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="Enter amount"
                    />
                  </div>
                )}

                {formData.receiverAmountType === 'percentage' && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="receiverAmount"
                      className="text-sm font-medium"
                    >
                      Percentage (%)
                    </Label>
                    <Input
                      id="receiverAmount"
                      name="receiverAmount"
                      type="number"
                      value={formData.receiverAmount || ''}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Enter percentage"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Receiver Fee Optional Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Optional Receiver Fee
                </Label>
                <p className="text-xs text-gray-600">
                  Allow members to choose whether to pay the receiver fee
                </p>
              </div>
              <Switch
                checked={formData.receiverFeeOptional || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange('receiverFeeOptional', checked)
                }
              />
            </div>

            {formData.receiverFeeOptional && (
              <div className="space-y-2">
                <Label
                  htmlFor="receiverFeeOptionalMessage"
                  className="text-sm font-medium"
                >
                  Optional Fee Message
                </Label>
                <p className="text-xs text-gray-600">
                  Enter the message to show when asking for optional fee...
                </p>
                <Textarea
                  id="receiverFeeOptionalMessage"
                  name="receiverFeeOptionalMessage"
                  value={formData.receiverFeeOptionalMessage || ''}
                  onChange={handleInputChange}
                  placeholder="Would you like to pay the receiver fee? (charges applicable)"
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  This message will be shown to members when they can choose to
                  pay the receiver fee
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enableDate" className="text-sm font-medium">
                Enable Date *
              </Label>
              <Input
                id="enableDate"
                name="enableDate"
                type="date"
                value={formData.enableDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disableDate" className="text-sm font-medium">
                Disable Date *
              </Label>
              <Input
                id="disableDate"
                name="disableDate"
                type="date"
                value={formData.disableDate}
                onChange={handleInputChange}
                min={formData.enableDate || undefined}
                className={dateError ? 'border-red-500 focus:border-red-500' : ''}
                required
              />
            </div>
          </div>

          {dateError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm">{dateError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!!dateError}>
              {isEditMode ? 'Update' : 'Add'} {isOnlineReceiver ? 'QR' : 'Cash'}{' '}
              Receiver
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReceiverForm;
