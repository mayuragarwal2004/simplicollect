import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

const AdminChapterLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastSegment = location.pathname.split('/').pop();
  console.log('lastSegment', lastSegment);

  const [currentTab, setCurrentTab] = useState('Dashboard');

  const list = [
    {
      name: 'Dashboard',
      href: 'dashboard',
    },
    {
      name: 'Member',
      href: 'member',
    },
    {
      name: 'Roles',
      href: 'roles',
    },
  ];

  useEffect(() => {
    const foundTab = list.find((item) => item.href === lastSegment);
    if (foundTab) {
      setCurrentTab(foundTab.name);
    } else {
      setCurrentTab('Dashboard');
    }
  }, [lastSegment]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Navigation Tabs */}
      <Card className="p-4 flex gap-4">
        {list.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={`px-6 py-2 rounded-md ${
              currentTab === item.name ? 'bg-gray-200' : ''
            }`}
            onClick={() => {
              setCurrentTab(item.name);
              navigate(item.href);
            }}
          >
            {item.name}
          </Button>
        ))}
      </Card>

      {/* Dynamic Content Display */}
      <Card className="p-4">
        <Outlet />
      </Card>
    </div>
  );
};

export default AdminChapterLayout;
