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
      meetingName: 'Meeting 1',
      meetingId: 'svijnvi1',
      meetingDate: '2025-01-03',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingName: 'Meeting 2',
      meetingId: 'svijnvi2',
      meetingDate: '2025-01-10',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    // Add more meetings as needed
    {
      chapterId: 'ijoivedvs',
      meetingName: 'Meeting 3',
      meetingId: 'svijnvi3',
      meetingDate: '2025-01-17',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi4',
      meetingName: 'Meeting 4',
      meetingDate: '2025-01-24',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi5',
      meetingName: 'Meeting 5',
      meetingDate: '2025-01-31',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },

    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi6',
      meetingName: 'Meeting 6',
      meetingDate: '2025-02-07',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi7',
      meetingName: 'Meeting 7',
      meetingDate: '2025-02-14',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi8',
      meetingName: 'Meeting 8',
      meetingDate: '2025-02-21',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi9',
      meetingName: 'Meeting 9',
      meetingDate: '2025-02-28',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },

    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi10',
      meetingName: 'Meeting 10',
      meetingDate: '2025-03-07',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi11',
      meetingName: 'Meeting 11',
      meetingDate: '2025-03-14',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi12',
      meetingName: 'Meeting 12',
      meetingDate: '2025-03-21',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi13',
      meetingName: 'Meeting 13',
      meetingDate: '2025-03-28',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },

    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi14',
      meetingName: 'Meeting 14',
      meetingDate: '2025-04-04',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi15',
      meetingName: 'Meeting 15',
      meetingDate: '2025-04-11',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi16',
      meetingName: 'Meeting 16',
      meetingDate: '2025-04-18',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi17',
      meetingName: 'Meeting 17',
      meetingDate: '2025-04-25',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },

    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi18',
      meetingName: 'Meeting 18',
      meetingDate: '2025-05-02',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi19',
      meetingName: 'Meeting 19',
      meetingDate: '2025-05-09',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi20',
      meetingName: 'Meeting 20',
      meetingDate: '2025-05-16',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi21',
      meetingName: 'Meeting 21',
      meetingDate: '2025-05-23',
      meetingTime: '10:00',
      meetingFeeMembers: 850,
      meetingFeeVisitors: 1000,
      isPaid: false,
    },
    {
      chapterId: 'ijoivedvs',
      meetingId: 'svijnvi22',
      meetingName: 'Meeting 22',
      meetingDate: '2025-05-30',
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
      packageName: 'January',
      packageParent: 'Monthly',
      packageFeeType: 'Default',
      packageFeeAmount: 2500,
      packagePayableStartDate: '2025-01-01',
      packagePayableEndDate: '2025-01-5',
      allowAfterEndDate: true,
      allowPenaltyPayableAfterEndDate: true,
      penaltyType: 'Weekly',
      penaltyAmount: 500,
      penaltyFrequency: 'Per',
      discountType: 'Weekly',
      discountAmount: 300,
      discountFrequency: 'Per',
      discountEndDate: '2025-01-10',
      allowPackagePurchaseIfFeesPaid: true, // New key
      meetingIds: ["svijnvi1", "svijnvi2", "svijnvi3", "svijnvi4", "svijnvi5"],
      isPaid: true,
    },
    {
      packageId: 2,
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
      allowPackagePurchaseIfFeesPaid: true, // New key
      meetingIds: ["svijnvi6", "svijnvi7", "svijnvi8", "svijnvi9"],
      isPaid: true,
    },
    {
      packageId: 3,
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
      allowPackagePurchaseIfFeesPaid: true, // New key
      meetingIds: ["svijnvi10", "svijnvi11", "svijnvi12", "svijnvi13"],
      isPaid: false,
    },
    {
      packageId: 4,
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
      allowPackagePurchaseIfFeesPaid: true, // New key
      meetingIds: ["svijnvi1", "svijnvi2", "svijnvi3", "svijnvi4", "svijnvi5", "svijnvi6", "svijnvi7", "svijnvi8", "svijnvi9", "svijnvi10", "svijnvi11", "svijnvi12", "svijnvi13", "svijnvi14", "svijnvi15", "svijnvi16", "svijnvi17", "svijnvi18", "svijnvi19", "svijnvi20", "svijnvi21", "svijnvi22"],
      isPaid: false,
    },
    {
      packageId: 5,
      packageName: 'May',
      packageParent: 'Monthly',
      packageFeeType: 'Default',
      packageFeeAmount: 2000,
      packagePayableStartDate: '2025-05-01',
      packagePayableEndDate: '2025-02-14',
      allowAfterEndDate: true,
      allowPenaltyPayableAfterEndDate: true,
      penaltyType: 'lumsum',
      penaltyAmount: 50,
      penaltyFrequency: 'Twice',
      discountType: 'lumsum',
      discountAmount: 50,
      discountFrequency: 'Twice',
      discountEndDate: '2025-02-14',
      allowPackagePurchaseIfFeesPaid: true, // New key
      meetingIds: ["svijnvi18", "svijnvi19", "svijnvi20", "svijnvi21", "svijnvi22"],
      isPaid: false,
    },
  ]);
  const uniqueParentTypes = [...new Set(packageData.map((pkg) => pkg.packageParent))];

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
