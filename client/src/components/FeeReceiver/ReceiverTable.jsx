import React from 'react';
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
import { Edit, Trash2, QrCode, Banknote } from 'lucide-react';

const ReceiverTable = ({
  receivers,
  receiverType,
  onEdit,
  onDelete,
  amountCollected
}) => {
  const isOnlineReceiver = receiverType === 'online';

  const getAmountCollectedForReceiver = (receiverId) => {
    const collected = amountCollected.find(item => item.receiverId === receiverId);
    return collected ? parseFloat(collected.totalAmountCollected || 0).toFixed(2) : '0.00';
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
              <TableHead>Member ID</TableHead>
              {isOnlineReceiver && (
                <>
                  <TableHead>QR Image</TableHead>
                  <TableHead>Amount Type</TableHead>
                  <TableHead>Amount</TableHead>
                </>
              )}
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
                  {receiver.memberId}
                </TableCell>
                {isOnlineReceiver && (
                  <>
                    <TableCell>
                      {receiver.qrImageLink ? (
                        <img
                          src={receiver.qrImageLink}
                          alt="QR Code"
                          className="h-12 w-12 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                          <QrCode className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
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
                              Variable
                            </Badge>
                          )
                          : (
                            <span className="text-muted-foreground">Not set</span>
                          )
                      }
                    </TableCell>
                  </>
                )}
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
    </Card>
  );
};

export default ReceiverTable;
