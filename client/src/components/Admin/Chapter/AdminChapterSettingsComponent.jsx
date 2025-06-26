import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-toastify';
import { axiosInstance } from '@/utils/config';
import { useParams } from 'react-router-dom';

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
const platformFeeTypeOptions = ['Lumpsum', 'Percentage'];
const platformFeeCaseOptions = ['per-payment', 'per-member'];

const AdminChapterSettingsComponent = () => {
  const { chapterSlug } = useParams();
  const [chapter, setChapter] = useState(null);
  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [flushLoading, setFlushLoading] = useState(false);

  useEffect(() => {
    if (chapterSlug) fetchChapter();
    // eslint-disable-next-line
  }, [chapterSlug]);

  const fetchChapter = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/admin/chapters/slug/${chapterSlug}`,
      );
      setChapter(res.data);
      setForm(res.data);
    } catch (error) {
      toast.error('Failed to fetch chapter details');
    }
  };

  const handleEdit = (field) => setEditField(field);
  const handleCancel = () => {
    setForm(chapter);
    setEditField(null);
  };
  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async (field) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/api/chapter/${chapter.chapterId}`, {
        [field]: form[field],
      });
      setChapter((prev) => ({ ...prev, [field]: form[field] }));
      setEditField(null);
      toast.success('Chapter updated');
    } catch (error) {
      toast.error('Failed to update chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleFlush = async () => {
    if (
      !window.confirm(
        'Are you sure you want to flush all transactions for this chapter? This cannot be undone.',
      )
    )
      return;
    setFlushLoading(true);
    try {
      await axiosInstance.delete(
        `/api/admin/chapters/${chapter.chapterId}/flush-transactions`,
      );
      toast.success('All transactions flushed for this chapter.');
    } catch (error) {
      toast.error('Failed to flush transactions');
    } finally {
      setFlushLoading(false);
    }
  };

  if (!chapter) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Chapter Settings</h2>
      {Object.entries({
        chapterName: 'Chapter Name',
        chapterSlug: 'Slug',
        meetingPeriodicity: 'Meeting Periodicity',
        meetingPaymentType: 'Meeting Payment Type',
        meetingDay: 'Meeting Day',
        visitorPerMeetingFee: 'Visitor Fee',
        weeklyFee: 'Weekly Fee',
        monthlyFee: 'Monthly Fee',
        quarterlyFee: 'Quarterly Fee',
        platformFee: 'Platform Fee',
        platformFeeType: 'Platform Fee Type',
        platformFeeCase: 'Platform Fee Case',
        testMode: 'Test Mode',
        country: 'Country',
        state: 'State',
        city: 'City',
      }).map(([field, label]) => (
        <div key={field} className="flex items-center gap-4">
          <div className="w-48 font-medium">{label}</div>
          {editField === field ? (
            <>
              {field === 'meetingPeriodicity' ? (
                <Select
                  value={form[field]}
                  onValueChange={(val) => handleChange(field, val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periodicityOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field === 'meetingPaymentType' ? (
                <Select
                  value={form[field]}
                  onValueChange={(val) => handleChange(field, val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field === 'platformFeeType' ? (
                <Select
                  value={form[field]}
                  onValueChange={(val) => handleChange(field, val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platformFeeTypeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field === 'platformFeeCase' ? (
                <Select
                  value={form[field]}
                  onValueChange={(val) => handleChange(field, val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platformFeeCaseOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field === 'testMode' ? (
                <Switch
                  checked={!!form[field]}
                  onCheckedChange={(val) => handleChange(field, val)}
                />
              ) : (
                <Input
                  value={form[field] ?? ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              )}
              <Button
                size="sm"
                className="ml-2"
                onClick={() => handleSave(field)}
                disabled={loading}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="ml-2"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <span className="flex-1">{String(chapter[field] ?? '')}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(field)}
              >
                Edit
              </Button>
            </>
          )}
        </div>
      ))}
      <div className="mt-8">
        <Button
          variant="destructive"
          onClick={handleFlush}
          disabled={flushLoading}
        >
          {flushLoading ? 'Flushing...' : 'Flush All Transactions'}
        </Button>
      </div>
    </div>
  );
};

export default AdminChapterSettingsComponent;
