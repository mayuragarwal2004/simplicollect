
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import MyLedgerComponent from '@/components/member/MyLedger/MyLedgerComponent';

const MyLedger = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { name: 'Dashboard', link: '/member' },
          { name: 'My Ledger', link: '/member/my-ledger' },
        ]}
      />
      <MyLedgerComponent />
    </>
  );
};

export default MyLedger;
