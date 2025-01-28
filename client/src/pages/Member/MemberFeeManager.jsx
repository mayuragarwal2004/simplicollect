import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PerMeetingAllowed from './MemberFeeManagerComponents/PerMeetingAllowed';

const MemberFeeManager = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [chapterFeeConfig, setChapterFeeConfig] = React.useState({
    isPerMeetingAllowed: true,
    isMonthlyAllowed: true,
    isQuaterlyAllowed: true,
  });
  const [chapterMeetings, setChapterMeetings] = React.useState([
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi',
      meetingDate: '2025-01-03',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: true,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi',
      meetingDate: '2025-01-10',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi',
      meetingDate: '2025-01-17',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi',
      meetingDate: '2025-01-24',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi',
      meetingDate: '2025-01-31',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
    },
  ]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Per Meeting" {...a11yProps(0)} />
            <Tab label="Monthly" {...a11yProps(1)} />
            <Tab label="Quaterly" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <PerMeetingAllowed chapterMeetings={chapterMeetings} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          Monthly
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          Quaterly
        </CustomTabPanel>
      </Box>
    </div>
  );
};

function CustomTabPanel(props) {
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default MemberFeeManager;
