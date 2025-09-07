import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import AdminChaptersClusters from '../../../components/Admin/Chapter/clusters/AdminChaptersClusters';
import { useParams } from 'react-router-dom';

const AdminChaptersClustersPage = () => {
  const { chapterSlug } = useParams();

  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: `Chapter `, link: `/admin/chapters` },
          {
            name: `Chapter Clusters`,
            link: `/admin/chapters/${chapterSlug}/clusters`,
          },
        ]}
      />
      <AdminChaptersClusters />
    </>
  );
};

export default AdminChaptersClustersPage;
