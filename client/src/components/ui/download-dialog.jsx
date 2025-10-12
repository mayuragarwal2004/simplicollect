import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Folder,
  HardDrive
} from 'lucide-react';

export const DownloadSuccessDialog = ({ 
  isOpen, 
  onClose, 
  filename, 
  onShare
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare();
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
      onClose();
    }
  };

  const getFileIcon = () => {
    if (!filename) {
      return <FileText className="h-8 w-8 text-gray-600" />;
    }
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'xlsx':
      case 'xls':
        return <FileText className="h-8 w-8 text-green-600" />;
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />;
      case 'csv':
        return <FileText className="h-8 w-8 text-blue-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] rounded-2xl sm:rounded-xl p-0 gap-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="text-center p-6 pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-lg font-semibold">
            File Saved Successfully!
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Your file has been saved. What would you like to do next?
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="flex items-start gap-3 rounded-xl border p-4 bg-muted/50">
            <div className="flex-shrink-0 mt-0.5">
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium break-words">
                {filename || 'File'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                File saved to device storage
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 flex-col gap-3">
          {/* Primary Action - Share */}
          <Button 
            variant="default"
            onClick={handleShare}
            disabled={isSharing}
            className="w-full h-12 rounded-xl text-base font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {isSharing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sharing...
              </>
            ) : (
              <>
                <Share className="mr-2 h-4 w-4" />
                Share File
              </>
            )}
          </Button>
          
          <Button 
            onClick={onClose} 
            variant="ghost"
            className="w-full h-12 rounded-xl text-base font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            disabled={isSharing}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

