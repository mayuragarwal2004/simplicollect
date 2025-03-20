import React from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import AcceptChapterPayment from '../../../components/member/FeeReceiver/AcceptChapterPayment';

const AcceptChapterPaymentPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/admin' },
          { name: 'Chapters', link: '/admin/chapters' },
        ]}
      />
      <AcceptChapterPayment />
    </>
  );
};

export default AcceptChapterPaymentPage;
