import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import PackageViewer from '../../../components/member/Package/PackageViewer';
import { PaymentDataProvider } from '../../../components/member/Package/PaymentDataContext';

const PackageViewerPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/member' },
          { name: 'Packages', link: '/member/packages' },
        ]}
      />
      <PaymentDataProvider>
        <PackageViewer />
      </PaymentDataProvider>
    </>
  );
};

export default PackageViewerPage;
