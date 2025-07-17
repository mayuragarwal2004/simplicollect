import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import { useData } from '../../context/DataContext';
import CoverOne from '../images/cover/cover-01.png';
import userSix from '../images/user/user-06.png';
import { Link } from 'react-router-dom';
import UserMetaCard from '../../components/member/Profile/UserMetaCard';
import UserInfoCard from '../../components/member/Profile/UserInfoCard';
import PushNotificationSettings from '../../components/PushNotificationSettings';

const Profile = () => {
  const { chapterData, memberData } = useData();
  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <PushNotificationSettings />
        </div>
      </div>
    </>
  );
};

export default Profile;
