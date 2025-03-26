import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
import { UploadIcon, IndianRupee, Percent } from 'lucide-react';
import { axiosInstance } from '../../../utils/config';
import { toast } from 'react-toastify';

const onlineReceiverSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
  qrCodeName: z.string().min(1, 'QR Name is required'),
  imageFile: z.any(),
  enableDate: z.string().min(1, 'Enable date is required'),
  disableDate: z.string().min(1, 'Disable date is required'),
  receiverAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  receiverAmountType: z.enum(['Lumpsum', 'Percentage']),
});

const AddOnlineReceiver = ({
  isModalOpen,
  handleModalClose,
  membersList,
  fetchOnlineReceivers,
  chapterData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onlineReceiverSchema),
    defaultValues: {
      memberId: '',
      qrCodeName: '',
      imageFile: null,
      enableDate: '',
      disableDate: '',
      receiverAmount: '',
      receiverAmountType: 'Lumpsum',
    },
  });

  const [amountType, setAmountType] = useState('Lumpsum');

  const handleOnlineSubmit = async (data) => {
    try {
      console.log('Submitted Data:', data);

      // Upload the QR Code image first
      const formData = new FormData();
      formData.append('image', data.imageFile[0]);
      formData.append('folderName', 'memberQRCodes');

      const uploadResponse = await axiosInstance.post(
        '/api/image-upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const imageLink = uploadResponse.data.imageUrl;

      // Find member details
      const member = membersList.find((m) => m.memberId === data.memberId);
      if (!member) {
        console.error('Member not found');
        return;
      }

      // Submit the online receiver data
      const response = await axiosInstance.post(
        `/api/feeReciever/qr/${chapterData.chapterId}`,
        {
          ...data,
          qrImageLink: imageLink,
          imageFile: undefined, // Remove imageFile from request payload
          cashRecieverName: `${member.firstName} ${member.lastName}`,
        },
      );

      if (response.status === 200) {
        toast.success('Online receiver added successfully');

        // reset the form
        setValue('memberId', '');
        setValue('qrCodeName', '');
        setValue('imageFile', null);
        setValue('enableDate', '');
        setValue('disableDate', '');
        setValue('receiverAmount', '');
        setValue('receiverAmountType', 'Lumpsum');

        fetchOnlineReceivers();
        handleModalClose();
      }
    } catch (error) {
      toast.error('Failed to add online receiver');
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogTrigger />
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="text-lg font-medium mb-4">Add Online Receiver</h2>
        <form
          onSubmit={handleSubmit(handleOnlineSubmit)}
          encType="multipart/form-data"
        >
          {/* Member Name */}
          <div className="mb-4">
            <Label>Member Name</Label>
            <Select onValueChange={(value) => setValue('memberId', value)}>
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
            {errors.memberId && (
              <p className="text-red-500 text-sm">{errors.memberId.message}</p>
            )}
          </div>

          {/* QR Name */}
          <div className="mb-4">
            <Label>QR Name</Label>
            <Input type="text" {...register('qrCodeName')} />
            {errors.qrCodeName && (
              <p className="text-red-500 text-sm">
                {errors.qrCodeName.message}
              </p>
            )}
          </div>

          {/* QR Code Image Upload */}
          <div className="mb-4">
            <Label>QR Code Image</Label>
            <Input type="file" {...register('imageFile')} />
            {errors.imageFile && (
              <p className="text-red-500 text-sm">{errors.imageFile.message}</p>
            )}
          </div>

          {/* Enable Date */}
          <div className="mb-4">
            <Label>Enable Date</Label>
            <Input type="date" {...register('enableDate')} />
            {errors.enableDate && (
              <p className="text-red-500 text-sm">
                {errors.enableDate.message}
              </p>
            )}
          </div>

          {/* Disable Date */}
          <div className="mb-4">
            <Label>Disable Date</Label>
            <Input type="date" {...register('disableDate')} />
            {errors.disableDate && (
              <p className="text-red-500 text-sm">
                {errors.disableDate.message}
              </p>
            )}
          </div>

          {/* Receiver Amount + Icon Toggle */}
          <div className="mb-4">
            <Label>Receiver Amount</Label>
            <div className="relative">
              <Input type="text" {...register('receiverAmount')} />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                {amountType === 'Lumpsum' ? (
                  <IndianRupee size={18} />
                ) : (
                  <Percent size={18} />
                )}
              </div>
            </div>
            {errors.receiverAmount && (
              <p className="text-red-500 text-sm">
                {errors.receiverAmount.message}
              </p>
            )}
          </div>

          {/* Receiver Amount Type */}
          <div className="mb-4">
            <Label>Receiver Amount Type</Label>
            <Select
              onValueChange={(value) => {
                setValue('receiverAmountType', value);
                setAmountType(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Amount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lumpsum">Lumpsum</SelectItem>
                <SelectItem value="Percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
            {errors.receiverAmountType && (
              <p className="text-red-500 text-sm">
                {errors.receiverAmountType.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleModalClose}>
              Close
            </Button>
            <Button type="submit" className="mr-2">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOnlineReceiver;
