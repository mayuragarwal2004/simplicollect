import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import { Visitor } from '../../models/Visitor';
import AcceptPayment from './VisitorListComponents/AcceptPayment';
import ViewVisitor from './VisitorListComponents/ViewVisitor';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FilterTags from '../../components/FilterTags';
import ExportVisitorData from './VisitorListComponents/ExportVisitorData';

import { IconButton, Backdrop } from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  CurrencyRupee,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import VisitorDelete from './VisitorListComponents/VisitorDelete';

const VisitorList: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const { chapterData } = useData();
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Today']);

  const allFilters = [
    'Today',
    '6 Months',
    'Paid',
    'Unpaid',
    'Feedback Filled',
    'Feedback Not Filled',
  ];

  const handleFilterChange = (filters: string[]) => {
    console.log('Selected filters:', filters);
    setActiveFilters(filters);
  };

  const fetchVisitors = async () => {
    try {
      const response = await axiosInstance(
        `/api/visitor/visitorList/${chapterData?.chapterId}`,
      );
      const data = await response.data;
      setVisitors(data);
    } catch (error) {
      console.error('Fetching visitors failed:', error);
    }
  };

  const handleBackDropClose = (e: any) => {
    console.log(e.target.className.startsWith('MuiBackdrop-root'));
    if (!e.target.className.startsWith('MuiBackdrop-root')) return;
    setBackDropOpen(false);
  };

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchVisitors();
    }
  }, [chapterData]);

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredVisitors(visitors);
      return;
    }
    const filteredVisitors = filterVisitors(visitors);
    setFilteredVisitors(filteredVisitors);
  }, [activeFilters, visitors]);

  useEffect(() => {
    // check if today there is atleat 1 visitor, then set the default filter to today
    const filteredVisitors = visitors.filter((visitor) => {
      const today = new Date();
      return (
        new Date(visitor.chapterVisitDate).toDateString() ===
        today.toDateString()
      );
    });
    if (filteredVisitors.length > 0) {
      console.log('Setting default filter to Today');
      
      setActiveFilters(['Today']);
    } else {
      console.log('Setting default filter to All');
      
      setActiveFilters([]);
    }
  }, []);

  const filterVisitors = (visitors: Visitor[]) => {
    let filteredVisitors = visitors;

    if (activeFilters.length > 0) {
      if (activeFilters.includes('Today')) {
        filteredVisitors = filteredVisitors.filter((visitor) => {
          const today = new Date();
          return (
            new Date(visitor.chapterVisitDate).toDateString() ===
            today.toDateString()
          );
        });
      }

      if (activeFilters.includes('Paid')) {
        filteredVisitors = filteredVisitors.filter(
          (visitor) => visitor.paymentAcceptedMemberId,
        );
      }

      if (activeFilters.includes('Unpaid')) {
        filteredVisitors = filteredVisitors.filter(
          (visitor) => !visitor.paymentAcceptedMemberId,
        );
      }

      if (activeFilters.includes('6 Months')) {
        filteredVisitors = filteredVisitors.filter((visitor) => {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return new Date(visitor.chapterVisitDate) > sixMonthsAgo;
        });
      }

      if (activeFilters.includes('Feedback Filled')) {
        filteredVisitors = filteredVisitors.filter(
          (visitor) => visitor.feedbackScore,
        );
      }

      if (activeFilters.includes('Feedback Not Filled')) {
        filteredVisitors = filteredVisitors.filter(
          (visitor) => !visitor.feedbackScore,
        );
      }
    }

    return filteredVisitors;
  };

  console.log(activeFilters);

  console.log(visitors);
  return (
    <>
      <Breadcrumb pageName="Visitor List" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDropOpen}
          onClick={handleBackDropClose}
        >
          {selectedAction === 'accept_payment' ? (
            <AcceptPayment
              setBackDropOpen={setBackDropOpen}
              selectedVisitor={selectedVisitor}
              fetchVisitors={fetchVisitors}
            />
          ) : selectedAction === 'view_edit' ? (
            <ViewVisitor
              setBackDropOpen={setBackDropOpen}
              fetchVisitors={fetchVisitors}
              selectedVisitor={selectedVisitor}
            />
          ) : selectedAction === 'delete' ? (
            <VisitorDelete
              setBackDropOpen={setBackDropOpen}
              selectedVisitor={selectedVisitor}
              fetchVisitors={fetchVisitors}
            />
          ) : selectedAction === 'export' ? (
            <ExportVisitorData data={filteredVisitors} />
          ) : (
            <></>
          )}
        </Backdrop>
        <div className="flex justify-between	">
          <FilterTags
            filters={allFilters}
            activeFilters={activeFilters}
            setActiveFilters={handleFilterChange}
          />
          <div>
            <IconButton
              aria-label="export"
              onClick={() => {
                fetchVisitors();
              }}
            >
              <RefreshIcon className="dark:text-white" />
            </IconButton>
            <IconButton
              aria-label="export"
              onClick={() => {
                setBackDropOpen(true);
                setSelectedAction('export');
              }}
            >
              <FileDownloadIcon className="dark:text-white" />
            </IconButton>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Visitor Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.length === 0 && (
                <>
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-5 text-black dark:text-white"
                    >
                      No visitors found
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-5 text-black dark:text-white"
                    >
                      <Link to="/visitor/shareform">
                        Share the link to invite visitors
                      </Link>
                    </td>
                  </tr>
                </>
              )}
              {filteredVisitors.map((visitor_i, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {visitor_i.firstName} {visitor_i.lastName}
                    </h5>
                    {/* <p className="text-sm">${visitor_i.price}</p> */}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(
                        visitor_i.chapterVisitDate,
                      ).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        visitor_i.paymentAcceptedMemberId
                          ? 'bg-success text-success'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {visitor_i.paymentAcceptedMemberId ? 'Paid' : 'Unpaid'}
                    </p>
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        visitor_i.feedbackScore
                          ? 'bg-success text-success'
                          : 'bg-warning text-warning'
                      }`}
                    >
                      {visitor_i.feedbackScore
                        ? 'Feedback Filled'
                        : 'Feedback Not Filled'}
                    </p>
                    {/* <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      visitor_i.status === 'Paid'
                        ? 'bg-success text-success'
                        : visitor_i.status === 'Unpaid'
                        ? 'bg-danger text-danger'
                        : 'bg-warning text-warning'
                    }`}
                  >
                    {visitor_i.status}
                  </p> */}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <IconButton
                        aria-label="accept payment"
                        onClick={() => {
                          setBackDropOpen(true);
                          setSelectedAction('accept_payment');
                          setSelectedVisitor(visitor_i);
                        }}
                      >
                        <CurrencyRupee className="dark:text-white" />
                      </IconButton>
                      <IconButton
                        aria-label="accept payment"
                        onClick={() => {
                          setBackDropOpen(true);
                          setSelectedAction('view_edit');
                          setSelectedVisitor(visitor_i);
                        }}
                      >
                        <VisibilityIcon className="dark:text-white" />
                      </IconButton>
                      <IconButton
                        aria-label="accept payment"
                        onClick={() => {
                          setBackDropOpen(true);
                          setSelectedAction('delete');
                          setSelectedVisitor(visitor_i);
                        }}
                      >
                        <DeleteForeverIcon className="dark:text-white" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default VisitorList;
