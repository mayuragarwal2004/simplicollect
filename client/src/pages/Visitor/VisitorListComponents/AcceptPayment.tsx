import React, { useState } from 'react';
import { Visitor } from '../../../models/Visitor';
import { Button, IconButton } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';

interface AcceptPaymentProps {
  setBackDropOpen: (open: boolean) => void;
  selectedVisitor: Visitor;
  fetchVisitors: () => void;
}

const AcceptPayment: React.FC<AcceptPaymentProps> = ({
  setBackDropOpen,
  selectedVisitor,
  fetchVisitors,
}) => {
  const { chapterData } = useData();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(
    selectedVisitor.paymentAmount || chapterData?.visitorPerMeetingFee || 0,
  );

  console.log(chapterData);

  const markAsPaid = async () => {
    setLoading(true);
    var imageURL = '';
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);
      try {
        const response = await axiosInstance.post(
          '/api/image-upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        imageURL = response.data.imageUrl;
      } catch (error) {
        setError('An error occurred, please try again');
        setLoading(false);
        return;
      }
    }

    try {
      await axiosInstance.post('/api/visitor/mark-as-paid', {
        visitorId: selectedVisitor.visitorId,
        paymentImageLink: imageURL,
        paymentAmount: selectedVisitor.paymentAmount || 0,
      });
      setBackDropOpen(false);
      fetchVisitors();
    } catch (error) {
      setError('An error occurred, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black p-5 rounded dark:bg-boxdark">
      <h1 className="font-medium text-black dark:text-white">
        Accept payment for {selectedVisitor.firstName}{' '}
        {selectedVisitor.lastName}
      </h1>
      <div className="mt-4 mb-4 relative">
        {selectedVisitor.paymentRecordedDate && (
          <p className="text-gray-500">
            Payment recorded on{' '}
            {new Date(selectedVisitor.paymentRecordedDate).toLocaleDateString()}
          </p>
        )}
        {selectedVisitor.paymentImageLink && (
          <img
            src={selectedVisitor.paymentImageLink}
            alt="payment"
            className="w-full h-full object-cover max-w-xs max-h-xs"
          />
        )}
        {!selectedVisitor.paymentImageLink &&
          (selectedImage ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="selected"
                className="w-full h-full object-cover max-w-xs max-h-xs"
              />
              <IconButton
                className="absolute top-0 right-0"
                onClick={() => setSelectedImage(null)}
                sx={{ position: 'absolute', top: 0, right: 0 }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          ) : (
            <label
              htmlFor="upload-photo"
              className="flex flex-col p-2 items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-500"
            >
              <span className="text-gray-500">
                Click to select or drag and drop image here
              </span>
              <input
                type="file"
                id="upload-photo"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedImage(e.target.files[0]);
                    console.log(e.target.files[0]);
                  }
                }}
              />
            </label>
          ))}
      </div>

      <input
        type="number"
        placeholder="Payment amount"
        className="w-full p-2 mb-2 border border-gray-400 rounded-lg"
        value={paymentAmount}
        disabled
        onChange={(e) => setPaymentAmount(Number(e.target.value))}
      />
      <Button
        color="success"
        variant="contained"
        endIcon={<DoneAllIcon />}
        onClick={markAsPaid}
        disabled={loading}
      >
        Mark as paid
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AcceptPayment;
