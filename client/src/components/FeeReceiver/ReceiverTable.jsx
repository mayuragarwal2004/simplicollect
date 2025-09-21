import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit, Trash2, QrCode, Banknote, X } from 'lucide-react';

const ReceiverTable = ({
  receivers,
  receiverType,
  onEdit,
  onDelete,
  amountCollected
}) => {
  const isOnlineReceiver = receiverType === 'online';
  const [imagePreview, setImagePreview] = useState({ open: false, src: '', receiverName: '' });

  const getAmountCollectedForReceiver = (receiverId) => {
    const collected = amountCollected.find(item => item.receiverId === receiverId);
    return collected ? parseFloat(collected.totalAmountCollected || 0).toFixed(2) : '0.00';
  };

  const handleImageClick = (src, receiverName) => {
    setImagePreview({ open: true, src, receiverName });
  };

  const closeImagePreview = () => {
    setImagePreview({ open: false, src: '', receiverName: '' });
  };

  if (!receivers || receivers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            {isOnlineReceiver ? (
              <QrCode className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Banknote className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">No receivers found</h3>
          <p className="text-muted-foreground">
            No {isOnlineReceiver ? 'QR' : 'cash'} receivers have been added yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receiver Name</TableHead>
              <TableHead>Member Name</TableHead>
              {isOnlineReceiver && (
                <TableHead>QR Image</TableHead>
              )}
              <TableHead>Amount Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Optional Fee</TableHead>
              <TableHead>Enable Date</TableHead>
              <TableHead>Disable Date</TableHead>
              <TableHead>Amount Collected</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receivers.map((receiver) => (
              <TableRow key={receiver.receiverId}>
                <TableCell className="font-medium">
                  {receiver.receiverName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {receiver.memberName}
                </TableCell>
                {isOnlineReceiver && (
                  <TableCell>
                    {receiver.qrImageLink ? (
                      <img
                        src={receiver.qrImageLink}
                        alt="QR Code"
                        className="h-12 w-12 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(receiver.qrImageLink, receiver.receiverName)}
                        title="Click to view full size"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                        <QrCode className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  {receiver.receiverAmountType ? (
                    <Badge variant="secondary" className="capitalize">
                      {receiver.receiverAmountType}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </TableCell>
                <TableCell>
                  {receiver.receiverAmountType === 'lumpsum' 
                    ? (
                      <Badge variant="outline">
                        ₹{receiver.receiverAmount || 0}
                      </Badge>
                    )
                    : receiver.receiverAmountType === 'percentage' 
                      ? (
                        <Badge variant="outline">
                          {receiver.receiverAmount || 0}%
                        </Badge>
                      )
                      : (
                        <span className="text-muted-foreground">Not set</span>
                      )
                  }
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={receiver.receiverFeeOptional ? "default" : "secondary"}
                    className={receiver.receiverFeeOptional ? "bg-green-100 text-green-800" : ""}
                  >
                    {receiver.receiverFeeOptional ? 'Optional' : 'Required'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(receiver.enableDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(receiver.disableDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    ₹{getAmountCollectedForReceiver(receiver.receiverId)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(receiver)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(receiver.receiverId, receiverType)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Image Preview Dialog */}
      <Dialog open={imagePreview.open} onOpenChange={closeImagePreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code - {imagePreview.receiverName}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={imagePreview.src}
              alt="QR Code Preview"
              className="max-w-full max-h-96 object-contain rounded-lg border"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReceiverTable;
