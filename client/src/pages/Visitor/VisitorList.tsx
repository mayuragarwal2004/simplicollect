import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/config';
import { useData } from '../../context/DataContext';
import { Visitor } from '../../models/Visitor';
import AcceptPayment from './VisitorListComponents/AcceptPayment';
import ViewVisitor from './VisitorListComponents/ViewVisitor';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumb';
import FilterTags from '../../components/FilterTags';
import ExportVisitorData from './VisitorListComponents/ExportVisitorData';
import VisitorDelete from './VisitorListComponents/VisitorDelete';
import useWindowDimensions from '../../utils/useWindowDimensions';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CalendarIcon,
  RefreshCw,
  Download,
  Search,
  Eye,
  Trash2,
  IndianRupee,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { DateRange as CalendarDateRange } from 'react-day-picker';

type ViewMode = 'meeting' | 'date' | 'dateRange';
type DateRange = { from?: Date; to?: Date };

const VisitorList: React.FC = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const { chapterData } = useData();
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Today']);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('meeting');
  const [selectedMeeting, setSelectedMeeting] = useState('All');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange>({});
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
    setActiveFilters(filters);
  };

  const fetchMeetings = async () => {
    try {
      const response = await axiosInstance(
        `/api/meetings/${chapterData?.chapterId}`,
      );
      setMeetings(response.data);
      console.log('meetings', response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchVisitors = async () => {
    try {
      let url = `/api/visitor/visitorList/${chapterData?.chapterId}`;
      const params = new URLSearchParams();

      if (
        viewMode === 'meeting' &&
        selectedMeeting &&
        selectedMeeting !== 'All'
      ) {
        params.append('meetingId', selectedMeeting);
      } else if (viewMode === 'date' && selectedDate) {
        params.append('date', selectedDate.toISOString().split('T')[0]);
      } else if (viewMode === 'dateRange' && dateRange.from && dateRange.to) {
        params.append('startDate', dateRange.from.toISOString().split('T')[0]);
        params.append('endDate', dateRange.to.toISOString().split('T')[0]);
      }

      params.append('sortBy', 'chapterVisitDate');
      params.append('sortOrder', 'desc');

      const response = await axiosInstance(
        url + (params.toString() ? `?${params.toString()}` : ''),
      );
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
  }, [chapterData, viewMode, selectedMeeting, selectedDate, dateRange]);
  useEffect(() => {
    console.log('Meetings data:', meetings); // Add this to check for duplicates
  }, [meetings]);
  useEffect(() => {
    const filterVisitors = () => {
      let results = [...visitors];

      // Sort by date (newest first)
      results.sort((a, b) => {
        const dateA = new Date(a.chapterVisitDate as string | number).getTime();
        const dateB = new Date(b.chapterVisitDate as string | number).getTime();
        return dateB - dateA;
      });

      // Apply view mode filters
      if (viewMode === 'date' && selectedDate) {
        results = results.filter((visitor) => {
          const visitDate = new Date(
            visitor.chapterVisitDate as string | number,
          );
          return (
            visitDate.getFullYear() === selectedDate.getFullYear() &&
            visitDate.getMonth() === selectedDate.getMonth() &&
            visitDate.getDate() === selectedDate.getDate()
          );
        });
      } else if (viewMode === 'dateRange' && dateRange.from && dateRange.to) {
        results = results.filter((visitor) => {
          const visitDate = new Date(
            visitor.chapterVisitDate as string | number,
          );
          return visitDate >= dateRange.from! && visitDate <= dateRange.to!;
        });
      } else if (
        viewMode === 'meeting' &&
        selectedMeeting &&
        selectedMeeting !== 'All'
      ) {
        results = results.filter(
          (visitor) => visitor.meetingId === selectedMeeting,
        );
      }

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          (visitor) =>
            `${visitor.firstName} ${visitor.lastName}`
              .toLowerCase()
              .includes(term) ||
            (visitor.email + '').toLowerCase().includes(term) ||
            visitor.mobileNumber.toString().includes(searchTerm),
        );
      }

      // Apply other filters
      if (activeFilters.length > 0) {
        if (activeFilters.includes('Today')) {
          const today = new Date();
          results = results.filter(
            (visitor) =>
              new Date(
                visitor.chapterVisitDate as string | number,
              ).toDateString() === today.toDateString(),
          );
        }

        if (activeFilters.includes('Paid')) {
          results = results.filter(
            (visitor) => visitor.paymentAcceptedMemberId,
          );
        }

        if (activeFilters.includes('Unpaid')) {
          results = results.filter(
            (visitor) => !visitor.paymentAcceptedMemberId,
          );
        }

        if (activeFilters.includes('6 Months')) {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          results = results.filter(
            (visitor) =>
              new Date(visitor.chapterVisitDate as string | number) >
              sixMonthsAgo,
          );
        }

        if (activeFilters.includes('Feedback Filled')) {
          results = results.filter((visitor) => visitor.feedbackScore);
        }

        if (activeFilters.includes('Feedback Not Filled')) {
          results = results.filter((visitor) => !visitor.feedbackScore);
        }
      }

      return results;
    };

    setFilteredVisitors(filterVisitors());
  }, [
    visitors,
    searchTerm,
    activeFilters,
    viewMode,
    selectedDate,
    dateRange,
    selectedMeeting,
  ]);

  useEffect(() => {
    const todayVisitors = visitors.filter((visitor) => {
      const today = new Date();
      return (
        new Date(visitor.chapterVisitDate as string | number).toDateString() ===
        today.toDateString()
      );
    });
    setActiveFilters(todayVisitors.length > 0 ? ['Today'] : []);
  }, [visitors]);

  return (
    <>
      <Breadcrumbs items={[
        { name: 'Visitor List' }
      ]} />
      <Card className="p-6 shadow-default">
        <Dialog open={backDropOpen} onOpenChange={setBackDropOpen}>
          <DialogContent className={`${
            selectedAction === 'view_edit' 
              ? 'sm:max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full' 
              : selectedAction === 'delete'
              ? 'sm:max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full'
              : selectedAction === 'accept_payment'
              ? 'sm:max-w-lg max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full'
              : 'sm:max-w-[425px] w-[95vw] sm:w-full'
          }`}>
            {selectedAction === 'accept_payment' && (
              <AcceptPayment
                setBackDropOpen={setBackDropOpen}
                selectedVisitor={selectedVisitor}
                fetchVisitors={fetchVisitors}
              />
            )}
            {selectedAction === 'view_edit' && (
              <ViewVisitor
                setBackDropOpen={setBackDropOpen}
                fetchVisitors={fetchVisitors}
                selectedVisitor={selectedVisitor}
              />
            )}
            {selectedAction === 'delete' && (
              <VisitorDelete
                setBackDropOpen={setBackDropOpen}
                selectedVisitor={selectedVisitor}
                fetchVisitors={fetchVisitors}
              />
            )}
            {selectedAction === 'export' && (
              <ExportVisitorData data={filteredVisitors} />
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
              onValueChange={(value) => {
                setViewMode(value as ViewMode);
                setSelectedDate(undefined);
                setDateRange({});
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select view mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">By Meeting</SelectItem>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="dateRange">By Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {viewMode === 'meeting' && (
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
                  <SelectItem value="All">All Meetings</SelectItem>
                  {meetings.map((meeting) => (
                    <SelectItem
                      key={meeting.meetingId}
                      value={meeting.meetingId}
                    >
                      {meeting.meetingName} -{' '}
                      {format(new Date(meeting.meetingDate), 'MMM dd, yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {viewMode === 'date' && (
            <div className="w-full md:w-1/3">
              <Label>Select Date</Label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, 'MMM dd, yyyy')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                {selectedDate && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {viewMode === 'dateRange' && (
            <div className="w-full md:w-2/3">
              <Label>Select Date Range</Label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
                            {format(dateRange.to, 'MMM dd, yyyy')}
                          </>
                        ) : (
                          format(dateRange.from, 'MMM dd, yyyy')
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange as CalendarDateRange}
                      onSelect={(range) => setDateRange(range || {})}
                      numberOfMonths={width > 768 ? 2 : 1}
                    />
                  </PopoverContent>
                </Popover>
                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDateRange({})}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {dateRange.from && dateRange.to && (
                <p className="text-sm text-muted-foreground mt-1">
                  Showing visitors between{' '}
                  {format(dateRange.from, 'MMM dd, yyyy')} and{' '}
                  {format(dateRange.to, 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
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
              title="Refresh data"
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
              title="Export data"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium">
            Total visitors:{' '}
            <span className="font-bold">{filteredVisitors.length}</span>
            {viewMode === 'date' && selectedDate && (
              <span className="text-muted-foreground">
                {' '}
                (filtered by {format(selectedDate, 'MMM dd, yyyy')})
              </span>
            )}
            {viewMode === 'dateRange' && dateRange.from && dateRange.to && (
              <span className="text-muted-foreground">
                {' '}
                (filtered by date range)
              </span>
            )}
          </p>
        </div>

        {width > 700 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Visitor Name</TableHead>
                <TableHead className="min-w-[150px]">Visit Date</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-5 h-24">
                    <div className="flex flex-col items-center gap-2">
                      <p>No visitors found</p>
                      <Link
                        to="/visitor/shareform"
                        className="text-primary text-sm"
                      >
                        Share the link to invite visitors
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisitors.map((visitor) => (
                  <TableRow key={String(visitor.visitorId || Math.random())}>
                    <TableCell>
                      <div className="font-medium">
                        {visitor.firstName} {visitor.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {visitor.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(visitor.chapterVisitDate as string | number),
                        'MMM dd, yyyy h:mm a',
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            visitor.paymentAcceptedMemberId
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {visitor.paymentAcceptedMemberId ? 'Paid' : 'Unpaid'}
                        </Badge>
                        {visitor.paymentAcceptedMemberId && (
                          <Badge variant="secondary">
                            {visitor.paymentType}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() =>
                            navigate(`/track-visitor/${visitor.visitorId}`)
                          }
                        >
                          Track
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setSelectedAction('accept_payment');
                            setBackDropOpen(true);
                          }}
                          title="Accept payment"
                        >
                          <IndianRupee className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setSelectedAction('view_edit');
                            setBackDropOpen(true);
                          }}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setSelectedAction('delete');
                            setBackDropOpen(true);
                          }}
                          title="Delete visitor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredVisitors.length === 0 ? (
              <Card className="p-4 text-center">
                <p>No visitors found</p>
                <Link to="/visitor/shareform" className="text-primary text-sm">
                  Share the link to invite visitors
                </Link>
              </Card>
            ) : (
              filteredVisitors.map((visitor) => (
                <Card key={String(visitor.visitorId || Math.random())} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {visitor.firstName} {visitor.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(visitor.chapterVisitDate as string | number),
                          'MMM dd, yyyy h:mm a',
                        )}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant={
                            visitor.paymentAcceptedMemberId
                              ? 'default'
                              : 'destructive'
                          }
                          className="text-xs"
                        >
                          {visitor.paymentAcceptedMemberId ? 'Paid' : 'Unpaid'}
                        </Badge>
                        {visitor.paymentAcceptedMemberId && (
                          <Badge variant="secondary" className="text-xs">
                            {visitor.paymentType}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedVisitor(visitor);
                          setSelectedAction('accept_payment');
                          setBackDropOpen(true);
                        }}
                      >
                        <IndianRupee className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedVisitor(visitor);
                          setSelectedAction('view_edit');
                          setBackDropOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedVisitor(visitor);
                          setSelectedAction('delete');
                          setBackDropOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </Card>
    </>
  );
};

export default VisitorList;
