import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ClusterDetails from '../../../components/Admin/Chapter/clusters/ClusterDetails';
import { useParams } from 'react-router-dom';

const AdminChapterClusterDetailsPage = () => {
  const { chapterSlug, clusterId } = useParams();

  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: 'Chapter', link: `/admin/chapters` },
          { name: 'Chapter Clusters', link: `/admin/chapters/${chapterSlug}/clusters` },
          {
            name: 'Cluster Details',
            link: `/admin/chapters/${chapterSlug}/clusters/${clusterId}`,
          },
        ]}
      />
      <ClusterDetails />
    </>
  );
};

export default AdminChapterClusterDetailsPage;
