import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const ReceiverForm = ({
  formData,
  setFormData,
  membersList,
  onSubmit,
  onCancel,
  isEditMode,
  receiverType
}) => {
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isOnlineReceiver = receiverType === 'online';

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
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
              placeholder={isOnlineReceiver ? 'Enter QR code name' : 'Enter receiver name'}
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

              <div className="space-y-2">
                <Label htmlFor="receiverAmountType" className="text-sm font-medium">
                  Amount Type
                </Label>
                <Select
                  value={formData.receiverAmountType || ''}
                  onValueChange={(value) => handleSelectChange('receiverAmountType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select amount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.receiverAmountType === 'fixed' && (
                <div className="space-y-2">
                  <Label htmlFor="receiverAmount" className="text-sm font-medium">
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
            </>
          )}

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
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? 'Update' : 'Add'} {isOnlineReceiver ? 'QR' : 'Cash'} Receiver
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReceiverForm;
