import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { QRCodeCanvas } from 'qrcode.react';

const ShareForm: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { chapterData } = useData();
  const protocol = window.location.protocol;
  const link = `${protocol}//${window.location.host}/eoi/${chapterData?.chapterSlug}`;
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'QRCode.png';
      a.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold text-center">Share your form</h1>
      <p className="text-center text-gray-500 mt-3">
        Share your form with others by sending them the link below
      </p>
      <div className="flex items-center justify-center mt-8">
        <div className="w-full rounded-lg border-[1.5px] py-3 px-5 text-black outline-none transition dark:text-white border-stroke bg-transparent focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
          {link}
        </div>
        <button
          className="ml-3 bg-primary text-white py-3 px-6 rounded-lg transition hover:bg-primary-dark"
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-8" ref={qrRef}>
        <QRCodeCanvas value={link} size={128} />
      </div>
      <button
        className="mt-4 bg-primary text-white py-2 px-4 rounded-lg transition hover:bg-primary-dark"
        onClick={handleDownload}
      >
        Download QR Code
      </button>
    </div>
  );
};

export default ShareForm;
