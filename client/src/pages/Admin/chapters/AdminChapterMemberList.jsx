import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import AdminChaptersMemberList from '../../../components/Admin/Chapter/AdminChaptersMemberList';

const AdminChapterMemberList = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          // { name: 'Members', link: `/admin/${chapterSlug}/Members` },   ////// check this breadcrumb
        ]}
      />
      <AdminChaptersMemberList />   // check


      this is member chapter list
    </>
  );
};

export default AdminChapterMemberList;
