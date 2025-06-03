
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import PackageDialogForm from './PackageDialogForm';

const AdminPackage = () => {
  const [date, setDate] = useState(null);
  const [memberFee, setMemberFee] = useState(0);
  const [visitorFee, setVisitorFee] = useState(0);
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState("weekly");
  const [stickyWindow, setStickyWindow] = useState(null); // null | 'add' | 'show'

  // Monthly packages (12 months)
  const [monthlyPackages, setMonthlyPackages] = useState(
    Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
      return {
        name: monthName,
        meetings: [],
        packagePayableStartDate: null,
        packagePayableEndDate: null,
        allowAfterEndDate: false,
        allowPenaltyPayableAfterEndDate: false,
        penaltyType: "",
        penaltyAmount: 0,
        penaltyFrequency: "",
        allowDiscount: false,
        discountType: "",
        discountAmount: 0,
        discountFrequency: "",
        discountEndDate: null,
        allowPackagePurchaseIfFeesPaid: false,
        packageAmount: 0,
      };
    })
  );

  // Quarterly packages (4 quarters)
  const [quarterlyPackages, setQuarterlyPackages] = useState(
    ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"].map(quarter => ({
      name: quarter,
      meetings: [],
      packagePayableStartDate: null,
      packagePayableEndDate: null,
      allowAfterEndDate: false,
      allowPenaltyPayableAfterEndDate: false,
      penaltyType: "",
      penaltyAmount: 0,
      penaltyFrequency: "",
      allowDiscount: false,
      discountType: "",
      discountAmount: 0,
      discountFrequency: "",
      discountEndDate: null,
      allowPackagePurchaseIfFeesPaid: false,
      packageAmount: 0,
    }))
  );

  // Weekly packages (each meeting is a package)
  const [weeklyPackages, setWeeklyPackages] = useState({});

  const addMeeting = () => {
    if (!date || memberFee <= 0) return;

    const newMeeting = {
      id: Date.now().toString(),
      date,
      memberFee,
      visitorFee,
    };

    setMeetings([...meetings, newMeeting]);

    // Update monthly package
    const month = date.toLocaleString('default', { month: 'long' });
    setMonthlyPackages(prev => prev.map(pkg => {
      if (pkg.name !== month) return pkg;
      return {
        ...pkg,
        meetings: [...pkg.meetings, newMeeting],
        packageAmount: (pkg.meetings.length + 1) * memberFee,
      };
    }));

    // Update quarterly package
    const quarter = getQuarterFromDate(date);
    setQuarterlyPackages(prev => prev.map(pkg => {
      if (pkg.name !== quarter) return pkg;
      return {
        ...pkg,
        meetings: [...pkg.meetings, newMeeting],
        packageAmount: (pkg.meetings.length + 1) * memberFee,
      };
    }));

    // Update weekly package (each meeting is its own package)
    const meetingKey = `Meeting-${newMeeting.id}`;
    setWeeklyPackages(prev => ({
      ...prev,
      [meetingKey]: {
        ...createEmptyPackage(),
        meetings: [newMeeting],
        packageAmount: memberFee,
      },
    }));

    // Reset form
    setDate(null);
    setMemberFee(0);
    setVisitorFee(0);
  };

  const getQuarterFromDate = (date) => {
    const month = date.getMonth();
    if (month <= 2) return "Q1 (Jan-Mar)";
    if (month <= 5) return "Q2 (Apr-Jun)";
    if (month <= 8) return "Q3 (Jul-Sep)";
    return "Q4 (Oct-Dec)";
  };

  const createEmptyPackage = () => ({
    meetings: [],
    packagePayableStartDate: null,
    packagePayableEndDate: null,
    allowAfterEndDate: false,
    allowPenaltyPayableAfterEndDate: false,
    penaltyType: "",
    penaltyAmount: 0,
    penaltyFrequency: "",
    allowDiscount: false,
    discountType: "",
    discountAmount: 0,
    discountFrequency: "",
    discountEndDate: null,
    allowPackagePurchaseIfFeesPaid: false,
    packageAmount: 0,
  });

  const handlePackageChange = (packageType, packageKey, field, value) => {
    if (packageType === 'monthly') {
      setMonthlyPackages(prev => prev.map(pkg => {
        if (pkg.name !== packageKey) return pkg;
        return { ...pkg, [field]: value };
      }));
    } else if (packageType === 'quarterly') {
      setQuarterlyPackages(prev => prev.map(pkg => {
        if (pkg.name !== packageKey) return pkg;
        return { ...pkg, [field]: value };
      }));
    } else {
      setWeeklyPackages(prev => ({
        ...prev,
        [packageKey]: {
          ...prev[packageKey],
          [field]: value,
        },
      }));
    }
  };

  const handleSubmit = () => {
    console.log({
      meetings,
      monthlyPackages,
      quarterlyPackages,
      weeklyPackages,
    });
    alert("Packages submitted successfully!");
  };

  const openAddMeeting = () => {
    setStickyWindow('add');
  };

  const openShowAll = () => {
    setStickyWindow('show');
  };

  const closeStickyWindow = () => {
    setStickyWindow(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Meeting Management</h1>

      {/* Action buttons (not in sticky window) */}
      <div className="flex gap-4 mb-6">
        <Button onClick={openAddMeeting} variant="outline">
          Add Meeting
        </Button>
        <Button onClick={openShowAll} variant="outline">
          Show All Meetings
        </Button>
      </div>

      {/* Sticky window (appears when buttons are clicked) */}
      {stickyWindow && (
        <div className="fixed right-4 top-4 z-10 w-80 bg-white border rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {stickyWindow === 'add' ? 'Add New Meeting' : 'All Meetings'}
              </h2>
              <Button 
                onClick={closeStickyWindow} 
                size="sm" 
                variant="ghost"
              >
                ×
              </Button>
            </div>

            {stickyWindow === 'add' ? (
              <div className="space-y-4">
                <div>
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <Label>Member Fee Amount</Label>
                  <Input
                    type="number"
                    value={memberFee}
                    onChange={(e) => setMemberFee(Number(e.target.value))}
                    placeholder="Enter member fee"
                  />
                </div>
                <div>
                  <Label>Visitor Fee Amount</Label>
                  <Input
                    type="number"
                    value={visitorFee}
                    onChange={(e) => setVisitorFee(Number(e.target.value))}
                    placeholder="Enter visitor fee"
                  />
                </div>
                <Button 
                  onClick={() => {
                    addMeeting();
                    openShowAll();
                  }}
                  disabled={!date || memberFee <= 0}
                  className="w-full"
                >
                  Add Meeting & Show All
                </Button>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {meetings.length === 0 ? (
                  <p>No meetings added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="border-b pb-2">
                        <p className="font-medium">Moving on {meeting.date.toLocaleDateString()}</p>
                        <p>Member Fee: ${meeting.memberFee}</p>
                        <p>Visitor Fee: ${meeting.visitorFee}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly Packages</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Packages</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <h2 className="text-xl font-semibold mb-4">Weekly Packages</h2>
          {Object.entries(weeklyPackages).length === 0 ? (
            <p>No meetings added yet. Add meetings to see weekly packages.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(weeklyPackages).map(([key, pkg]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle>
                      Meeting on {pkg.meetings[0].date.toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium">Meeting Details:</h3>
                      <p>Date: {pkg.meetings[0].date.toLocaleDateString()}</p>
                      <p>Member Fee: ${pkg.meetings[0].memberFee}</p>
                      <p>Visitor Fee: ${pkg.meetings[0].visitorFee}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Package Details:</h3>
                      <p>Start: {pkg.packagePayableStartDate?.toLocaleDateString() || '-'}</p>
                      <p>End: {pkg.packagePayableEndDate?.toLocaleDateString() || '-'}</p>
                      <p>Penalty: {pkg.penaltyType} ${pkg.penaltyAmount} ({pkg.penaltyFrequency})</p>
                      <p>Discount: {pkg.discountType} ${pkg.discountAmount} ({pkg.discountFrequency})</p>
                      <p>Discount End: {pkg.discountEndDate?.toLocaleDateString() || '-'}</p>
                      <p>Allow Purchase: {pkg.allowPackagePurchaseIfFeesPaid ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="font-medium">
                      Package Amount: ${pkg.packageAmount}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <PackageDialogForm
                      triggerText="Edit Package"
                      pkg={pkg}
                      onChange={(field, value) =>
                        handlePackageChange('weekly', key, field, value)
                      }
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="monthly">
          <h2 className="text-xl font-semibold mb-4">Monthly Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyPackages.map((pkg) => (
              <Card key={pkg.name}>
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Meetings:</h3>
                    {pkg.meetings.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {pkg.meetings.map(meeting => (
                          <li key={meeting.id}>
                            {meeting.date.toLocaleDateString()} - Member: ${meeting.memberFee}, Visitor: ${meeting.visitorFee}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No meetings scheduled</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Package Details:</h3>
                    <p>Start: {pkg.packagePayableStartDate?.toLocaleDateString() || '-'}</p>
                    <p>End: {pkg.packagePayableEndDate?.toLocaleDateString() || '-'}</p>
                    <p>Penalty: {pkg.penaltyType} ${pkg.penaltyAmount} ({pkg.penaltyFrequency})</p>
                    <p>Discount: {pkg.discountType} ${pkg.discountAmount} ({pkg.discountFrequency})</p>
                    <p>Discount End: {pkg.discountEndDate?.toLocaleDateString() || '-'}</p>
                    <p>Allow Purchase: {pkg.allowPackagePurchaseIfFeesPaid ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="font-medium">
                    Total Package Amount: ${pkg.packageAmount}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <PackageDialogForm
                    triggerText="Edit Package"
                    pkg={pkg}
                    onChange={(field, value) =>
                      handlePackageChange('monthly', pkg.name, field, value)
                    }
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quarterly">
          <h2 className="text-xl font-semibold mb-4">Quarterly Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quarterlyPackages.map((pkg) => (
              <Card key={pkg.name}>
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Meetings:</h3>
                    {pkg.meetings.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {pkg.meetings.map(meeting => (
                          <li key={meeting.id}>
                            {meeting.date.toLocaleDateString()} - Member: ${meeting.memberFee}, Visitor: ${meeting.visitorFee}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No meetings scheduled</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Package Details:</h3>
                    <p>Start: {pkg.packagePayableStartDate?.toLocaleDateString() || '-'}</p>
                    <p>End: {pkg.packagePayableEndDate?.toLocaleDateString() || '-'}</p>
                    <p>Penalty: {pkg.penaltyType} ${pkg.penaltyAmount} ({pkg.penaltyFrequency})</p>
                    <p>Discount: {pkg.discountType} ${pkg.discountAmount} ({pkg.discountFrequency})</p>
                    <p>Discount End: {pkg.discountEndDate?.toLocaleDateString() || '-'}</p>
                    <p>Allow Purchase: {pkg.allowPackagePurchaseIfFeesPaid ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="font-medium">
                    Total Package Amount: ${pkg.packageAmount}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <PackageDialogForm
                    triggerText="Edit Package"
                    pkg={pkg}
                    onChange={(field, value) =>
                      handlePackageChange('quarterly', pkg.name, field, value)
                    }
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={handleSubmit} size="lg" className="w-full md:w-auto">
          Submit All Packages
        </Button>
      </div>
    </div>
  );
};

export default AdminPackage;