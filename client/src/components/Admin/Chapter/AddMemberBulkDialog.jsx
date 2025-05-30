import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../utils/config';
import { Download, Upload } from 'lucide-react';

function AddMemberBulkDialog({ isAddDialogOpen, onClose, fetchMembers }) {
  const [fileName, setFileName] = useState('');
  //   const [isDialogOpen, setIsDialogOpen] = useState(false);
  //   const [editingMember, setEditingMember] = useState(null);
  //   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fileInputRef = useRef(null);
  const handleOpenAddDialog = () => {
    setFormData({
      membersName: '',
      email: '',
      phoneNumber: '',
      numberOfMembers: '',
    });
  };

  const handleDownloadSample = async () => {
    try {
      const response = await axiosInstance.get(
        '/api/admin/members/download-template',
        {
          responseType: 'blob',
        },
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'members_template.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to download the Excel template.');
      console.error('Template download error:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    if (!isExcel) {
      toast.error('Only Excel files (.xlsx, .xls) are allowed.');
      setFileName('');
      return;
    }

    setFileName(file.name);
    toast.success(`Selected file: ${file.name}`);
  };

  const handleValidateExcelUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select an Excel file to validate.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.post('/api/admin/members/validate-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Excel file validated successfully.');
    } catch (error) {
      toast.error('Validation failed. Please check the file contents.');
      console.error('Validation error:', error);
    }
  };

  const handleSubmitExcelFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select an Excel file to submit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.post('/api/admin/members/submit-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Excel data submitted successfully.');
      setFileName('');
      onClose(); // Only this is needed to close the dialog
      fetchMembers();
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Super Admin Member Table</h2>
      <Dialog open={isAddDialogOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
          <Button onClick={handleOpenAddDialog}>Add Bulk Member</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add Bulk Member
            </DialogTitle>
          </DialogHeader>

          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
            <li>Download the template</li>
            <li>Edit the template carefully</li>
            <li>Upload the completed file</li>
          </ul>

          <Button
            onClick={handleDownloadSample}
            variant="outline"
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Excel template
          </Button>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 mt-4 text-center cursor-pointer hover:bg-gray-50"
          >
            <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {fileName ? `Selected: ${fileName}` : 'No file chosen'}
            </p>
            <Input
              type="file"
              accept=".xlsx, xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={handleValidateExcelUpload}>
              Validate
            </Button>
            <Button onClick={handleSubmitExcelFile}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddMemberBulkDialog;
