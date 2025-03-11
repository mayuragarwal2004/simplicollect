import React from 'react';
import OrganisationTableData from '../../../components/Admin/Organisations/OrganisationTableData';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const AdminOrganisationsTablePage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: 'Organisations', link: '/admin/organisations' },
        ]}
      />
      <OrganisationTableData />
    </>
  );
};

export default AdminOrganisationsTablePage;
