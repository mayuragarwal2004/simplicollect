import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { axiosInstance } from '../utils/config';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Settings: React.FC = () => {
  const { chapterData, getChapterDetails, memberData } = useData();
  const [formValues, setFormValues] = useState(chapterData || {});
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (memberData?.chapterId) {
  //     getChapterDetails(memberData.chapterId);
  //   }
  // }, [memberData, getChapterDetails]);

  useEffect(() => {
    if (chapterData) {
      setFormValues(chapterData);
    }
  }, [chapterData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name!]: value });
  };

  const handleSave = async () => {
    if (!memberData?.chapterId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/api/chapter/${memberData.chapterId}`, formValues);
      alert('Chapter details updated successfully!');
    } catch (error) {
      console.error('Updating chapter details failed:', error);
      alert('Failed to update chapter details.');
    } finally {
      setLoading(false);
    }
  };

  if (!formValues) return <div>Loading...</div>;

  return (
    <div className="settings-form p-6">
      <h2 className="text-xl mb-4">Update Chapter Details</h2>
      <form className="space-y-4">
        <TextField
          label="Chapter Name"
          name="chapterName"
          value={formValues.chapterName || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Chapter Slug"
          name="chapterSlug"
          value={formValues.chapterSlug || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Region"
          name="region"
          value={formValues.region || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="City"
          name="city"
          value={formValues.city || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="State"
          name="state"
          value={formValues.state || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Country"
          name="country"
          value={formValues.country || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Meeting Periodicity</InputLabel>
          <Select
            name="meetingPeriodicity"
            value={formValues.meetingPeriodicity || ''}
            onChange={handleInputChange}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="fortnightly">Fortnightly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="bi-monthly">Bi-Monthly</MenuItem>
            <MenuItem value="quaterly">Quarterly</MenuItem>
            <MenuItem value="6-monthly">6-Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Visitor Per Meeting Fee"
          name="visitorPerMeetingFee"
          type="number"
          value={formValues.visitorPerMeetingFee || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Weekly Fee"
          name="weeklyFee"
          type="number"
          value={formValues.weeklyFee || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Monthly Fee"
          name="monthlyFee"
          type="number"
          value={formValues.monthlyFee || ''}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Quarterly Fee"
          name="quarterlyFee"
          type="number"
          value={formValues.quarterlyFee || ''}
          onChange={handleInputChange}
          fullWidth
        />
      </form>
      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
