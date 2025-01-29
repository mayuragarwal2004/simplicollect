import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PerMeetingAllowed from './MemberFeeManagerComponents/PerMeetingAllowed';
import PackageAllowed from './MemberFeeManagerComponents/PackageAllowed';

const MemberFeeManager = () => {
  const [tabValue, setTabValue] = React.useState(0);

  // Configuration for fee types
  const [chapterFeeConfig] = React.useState({
    isPerMeetingAllowed: true,
    isMonthlyAllowed: true,
    isQuarterlyAllowed: true,
  });

  // Meeting fee data
  const [chapterMeetings] = React.useState([
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
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi',
      meetingDate: '2025-01-17',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi',
      meetingDate: '2025-01-24',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi',
      meetingDate: '2025-01-31',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
  ]);

  // Package data
  const [packageData] = React.useState([
    {
      packageId: 1,
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      packageName: 'January',
      packageParent: 'Monthly',
      packageFeeType: 'Default',
      packageFeeAmount: 2500,
      packagePayableStartDate: '2025-01-01',
      packagePayableEndDate: '2025-01-10',
      allowAfterEndDate: true,
      allowPenaltyPayableAfterEndDate: true,
      penaltyType: 'Weekly',
      penaltyAmount: 500,
      penaltyFrequency: 'Per',
      discountType: 'Weekly',
      discountAmount: 300,
      discountFrequency: 'Per',
      discountEndDate: '2025-01-10',
    },
    {
      packageId: 2,
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      packageName: 'February',
      packageParent: 'Monthly',
      packageFeeType: 'Default',
      packageFeeAmount: 2000,
      packagePayableStartDate: '2025-02-01',
      packagePayableEndDate: '2025-02-14',
      allowAfterEndDate: true,
      allowPenaltyPayableAfterEndDate: true,
      penaltyType: 'Monthly',
      penaltyAmount: 400,
      penaltyFrequency: 'Twice',
      discountType: 'Daily',
      discountAmount: 20,
      discountFrequency: 'Twice',
      discountEndDate: '2025-02-14',
    },
    {
      packageId: 3,
      startDate: '2025-03-01',
      endDate: '2025-03-31',
      packageName: 'March',
      packageParent: 'Monthly',
      packageFeeType: 'Default',
      packageFeeAmount: 2500,
      packagePayableStartDate: '2025-03-01',
      packagePayableEndDate: '2025-03-14',
      allowAfterEndDate: true,
      allowPenaltyPayableAfterEndDate: true,
      penaltyType: 'Meetingly',
      penaltyAmount: 300,
      penaltyFrequency: 'Thrice',
      discountType: 'Meetingly',
      discountAmount: 500,
      discountFrequency: 'Per',
      discountEndDate: '2025-03-14',
    },
    {
      packageId: 4,
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      packageName: 'January-March',
      packageParent: 'Quarterly',
      packageFeeType: 'Amount',
      packageFeeAmount: 6500,
      packagePayableStartDate: '2025-01-01',
      packagePayableEndDate: '2025-01-25',
      allowAfterEndDate: false,
      allowPenaltyPayableAfterEndDate: false,
      penaltyType: 'Daily',
      penaltyAmount: 100,
      penaltyFrequency: 'Per',
      discountType: 'Daily',
      discountAmount: 100,
      discountFrequency: 'Per',
      discountEndDate: '2025-01-31',
    },
    {
      packageId: 5,
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      packageName: 'May',
      packageParent: 'Monthly',
      packageFeeType: 'Default',
      packageFeeAmount: 2000,
      packagePayableStartDate: '2025-05-01',
      packagePayableEndDate: '2025-02-14',
      allowAfterEndDate: true,
      allowPenaltyPayableAfterEndDate: true,
      penaltyType: 'Weekly',
      penaltyAmount: 50,
      penaltyFrequency: 'Twice',
      discountType: 'Weekly',
      discountAmount: 50,
      discountFrequency: 'Twice',
      discountEndDate: '2025-02-14',
    },
  ]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="fee tabs">
            {chapterFeeConfig.isPerMeetingAllowed && <Tab label="Per Meeting" />}
            {chapterFeeConfig.isMonthlyAllowed && <Tab label="Monthly" />}
            {chapterFeeConfig.isQuarterlyAllowed && <Tab label="Quarterly" />}
          </Tabs>
        </Box>
        {chapterFeeConfig.isPerMeetingAllowed && (
          <CustomTabPanel value={tabValue} index={0}>
            <PerMeetingAllowed chapterMeetings={chapterMeetings} />
          </CustomTabPanel>
        )}
        {chapterFeeConfig.isMonthlyAllowed && (
          <CustomTabPanel value={tabValue} index={1}>
          <PackageAllowed
            packageData={packageData}
            parentType="Monthly"
            chapterMeetings={chapterMeetings} // Pass chapterMeetings
          />
        </CustomTabPanel>
        )}
        {chapterFeeConfig.isQuarterlyAllowed && (
          <CustomTabPanel value={tabValue} index={2}>
            <PackageAllowed packageData={packageData} parentType="Quarterly" chapterMeetings={chapterMeetings} />
          </CustomTabPanel>
        )}
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

export default MemberFeeManager;
