import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import AdminChaptersMemberList from '../../../components/Admin/Chapter/AdminChaptersMemberList';
import { useParams } from 'react-router-dom';

const AdminChapterMemberList = () => {
  const { chapterSlug } = useParams();

  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: `Chapter `, link: `/admin/chapters` }, 
          { name: `Chapter Members`, link: `/admin/chapters/${chapterSlug}/member` },   ////// check this breadcrumb
        ]}
      />
      <AdminChaptersMemberList />   // check


      this is member chapter list
    </>
  );
};

export default AdminChapterMemberList;
