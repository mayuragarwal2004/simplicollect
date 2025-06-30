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
import { Download, Upload, X } from 'lucide-react';
import { useParams } from 'react-router-dom';

function AddMemberBulkDialog({ isAddDialogOpen, onClose, fetchMembers }) {
  const [fileName, setFileName] = useState('');
  const [validationErrors, setValidationErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { chapterSlug } = useParams();
  const fileInputRef = useRef(null);

  const handleOpenAddDialog = () => {
    setFileName('');
    setValidationErrors(null);
  };

  const handleDownloadSample = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/chapters/${chapterSlug}/bulk-members-add-get-template`,
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
    setValidationErrors(null); // Reset errors when new file is selected
    toast.success(`Selected file: ${file.name}`);
  };

  const handleValidateExcelUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select an Excel file to validate.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axiosInstance.post(
        `/api/admin/chapters/${chapterSlug}/bulk-members-add-check-format`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob',
          validateStatus: () => true, // allow handling all status codes
        }
      );

      if (response.status === 200) {
        toast.success('Excel file validated successfully.');
      } else {
        // Only if status is not 200, provide the file for download
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'validation_result.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.error('Validation failed. Please check the downloaded file for details.');
      }
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

    setIsLoading(true);
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axiosInstance.post(
        `/api/admin/chapters/${chapterSlug}/add-bulk-members`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          validateStatus: () => true, // allow handling all status codes
        }
      );

      if (response.status === 200) {
        toast.success('Members added successfully!');
        setFileName('');
        setValidationErrors(null);
        onClose();
        fetchMembers();
      } else {
        // If submission failed with validation errors
        setValidationErrors(response.data.errorDetails);
        toast.error('Submission failed. Please fix the errors below.');
      }
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrorSection = (title, errors) => {
    if (!errors || errors.length === 0) return null;

    return (
      <div className="mt-4">
        <h4 className="font-medium text-red-600">{title}</h4>
        <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="text-sm text-red-500">
              {error.message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Super Admin Member Table</h2>
      <Dialog open={isAddDialogOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
          <Button onClick={handleOpenAddDialog}>Add Bulk Member</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add Bulk Member
            </DialogTitle>
            {validationErrors && (
              <button
                onClick={() => setValidationErrors(null)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </DialogHeader>

          {!validationErrors ? (
            <>
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
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handleValidateExcelUpload}
                  disabled={isLoading}
                >
                  {isLoading ? 'Validating...' : 'Validate'}
                </Button>
                <Button 
                  onClick={handleSubmitExcelFile}
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="mt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800">
                  Validation Errors Found
                </h3>
                <p className="text-sm text-red-600 mt-1">
                  Please fix the following errors in your Excel file and try again.
                </p>

                {renderErrorSection('Duplicate Emails', validationErrors.duplicateEmail)}
                {renderErrorSection('Duplicate Phone Numbers', validationErrors.duplicatePhoneNumber)}
                {renderErrorSection('Missing First Names', validationErrors.noFirstName)}
                {renderErrorSection('Missing Contact Info', validationErrors.noPhoneAndEmail)}
                {renderErrorSection('Invalid Role Names', validationErrors.invalidRoleName)}
                {renderErrorSection('Missing Join Dates', validationErrors.noJoinDate)}
                {renderErrorSection('Missing Last Names', validationErrors.noLastName)}

                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setValidationErrors(null)}
                >
                  Back to Upload
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddMemberBulkDialog;