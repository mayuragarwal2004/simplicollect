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
import { axiosInstance } from '../../../utils/config';
import { toast } from 'react-toastify';

const cashReceiverSchema = z
  .object({
    memberId: z.string().min(1, 'Member is required'),
    enableDate: z.string().min(1, 'Enable date is required'),
    disableDate: z.string().min(1, 'Disable date is required'),
  })
  .refine((data) => new Date(data.disableDate) > new Date(data.enableDate), {
    message: 'Disable date must be greater than enable date',
    path: ['disableDate'],
  });

const AddCashReceiver = ({
  isModalOpen,
  handleModalClose,
  membersList,
  fetchCashReceivers,
  chapterData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cashReceiverSchema),
    defaultValues: {
      memberId: '',
      enableDate: '',
      disableDate: '',
    },
  });

  const handleCashSubmit = async (data) => {
    try {
      console.log('Submitted Data:', data);

      const member = membersList.find((m) => m.memberId === data.memberId);
      if (!member) {
        console.error('Member not found');
        return;
      }

      const response = await axiosInstance.post(
        `/api/feeReciever/cash/${chapterData.chapterId}`,
        {
          ...data,
          cashRecieverName: `${member.firstName} ${member.lastName}`,
        },
      );

      if (response.status !== 200) {
        toast.error('Failed to add cash receiver');
        return;
      }

      setValue('memberId', '');
      setValue('enableDate', '');
      setValue('disableDate', '');

      fetchCashReceivers();
      handleModalClose();
    } catch (error) {
      toast.error('Failed to add cash receiver');
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogTrigger />
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="text-lg font-medium mb-4">Add New Cash Receiver New</h2>
        <form onSubmit={handleSubmit(handleCashSubmit)}>
          <div className="mb-4">
            <Label>Receiver Name</Label>
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

          <div className="mb-4">
            <Label>Enable Date</Label>
            <Input type="date" {...register('enableDate')} />
            {errors.enableDate && (
              <p className="text-red-500 text-sm">
                {errors.enableDate.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <Label>Disable Date</Label>
            <Input type="date" {...register('disableDate')} />
            {errors.disableDate && (
              <p className="text-red-500 text-sm">
                {errors.disableDate.message}
              </p>
            )}
          </div>

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

export default AddCashReceiver;
