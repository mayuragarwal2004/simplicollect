import React from 'react';
import AdminMembersTableData from '../../../components/Admin/Members/AdminMembersTableData';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const AdminMembersTablePage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: 'Members', link: '/admin/members' },
        ]}
      />
      <AdminMembersTableData  />
    </>
  );
};

export default AdminMembersTablePage;
