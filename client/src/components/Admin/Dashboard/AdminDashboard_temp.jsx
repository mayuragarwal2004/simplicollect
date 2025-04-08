import CardsSummary from './components/CardsSummary';
import RecentTransactions from './components/RecentTransactions';
import PaymentModeDistribution from './components/PaymentModeDistribution';
import CollectionTrend from './components/CollectionTrend';
import MemberStatusSummary from './components/MemberStatusSummary';

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Top 4 Summary Cards Row */}
      <CardsSummary />

      {/* Middle Section: Transactions + Payment Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-2">
        <PaymentModeDistribution />
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
  <div className="lg:col-span-3">
    <CollectionTrend />
  </div>

  {/* Wrap the right side (status summary) in a full-height container */}
  <div className="lg:col-span-2 flex flex-col h-full">
    <MemberStatusSummary />
  </div>
</div>

    </div>
  );
};

export default AdminDashboard;
