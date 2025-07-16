import { useState } from 'react';
import { toast } from 'react-toastify';
import { axiosInstance } from '../utils/config';

export const useFeeReceiverApi = (chapterId) => {
  const [loading, setLoading] = useState(false);

  // Fetch all receivers (both cash and online)
  const fetchAllReceivers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/feeReceiver/${chapterId}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch fee receivers');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch receivers by type
  const fetchReceiversByType = async (type) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/feeReceiver/${chapterId}?type=${type}`);
      return response.data;
    } catch (error) {
      toast.error(`Failed to fetch ${type} receivers`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add receiver
  const addReceiver = async (receiverData, imageFile = null) => {
    setLoading(true);
    try {
      let qrImageLink = null;

      // Upload image if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('folderName', 'memberQRCodes');

        const uploadResponse = await axiosInstance.post('/api/image-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        qrImageLink = uploadResponse.data.imageUrl;
      }

      // Add receiver
      const payload = {
        ...receiverData,
        ...(qrImageLink && { qrImageLink }),
      };

      const response = await axiosInstance.post(`/api/feeReceiver/${chapterId}`, payload);
      toast.success(`${receiverData.paymentType === 'cash' ? 'Cash' : 'QR'} receiver added successfully`);
      return response.data;
    } catch (error) {
      toast.error('Failed to add receiver');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update receiver
  const updateReceiver = async (receiverId, receiverData, imageFile = null) => {
    setLoading(true);
    try {
      let qrImageLink = receiverData.qrImageLink; // Keep existing image by default

      // Upload new image if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('folderName', 'memberQRCodes');

        const uploadResponse = await axiosInstance.post('/api/image-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        qrImageLink = uploadResponse.data.imageUrl;
      }

      // Update receiver
      const payload = {
        ...receiverData,
        qrImageLink,
      };

      const response = await axiosInstance.put(`/api/feeReceiver/${chapterId}/${receiverId}`, payload);
      toast.success(`${receiverData.paymentType === 'cash' ? 'Cash' : 'QR'} receiver updated successfully`);
      return response.data;
    } catch (error) {
      toast.error('Failed to update receiver');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete receiver
  const deleteReceiver = async (receiverId, paymentType) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/api/feeReceiver/${chapterId}/${receiverId}?paymentType=${paymentType}`
      );
      toast.success(`${paymentType === 'cash' ? 'Cash' : 'QR'} receiver deleted successfully`);
      return response.data;
    } catch (error) {
      toast.error('Failed to delete receiver');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch amount collected
  const fetchAmountCollected = async () => {
    try {
      const response = await axiosInstance.get(`/api/feeReceiver/amount-collected/${chapterId}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch amount collected');
      throw error;
    }
  };

  // Fetch current receivers
  const fetchCurrentReceivers = async (date) => {
    try {
      const response = await axiosInstance.get(
        `/api/feeReceiver/current/${chapterId}?date=${date}`
      );
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch current receivers');
      throw error;
    }
  };

  return {
    loading,
    fetchAllReceivers,
    fetchReceiversByType,
    addReceiver,
    updateReceiver,
    deleteReceiver,
    fetchAmountCollected,
    fetchCurrentReceivers,
  };
};
