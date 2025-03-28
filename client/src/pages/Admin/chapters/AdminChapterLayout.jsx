import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AdminChapterLayout = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('Dashboard');

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Navigation Tabs */}
      <Card className="p-4 flex gap-4">
        <Button
          variant="ghost"
          className={`px-6 py-2 rounded-md ${
            currentTab === 'Dashboard' ? 'bg-gray-200' : ''
          }`}
          onClick={() => {
            setCurrentTab('Dashboard');
            navigate('dashboard');
          }}
        >
          Dashboard
        </Button>

        <Button
          variant="ghost"
          className={`px-6 py-2 rounded-md ${
            currentTab === 'Member' ? 'bg-gray-200' : ''
          }`}
          onClick={() => {
            setCurrentTab('Member');
            navigate('member');
          }}
        >
          Member
        </Button>

        <Button
          variant="ghost"
          className={`px-6 py-2 rounded-md ${
            currentTab === 'Roles' ? 'bg-gray-200' : ''
          }`}
          onClick={() => {
            setCurrentTab('Roles');
            navigate('roles');
          }}
        >
          Roles
        </Button>
      </Card>

      {/* Dynamic Content Display */}
      <Card className="p-4">
        <Outlet />
      </Card>
    </div>
  );
};

export default AdminChapterLayout;
