import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import AdminChaptersPage from '../../../components/Admin/Chapter/AdminChaptersPage';

const AdminChaptersTablePage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: 'Chapters', link: '/admin/chapters' },
        ]}
      />
      <AdminChaptersPage />
    </>
  );
};

export default AdminChaptersTablePage;
