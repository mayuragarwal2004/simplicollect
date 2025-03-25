import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import { Visitor } from '../../models/Visitor';
import AcceptPayment from './VisitorListComponents/AcceptPayment';
import ViewVisitor from './VisitorListComponents/ViewVisitor';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
import FilterTags from '../../components/FilterTags';
import ExportVisitorData from './VisitorListComponents/ExportVisitorData';
import VisitorDelete from './VisitorListComponents/VisitorDelete';
import useWindowDimensions from '../../utils/useWindowDimensions';

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, RefreshCw, Download, Search, Eye, Trash2, IndianRupee } from 'lucide-react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const VisitorList: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const { chapterData } = useData();
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Today']);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'meeting' | 'dateRange'>('meeting');
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const { width } = useWindowDimensions();

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

  const fetchMeetings = async () => {
    try {
      const response = await axiosInstance(`/api/meetings/${chapterData?.chapterId}`);
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchVisitors = async () => {
    try {
      let url = `/api/visitor/visitorList/${chapterData?.chapterId}`;
      const params = new URLSearchParams();

      if (viewMode === 'meeting' && selectedMeeting) {
        params.append('meetingId', selectedMeeting);
      } else if (viewMode === 'dateRange' && startDate && endDate) {
        params.append('startDate', startDate.toISOString().split('T')[0]);
        params.append('endDate', endDate.toISOString().split('T')[0]);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axiosInstance(url);
      setVisitors(response.data);
    } catch (error) {
      console.error('Fetching visitors failed:', error);
    }
  };

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchVisitors();
      fetchMeetings();
    }
  }, [chapterData, viewMode, selectedMeeting, startDate, endDate]);

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredVisitors(visitors);
      return;
    }
    const filteredVisitors = filterVisitors(visitors);
    setFilteredVisitors(filteredVisitors);
  }, [activeFilters, visitors]);

  useEffect(() => {
    // Apply search filter
    let results = visitors;
    if (searchTerm) {
      results = results.filter(visitor =>
        `${visitor.firstName} ${visitor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visitor.email + '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.mobileNumber.toString().includes(searchTerm)
      );
    }

    // Apply other filters
    if (activeFilters.length > 0) {
      results = filterVisitors(results);
    }

    setFilteredVisitors(results);
  }, [visitors, searchTerm, activeFilters]);

  useEffect(() => {
    // check if today there is atleat 1 visitor, then set the default filter to today
    const filteredVisitors = visitors.filter((visitor) => {
      const today = new Date();
      return (
        new Date(visitor.chapterVisitDate as string | number).toDateString() ===
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
            new Date(
              visitor.chapterVisitDate as string | number,
            ).toDateString() === today.toDateString()
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
          return (
            new Date(visitor.chapterVisitDate as string | number) > sixMonthsAgo
          );
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

  return (
    <>
      <Breadcrumb pageName="Visitor List" />
      <Card className="p-6 shadow-default">
        <Dialog open={backDropOpen} onOpenChange={setBackDropOpen}>
          <DialogContent className="sm:max-w-[425px]">
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
          </DialogContent>
        </Dialog>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search visitors..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Label>View By</Label>
            <Select
              value={viewMode}
              onValueChange={(value) => setViewMode(value as 'meeting' | 'dateRange')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select view mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">By Meeting</SelectItem>
                <SelectItem value="dateRange">By Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {viewMode === 'meeting' ? (
            <div className="w-full md:w-1/3">
              <Label>Select Meeting</Label>
              <Select
                value={selectedMeeting}
                onValueChange={setSelectedMeeting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Meetings</SelectItem>
                  {meetings.map((meeting) => (
                    <SelectItem key={meeting.meetingId} value={meeting.meetingId}>
                      {meeting.meetingName} - {new Date(meeting.meetingDate).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      endDate ? (
                        <>
                          {format(startDate, "MMM dd, yyyy")} -{" "}
                          {format(endDate, "MMM dd, yyyy")}
                        </>
                      ) : (
                        format(startDate, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: startDate || undefined, to: endDate || undefined }}
                    onSelect={(range) => {
                      if (range) {
                        setDateRange([range.from || null, range.to || null]);
                      } else {
                        setDateRange([null, null]);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {startDate && endDate && (
                <Button
                  variant="outline"
                  onClick={() => setDateRange([null, null])}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <FilterTags
            filters={allFilters}
            activeFilters={activeFilters}
            setActiveFilters={handleFilterChange}
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchVisitors()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setBackDropOpen(true);
                setSelectedAction('export');
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="my-4">
          Number of visitors: {filteredVisitors.length}
        </div>

        {width > 700 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Visitor Name</TableHead>
                <TableHead className="min-w-[150px]">Date</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-5 h-24">
                    No visitors found
                  </TableCell>
                </TableRow>
              )}
              {filteredVisitors.map((visitor_i, key) => (
                <TableRow key={key}>
                  <TableCell>
                    <div className="font-medium">
                      {visitor_i.firstName} {visitor_i.lastName}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(
                      visitor_i.chapterVisitDate as string | number,
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge
                        variant={visitor_i.paymentAcceptedMemberId ? "default" : "destructive"}
                      >
                        {visitor_i.paymentAcceptedMemberId ? 'Paid' : 'Unpaid'}
                      </Badge>
                      {visitor_i.paymentAcceptedMemberId && (
                        <Badge variant="secondary">
                          {visitor_i.paymentType}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setBackDropOpen(true);
                          setSelectedAction('accept_payment');
                          setSelectedVisitor(visitor_i);
                        }}
                      >
                        <IndianRupee className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setBackDropOpen(true);
                          setSelectedAction('view_edit');
                          setSelectedVisitor(visitor_i);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setBackDropOpen(true);
                          setSelectedAction('delete');
                          setSelectedVisitor(visitor_i);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col space-y-4">
            {filteredVisitors.length === 0 && (
              <>
                <div className="text-center py-5">No visitors found</div>
                <div className="text-center py-5">
                  <Link to="/visitor/shareform" className="text-primary">
                    Share the link to invite visitors
                  </Link>
                </div>
              </>
            )}
            {filteredVisitors.map((visitor_i, key) => (
              <Card key={key} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">
                    {visitor_i.firstName} {visitor_i.lastName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setBackDropOpen(true);
                        setSelectedAction('accept_payment');
                        setSelectedVisitor(visitor_i);
                      }}
                    >
                      <IndianRupee className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setBackDropOpen(true);
                        setSelectedAction('view_edit');
                        setSelectedVisitor(visitor_i);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setBackDropOpen(true);
                        setSelectedAction('delete');
                        setSelectedVisitor(visitor_i);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mb-2">
                  {new Date(
                    visitor_i.chapterVisitDate as string | number,
                  ).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={visitor_i.paymentAcceptedMemberId ? "default" : "destructive"}
                  >
                    {visitor_i.paymentAcceptedMemberId ? 'Paid' : 'Unpaid'}
                  </Badge>
                  {visitor_i.paymentAcceptedMemberId && (
                    <Badge variant="secondary">
                      {visitor_i.paymentType}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default VisitorList;