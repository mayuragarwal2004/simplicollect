import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';

const AdminChapterDashboardPage = () => {
  const { chapterSlug } = useParams();

  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: `Chapter `, link: `/admin/chapters` },
          {
            name: `Chapter Dashboard`,
            link: `/admin/chapters/${chapterSlug}/dashboard`,
          },
        ]}
      />
      {/* show comming soon */}
      <div className="text-center my-8">
        <h2 className="text-2xl font-bold">Coming Soon!</h2>
        <p className="text-gray-600">This feature is under development.</p>
      </div>
    </>
  );
};

export default AdminChapterDashboardPage;
