import React from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { toast } from 'react-toastify';

// Import plugins safely with better error handling
let Browser = null;

try {
  const BrowserModule = require('@capacitor/browser');
  Browser = BrowserModule.Browser;
} catch (error) { 
  console.warn('Browser plugin not available - will use fallback methods:', error);
}

/**
 * Unified download utility for web and Capacitor environments
 * Handles file downloads with native file picker support on mobile/desktop apps
 * 
 * Default directory behavior:
 * - ExternalStorage: Most Downloads-like behavior (Android external storage, iOS Documents)
 * - Fallback to Documents on newer Android versions where ExternalStorage is restricted
 * - Web: Uses browser's default download location
 */
export class DownloadManager {
  /**
   * Get the recommended directory for downloads based on platform capabilities
   * @returns {string} Recommended directory constant
   */
  static getRecommendedDirectory() {
    return Directory.ExternalStorage; // Falls back to Documents automatically if not available
  }
  /**
   * Download a file with automatic platform detection
   * @param {Blob} blob - The file data as a Blob
   * @param {string} filename - The desired filename
   * @param {string} mimeType - MIME type of the file (optional)
   * @param {Object} options - Additional options
   * @param {boolean} options.showSuccessToast - Show success toast (default: true)
   * @param {boolean} options.allowShare - Allow sharing on native platforms (default: true)
   * @param {string} options.directory - Directory to save file in (Capacitor only, default: ExternalStorage with Documents fallback)
   */
  static async downloadFile(blob, filename, mimeType = '', options = {}) {
    const {
      showSuccessToast = true,
      allowShare = true,
      directory = Directory.ExternalStorage, // Changed to ExternalStorage for better Downloads-like behavior
    } = options;

    try {
      if (Capacitor.isNativePlatform()) {
        return await this.downloadNative(blob, filename, mimeType, {
          showSuccessToast,
          allowShare,
          directory,
        });
      } else {
        return await this.downloadWeb(blob, filename, showSuccessToast);
      }
    } catch (error) {
      console.error('Download failed:', error);
      let errorMessage = error.message;
      
      // Add more context to common errors
      if (error.message?.includes('Missing parent directory')) {
        errorMessage = 'Could not create download directory. Please check your storage permissions.';
      } else if (error.message?.includes('Permission denied')) {
        errorMessage = 'Storage permission denied. Please check your app settings.';
      } else if (error.message?.includes('No available space')) {
        errorMessage = 'Not enough storage space available.';
      }
      
      toast.error(`Failed to download ${filename}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Download file in web browser
   */
  static async downloadWeb(blob, filename, showSuccessToast = true) {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);

      if (showSuccessToast) {
        toast.success(`File downloaded: ${filename}`);
      }

      return { success: true, path: filename };
    } catch (error) {
      throw new Error(`Web download failed: ${error.message}`);
    }
  }

  /**
   * Download file in Capacitor native environment
   */
  static async downloadNative(blob, filename, mimeType, options = {}) {
    const { showSuccessToast = true, allowShare = true, directory = Directory.ExternalStorage } = options;

    try {
      // Convert blob to base64
      const base64Data = await this.blobToBase64(blob);
      
      // Remove data:*;base64, prefix if present
      const cleanBase64 = base64Data.split(',')[1] || base64Data;

      // Try primary directory first, fallback to Documents if needed
      let targetDirectory = directory;
      let result;
      
      // Determine if this is a binary file based on MIME type
      const isBinaryFile = this.isBinaryFile(mimeType);
      const encoding = isBinaryFile ? undefined : Encoding.UTF8;

      try {
        // Create a subdirectory for our downloads if it doesn't exist
        const downloadDir = 'SimpliCollect Downloads';
        try {
          await Filesystem.mkdir({
            path: downloadDir,
            directory: targetDirectory,
            recursive: true
          });
        } catch (mkdirError) {
          // Ignore if directory already exists
          if (!mkdirError.message?.includes('exists')) {
            console.warn('Could not create download directory:', mkdirError);
          }
        }

        // Write file to the downloads subdirectory
        result = await Filesystem.writeFile({
          path: `${downloadDir}/${filename}`,
          data: cleanBase64,
          directory: targetDirectory,
          encoding: encoding,
          recursive: true
        });
      } catch (error) {
        // If ExternalStorage fails (Android 10+), fallback to Documents
        if (targetDirectory === Directory.ExternalStorage) {
          console.warn('ExternalStorage not available, falling back to Documents directory');
          targetDirectory = Directory.Documents;
          
          // Try again with Documents directory
          try {
            await Filesystem.mkdir({
              path: 'SimpliCollect Downloads',
              directory: targetDirectory,
              recursive: true
            });
          } catch (mkdirError) {
            // Ignore if directory already exists
            if (!mkdirError.message?.includes('exists')) {
              console.warn('Could not create download directory:', mkdirError);
            }
          }

          result = await Filesystem.writeFile({
            path: `SimpliCollect Downloads/${filename}`,
            data: cleanBase64,
            directory: targetDirectory,
            encoding: encoding,
            recursive: true
          });
        } else {
          throw error;
        }
      }

      if (showSuccessToast) {
        toast.success(`File saved: ${filename}`);
      }

      // Return success with dialog prompt info for React components
      if (allowShare && await this.canShare()) {
        return { 
          success: true, 
          path: result.uri,
          showDownloadDialog: true,
          filename,
          shareCallback: () => this.shareFile(result.uri, filename, mimeType)
        };
      }

      return { success: true, path: result.uri };
    } catch (error) {
      // Fallback: try to share the file if saving fails
      if (allowShare && await this.canShare()) {
        try {
          const base64Data = await this.blobToBase64(blob);
          await Share.share({
            title: 'Download File',
            text: `Download ${filename}`,
            url: base64Data,
            dialogTitle: 'Save or Share File',
          });

          if (showSuccessToast) {
            toast.success(`File shared: ${filename}`);
          }

          return { success: true, path: 'shared', method: 'share' };
        } catch (shareError) {
          throw new Error(`Native download and share failed: ${error.message}`);
        }
      } else {
        throw new Error(`Native download failed: ${error.message}`);
      }
    }
  }

  /**
   * Convert Blob to base64 string
   */
  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Check if sharing is available
   */
  static async canShare() {
    try {
      const result = await Share.canShare();
      return result.value;
    } catch {
      return false;
    }
  }

  /**
   * Determine if a file is binary based on MIME type
   */
  static isBinaryFile(mimeType) {
    const binaryMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
      'application/vnd.ms-excel', // Excel (legacy)
      'application/pdf', // PDF
      'image/', // All images
      'video/', // All videos
      'audio/', // All audio
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
    ];
    
    return binaryMimeTypes.some(type => 
      mimeType.toLowerCase().startsWith(type.toLowerCase())
    );
  }

  // Removed formatFileUrlForNativeOpen as it's no longer needed

  /**
   * Share file using native share dialog
   */
  static async shareFile(uri, filename, mimeType) {
    await Share.share({
      title: 'Share File',
      text: `Share ${filename}`,
      url: uri,
      dialogTitle: 'Share or Save File',
    });
  }

  /**
   * Prompt user with modern dialog for download options
   */
  static async promptForDownloadAction(filename, shareCallback, saveToLocationCallback) {
    return new Promise((resolve) => {
      // This will be handled by the React component
      // Return a function that can be called by the component
      resolve({
        showDialog: true,
        filename,
        onShare: shareCallback,
        onSaveToLocation: saveToLocationCallback
      });
    });
  }

  /**
   * Legacy prompt method - kept for backward compatibility
   * @deprecated Use promptForDownloadAction instead
   */
  static async promptForShare(filename) {
    return new Promise((resolve) => {
      const result = window.confirm(
        `File saved successfully! Would you like to share "${filename}" or save it to another location?`
      );
      resolve(result);
    });
  }

  /**
   * Enhanced download for Excel files specifically
   */
  static async downloadExcel(blob, filename, options = {}) {
    const excelFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    return await this.downloadFile(blob, excelFilename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', options);
  }

  /**
   * Enhanced download for PDF files specifically
   */
  static async downloadPDF(blob, filename, options = {}) {
    const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    return await this.downloadFile(blob, pdfFilename, 'application/pdf', options);
  }

  /**
   * Enhanced download for CSV files specifically
   */
  static async downloadCSV(blob, filename, options = {}) {
    const csvFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    return await this.downloadFile(blob, csvFilename, 'text/csv', options);
  }

  /**
   * Download file from API response
   * @param {Response} response - Axios response with blob data
   * @param {string} filename - Filename for download
   * @param {Object} options - Additional options
   */
  static async downloadFromResponse(response, filename, options = {}) {
    if (response.status !== 200) {
      throw new Error(`Server returned status ${response.status}`);
    }

    // Extract content type from response headers
    const contentType = response.headers['content-type'] || '';
    
    // Create blob from response data
    const blob = new Blob([response.data], { type: contentType });
    
    return await this.downloadFile(blob, filename, contentType, options);
  }

  // Removed openFile and openNativeFile methods as we're using Share-only functionality
}

/**
 * Hook for easy integration with React components
 * Includes dialog state management
 */
export const useDownload = () => {
  const [downloadDialogState, setDownloadDialogState] = React.useState({
    isOpen: false,
    filename: '',
    shareCallback: null
  });

  const downloadFile = async (blob, filename, mimeType, options) => {
    const result = await DownloadManager.downloadFile(blob, filename, mimeType, options);
    
    if (result.showDownloadDialog) {
      setDownloadDialogState({
        isOpen: true,
        filename: result.filename,
        shareCallback: result.shareCallback
      });
    }
    
    return result;
  };

  const downloadExcel = async (blob, filename, options) => {
    return await downloadFile(blob, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', options);
  };

  const downloadPDF = async (blob, filename, options) => {
    return await downloadFile(blob, filename, 'application/pdf', options);
  };

  const downloadCSV = async (blob, filename, options) => {
    return await downloadFile(blob, filename, 'text/csv', options);
  };

  const downloadFromResponse = async (response, filename, options) => {
    const result = await DownloadManager.downloadFromResponse(response, filename, options);
    
    if (result.showDownloadDialog) {
      setDownloadDialogState({
        isOpen: true,
        filename: result.filename,
        shareCallback: result.shareCallback
      });
    }
    
    return result;
  };

  const closeDownloadDialog = () => {
    setDownloadDialogState({
      isOpen: false,
      filename: '',
      shareCallback: null
    });
  };

  return {
    downloadFile,
    downloadExcel,
    downloadPDF,
    downloadCSV,
    downloadFromResponse,
    downloadDialogState,
    closeDownloadDialog,
  };
};

export default DownloadManager;