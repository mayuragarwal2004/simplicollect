import React, { useEffect } from 'react';
import { axiosInstance } from '../../../utils/config';

const ReportA = () => {
  const [memberPackageSummary, setMemberPackageSummary] = useState([]);
  const { chapterData } = useData();

  const getMemeberPackageSummary = () => {
    // get member package summary
    axiosInstance
      .get(`report/${chapterData.chapterId}/package-summary`)
      .then((res) => {
        setMemberPackageSummary(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMemeberPackageSummary();
  });

  console.log(memberPackageSummary);
  

  return <div></div>;
};

export default ReportA;
