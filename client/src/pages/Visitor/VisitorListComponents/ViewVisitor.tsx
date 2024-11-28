import React from 'react';

import { Visitor } from '../../../models/Visitor';
import { Button } from '@mui/material';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface ViewVisitorProps {
  setBackDropOpen: (open: boolean) => void;
  selectedVisitor: Visitor;
  fetchVisitors: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    className: 'dark:text-white',
  };
}

const ViewVisitor: React.FC<ViewVisitorProps> = ({
  setBackDropOpen,
  selectedVisitor,
  fetchVisitors,
}) => {
  const [value, setValue] = React.useState(0);
  console.log('hi');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="bg-white text-black p-5 rounded dark:bg-boxdark">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Details" {...a11yProps(0)} />
          {/* <Tab label="Feedback" {...a11yProps(1)} /> */}
          <Tab label="Payment" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                First Name
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.firstName}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                Last Name
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.lastName}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                Email
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.email}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                Phone Number
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.mobileNumber}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                Invited By
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.invitedBy}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                Company Name
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.companyName}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                Classification
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.classification}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                Industry
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.industry}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                How Heard About BNI
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {selectedVisitor.heardAboutBni}
              </td>
            </tr>
          </tbody>
        </table>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* Payment */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Status: 
            <span className={selectedVisitor.paymentAcceptedMemberId ? 'text-green-500' : 'text-red-500'}>
              {selectedVisitor.paymentAcceptedMemberId ? 'Paid' : 'Unpaid'}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            Amount: {selectedVisitor.paymentAmount || 'Not Available'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            Date: {selectedVisitor.paymentRecordedDate ? new Date(selectedVisitor.paymentRecordedDate).toLocaleDateString() : 'Not Available'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            Mode: {selectedVisitor.paymentType || 'Not Available'}
          </div>

          {selectedVisitor.paymentImageLink && (
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Image: 
              <img src={selectedVisitor.paymentImageLink} alt="Payment" className="mt-2 rounded shadow-md" />
            </div>
          )}
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Feedback
      </CustomTabPanel>
    </div>
  );
};

export default ViewVisitor;
