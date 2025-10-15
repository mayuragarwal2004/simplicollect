import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.svg';
import { ChevronDown, PanelLeftClose, Repeat } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useData } from '../../context/DataContext';
import { axiosInstance } from '../../utils/config';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  admin?: boolean;
}

const adminSidebarData = [
  {
    title: 'Organisations',
    icon: 'Users', // Good for organisations
    links: [
      {
        title: 'Organisations',
        to: '/admin/organisations',
      },
    ],
  },
  {
    title: 'Chapters',
    icon: 'Layers', // More suitable for chapters
    links: [
      {
        title: 'Chapters',
        to: '/admin/chapters',
      },
    ],
  },
  {
    title: 'Members',
    icon: 'User', // Single user for members
    links: [
      {
        title: 'Members',
        to: '/admin/members',
      },
    ],
  },
  {
    title: 'Dashboard',
    icon: 'LayoutDashboard', // Dashboard icon
    links: [
      {
        title: 'Dashboard',
        to: '/admin/dashboard',
      },
    ],
  },
  {
    title: 'Notifications',
    icon: 'Bell', // Bell icon for notifications
    links: [
      {
        title: 'Notifications',
        to: '/admin/notifications',
      },
    ],
  },
  {
    title: 'Contact Queries',
    icon: 'MessageSquare', // Message icon for contact queries
    links: [
      {
        title: 'Contact Queries',
        to: '/admin/contact-queries',
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, admin }: SidebarProps) => {
  const { chapterData, allChaptersData } = useData();
  const [rightsData, setRightsData] = useState<any>([]);
  const location = useLocation();
  const { pathname } = location;

  const getIcon = (iconName: string) => {
    // Cast to any first to avoid TypeScript errors with the dynamic import
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={20} /> : null;
  };

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    if (chapterData?.chapterId)
      if (admin) {
        setRightsData(adminSidebarData);
      } else {
        getRightData();
      }
  }, [chapterData, admin]);

  const getRightData = async () => {
    try {
      const response = await axiosInstance(`/api/rights/sidebar`, {
        params: {
          chapterId: chapterData?.chapterId,
        },
      });
      const data = await response.data;
      setRightsData(data);
    } catch (error) {
      console.error('Fetching chapter details failed:', error);
    }
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 mt-10 px-6 py-5.5 lg:py-6.5">
        <img src={Logo} alt="" width={200} />

        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>
        <PanelLeftClose
          ref={trigger}
          className="cursor-pointer text-white block lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        />
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear h-full">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6 flex flex-col gap-2.5 h-full justify-between">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {rightsData.map((item, index) => {
                if (item.links.length > 1) {
                  return (
                    <SidebarLinkGroup
                      key={index}
                      activeCondition={
                        pathname === '/forms' || pathname.includes('forms')
                      }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname === '/forms' ||
                                  pathname.includes('forms')) &&
                                'bg-graydark dark:bg-meta-4'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              {getIcon(item.icon)}
                              {item.title}
                              <ChevronDown
                                className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                                  open && 'rotate-180'
                                }`}
                              />
                            </NavLink>
                            {/* <!-- Dropdown Menu Start --> */}
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                {item.links.map((link, index) => (
                                  <li key={index}>
                                    <NavLink
                                      to={link.to}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      {link.title}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* <!-- Dropdown Menu End --> */}
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  );
                } else {
                  return (
                    <li key={index}>
                      <NavLink
                        to={item.links[0].to}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes('settings') &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        {getIcon(item.icon)}
                        {item.links[0].title}
                      </NavLink>
                    </li>
                  );
                }
              })}
              {allChaptersData && allChaptersData.length > 1 && (
                <>
                  <hr />
                  {/* Add Switch Chapter link */}
                  <li>
                    <NavLink
                      to="/member/switch-chapter"
                      className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <Repeat />
                      Switch Chapter
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          <span className="mt-6 text-center flex flex-col text-gray-400 dark:text-gray-400">
            A Product by
            <span className="text-blue-500 hover:underline ml-1">
              <a
                href="https://simpliumtechnologies.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Simplium Technologies
              </a>
            </span>
          </span>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
