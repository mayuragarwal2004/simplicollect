import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ClustersManagement from '../../../components/Admin/Chapter/clusters/ClustersManagement';
import { useParams } from 'react-router-dom';

const AdminChapterClustersManagePage = () => {
  const { chapterSlug } = useParams();

  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: 'Chapter', link: `/admin/chapters` },
          { name: 'Chapter Clusters', link: `/admin/chapters/${chapterSlug}/clusters` },
          {
            name: 'Manage Clusters',
            link: `/admin/chapters/${chapterSlug}/clusters/manage`,
          },
        ]}
      />
      <ClustersManagement />
    </>
  );
};

export default AdminChapterClustersManagePage;
