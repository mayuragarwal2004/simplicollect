import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

// --- Zod Schema ---
const chapterSchema = z.object({
  chapterName: z.string().min(1, 'Chapter name is required'),
  chapterSlug: z.string().min(1, 'Slug is required'),
  meetingPeriodicity: z.enum([
    'weekly',
    'fortnightly',
    'monthly',
    'bi-monthly',
    'quarterly',
    '6-monthly',
    'yearly',
  ]),
  meetingPaymentType: z.enum(['weekly', 'monthly', 'quarterly']),
  meetingDay: z.string().min(1, 'Meeting day is required'),
  visitorPerMeetingFee: z.coerce.number().min(0, 'Fee must be non-negative'),
  weeklyFee: z.coerce.number().min(0),
  monthlyFee: z.coerce.number().min(0),
  quarterlyFee: z.coerce.number().min(0),
  platformFee: z.coerce.number().min(0),
  platformFeeType: z.string().min(1),
  platformFeeCase: z.string().min(1),
  testMode: z.boolean(),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
});

// --- Options ---
const periodicityOptions = [
  'weekly',
  'fortnightly',
  'monthly',
  'bi-monthly',
  'quarterly',
  '6-monthly',
  'yearly',
];
const paymentTypeOptions = ['weekly', 'monthly', 'quarterly'];

function ChapterBasicDetails({ onNext, onCancel }) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // --- Location States ---
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // --- Form Setup ---
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      chapterName: '',
      chapterSlug: '',
      meetingPeriodicity: 'weekly',
      meetingPaymentType: 'weekly',
      visitorPerMeetingFee: 0,
      meetingDay: '',
      weeklyFee: 0,
      monthlyFee: 0,
      quarterlyFee: 0,
      platformFee: 0,
      platformFeeType: '',
      platformFeeCase: '',
      testMode: false,
      country: '',
      state: '',
      city: '',
    },
  });

  const selectedCountry = watch('country');
  const selectedState = watch('state');

  // Fetch countries on mount
  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/positions') // You can switch API as needed
      .then((res) => res.json())
      .then((data) => setCountries(data.data.map((c) => c.name)))
      .catch((err) => console.error('Error fetching countries:', err));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry }),
      })
        .then((res) => res.json())
        .then((data) => setStates(data.data.states.map((s) => s.name)))
        .catch((err) => console.error('Error fetching states:', err));
    }
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry,
          state: selectedState,
        }),
      })
        .then((res) => res.json())
        .then((data) => setCities(data.data))
        .catch((err) => console.error('Error fetching cities:', err));
    }
  }, [selectedState]);

  const onSubmit = (data) => {
    console.log('Validated Data:', data);
    onNext(data);
  };

  const isClosed = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleCancel = () => {
    onCancel();
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={isClosed}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enter Chapter’s Basic Details</DialogTitle>
          <DialogDescription>
            Fill in the details accurately to create a new chapter.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Chapter Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Chapter Name</label>
              <Input {...register('chapterName')} />
              {errors.chapterName && (
                <p className="text-red-500 text-sm">
                  {errors.chapterName.message}
                </p>
              )}
            </div>
            <div>
              <label>Slug</label>
              <Input {...register('chapterSlug')} />
              {errors.chapterSlug && (
                <p className="text-red-500 text-sm">
                  {errors.chapterSlug.message}
                </p>
              )}
            </div>
          </div>

          {/* Meeting Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Meeting Periodicity</label>
              <Select
                onValueChange={(val) => setValue('meetingPeriodicity', val)}
                defaultValue="weekly"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select periodicity" />
                </SelectTrigger>
                <SelectContent>
                  {periodicityOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.meetingPeriodicity && (
                <p className="text-red-500 text-sm">
                  {errors.meetingPeriodicity.message}
                </p>
              )}
            </div>

            <div>
              <label>Meeting Payment Type</label>
              <Select
                onValueChange={(val) => setValue('meetingPaymentType', val)}
                defaultValue="weekly"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.meetingPaymentType && (
                <p className="text-red-500 text-sm">
                  {errors.meetingPaymentType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Visitor Fee</label>
              <Input type="number" {...register('visitorPerMeetingFee')} />
              {errors.visitorPerMeetingFee && (
                <p className="text-red-500 text-sm">
                  {errors.visitorPerMeetingFee.message}
                </p>
              )}
            </div>
            <div>
              <label>Meeting Day</label>
              <Input {...register('meetingDay')} />
              {errors.meetingDay && (
                <p className="text-red-500 text-sm">
                  {errors.meetingDay.message}
                </p>
              )}
            </div>
          </div>

          {/* Fees */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Weekly Fee</label>
              <Input type="number" {...register('weeklyFee')} />
            </div>
            <div>
              <label>Monthly Fee</label>
              <Input type="number" {...register('monthlyFee')} />
            </div>
            <div>
              <label>Quarterly Fee</label>
              <Input type="number" {...register('quarterlyFee')} />
            </div>
          </div>

          {/* Platform Fee */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Platform Fee</label>
              <Input type="number" {...register('platformFee')} />
            </div>
            <div>
              {/* keep a select with options between "lumpsum" or "periodically" */}
              <label>Platform Fee Type</label>
              <Select
                onValueChange={(val) => setValue('platformFeeType', val)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Lumpsum">Lumpsum</SelectItem>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
              {errors.platformFeeType && (
                <p className="text-red-500 text-sm">
                  {errors.platformFeeType.message}
                </p>
              )}
            </div>
            <div>
              <label>Platform Fee Case</label>
              {/* keep a select with options between "lumpsum" or "periodically" */}
              <Select
                onValueChange={(val) => setValue('platformFeeCase', val)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per-payment">Per Payment</SelectItem>
                  <SelectItem value="per-member" disabled>Per Member</SelectItem>
                </SelectContent>
              </Select>
              {errors.platformFeeCase && (
                <p className="text-red-500 text-sm">
                  {errors.platformFeeCase.message}
                </p>
              )}
            </div>
          </div>

          {/* Location Selection */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Country</label>
              <Select
                onValueChange={(val) => setValue('country', val)}
                value={selectedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>
            <div>
              <label>State</label>
              <Select
                onValueChange={(val) => setValue('state', val)}
                value={selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
            <div>
              <label>City</label>
              <Select onValueChange={(val) => setValue('city', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
          </div>
          <div>
            {/* Test Mode Switch */}
            <div className="flex items-center space-x-2">
              <Controller
                name="testMode"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="test-mode"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label
                htmlFor="test-mode"
                className="text-sm font-medium text-gray-700"
              >
                Test Mode
              </label>
            </div>
            {errors.testMode && (
              <p className="text-red-500 text-sm">{errors.testMode.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Chapter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChapterBasicDetails;
