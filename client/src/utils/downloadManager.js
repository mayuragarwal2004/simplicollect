import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { toast } from 'react-toastify';

/**
 * Unified download utility for web and Capacitor environments
 * Handles file downloads with native file picker support on mobile/desktop apps
 */
export class DownloadManager {
  /**
   * Download a file with automatic platform detection
   * @param {Blob} blob - The file data as a Blob
   * @param {string} filename - The desired filename
   * @param {string} mimeType - MIME type of the file (optional)
   * @param {Object} options - Additional options
   * @param {boolean} options.showSuccessToast - Show success toast (default: true)
   * @param {boolean} options.allowShare - Allow sharing on native platforms (default: true)
   * @param {string} options.directory - Directory to save file in (Capacitor only)
   */
  static async downloadFile(blob, filename, mimeType = '', options = {}) {
    const {
      showSuccessToast = true,
      allowShare = true,
      directory = Directory.Documents,
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
      toast.error(`Failed to download ${filename}: ${error.message}`);
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
    const { showSuccessToast = true, allowShare = true, directory = Directory.Documents } = options;

    try {
      // Convert blob to base64
      const base64Data = await this.blobToBase64(blob);
      
      // Remove data:*;base64, prefix if present
      const cleanBase64 = base64Data.split(',')[1] || base64Data;

      // Try to write file to the device
      const result = await Filesystem.writeFile({
        path: filename,
        data: cleanBase64,
        directory: directory,
        encoding: Encoding.UTF8, // For text files, use UTF8. For binary files, this might need adjustment
      });

      if (showSuccessToast) {
        toast.success(`File saved: ${filename}`);
      }

      // Optionally show share dialog
      if (allowShare && await this.canShare()) {
        const shouldShare = await this.promptForShare(filename);
        if (shouldShare) {
          await this.shareFile(result.uri, filename, mimeType);
        }
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
   * Prompt user if they want to share the file (can be customized)
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
}

/**
 * Hook for easy integration with React components
 */
export const useDownload = () => {
  const downloadFile = async (blob, filename, mimeType, options) => {
    return await DownloadManager.downloadFile(blob, filename, mimeType, options);
  };

  const downloadExcel = async (blob, filename, options) => {
    return await DownloadManager.downloadExcel(blob, filename, options);
  };

  const downloadPDF = async (blob, filename, options) => {
    return await DownloadManager.downloadPDF(blob, filename, options);
  };

  const downloadCSV = async (blob, filename, options) => {
    return await DownloadManager.downloadCSV(blob, filename, options);
  };

  const downloadFromResponse = async (response, filename, options) => {
    return await DownloadManager.downloadFromResponse(response, filename, options);
  };

  return {
    downloadFile,
    downloadExcel,
    downloadPDF,
    downloadCSV,
    downloadFromResponse,
  };
};

export default DownloadManager;