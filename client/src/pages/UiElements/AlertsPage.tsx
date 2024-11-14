import React from 'react';
import Alert from './Alerts';

const alertData: {
  type: 'warning' | 'success' | 'error';
  title: string;
  message: string;
}[] = [
  {
    type: 'warning',
    title: 'Attention needed',
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    type: 'success',
    title: 'Message Sent Successfully',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    type: 'error',
    title: 'There were errors with your submission',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
];

const AlertPage = () => {
  return (
    <div className="p-4">
      {alertData.map((alert, index) => (
        <Alert
          key={index}
          alert={{
            type: alert.type,
            title: alert.title,
            message: alert.message,
          }}
        />
      ))}
    </div>
  );
};

export default AlertPage;
