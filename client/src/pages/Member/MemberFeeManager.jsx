import React, { useState, useEffect } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PerMeetingAllowed from './MemberFeeManagerComponents/PerMeetingAllowed';
import PackageAllowed from './MemberFeeManagerComponents/PackageAllowed';

const MemberFeeManager = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [chapterMeetings, setChapterMeetings] = useState([]);
  const [packageData, setPackageData] = useState([]);

  const [chapterFeeConfig] = React.useState({
    isPerMeetingAllowed: true,
    isMonthlyAllowed: true,
    isQuarterlyAllowed: true,
  });

  // Fetch meetings data
  useEffect(() => {
    fetch('/api/meetings/meetings')
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Meetings:", data);
        setChapterMeetings(data);
      })
      .catch((error) => console.error("Error fetching meetings:", error));
  }, []);

  // Fetch packages data based on the selected tab's parentType
  useEffect(() => {
    let parentType = "";
    switch (tabValue) {
      case 0: // Per Meeting (no packages)
        return;
      case 1: // Monthly
        parentType = "Monthly";
        break;
      case 2: // Quarterly
        parentType = "Quarterly";
        break;
      default:
        return;
    }

    // Fetch packages by parentType
    fetch(`/api/packages/parent/${parentType}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Fetched ${parentType} Packages:`, data);
        setPackageData(data);
      })
      .catch((error) => console.error(`Error fetching ${parentType} packages:`, error));
  }, [tabValue]); // Re-fetch when tabValue changes

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
              chapterMeetings={chapterMeetings}
            />
          </CustomTabPanel>
        )}
        {chapterFeeConfig.isQuarterlyAllowed && (
          <CustomTabPanel value={tabValue} index={2}>
            <PackageAllowed
              packageData={packageData}
              parentType="Quarterly"
              chapterMeetings={chapterMeetings}
            />
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