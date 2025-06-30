import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import AdminChapterSettingsComponent from '../../../components/Admin/Chapter/AdminChapterSettingsComponent';
import { useParams } from 'react-router-dom';

const AdminChapterSettings = () => {
  const { chapterSlug } = useParams();

  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: `Chapter `, link: `/admin/chapters` },
          {
            name: `Chapter Settings`,
            link: `/admin/chapters/${chapterSlug}/settings`,
          },
        ]}
      />
      <AdminChapterSettingsComponent />
    </>
  );
};

export default AdminChapterSettings;
