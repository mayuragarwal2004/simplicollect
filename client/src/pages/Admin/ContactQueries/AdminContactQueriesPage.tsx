import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  AlertTriangle,
  MoreVertical,
  RefreshCw,
  Download,
  Plus,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import { Separator } from '../../../components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';
import contactService, {
  ContactQuery,
  ContactQueryStats,
  ContactQueryFilters,
} from '../../../services/contact/contactService';
import { useParams, useNavigate } from 'react-router-dom';
import CATEGORIES from '../../../components/ContactForm/categories';

const AdminContactQueriesPage: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const navigate = useNavigate();
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [stats, setStats] = useState<ContactQueryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoadingSpecificQuery, setIsLoadingSpecificQuery] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1); // Start from 1 instead of 0
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 20;

  // Modals
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [workingQuery, setWorkingQuery] = useState<ContactQuery | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newResponse, setNewResponse] = useState('');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    under_review: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const fetchQueries = async (reset = false, page = 1) => {
    try {
      setLoading(true);
      const filters: ContactQueryFilters = {
        page: page - 1, // Convert to 0-based for backend
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        sortBy,
        sortOrder,
      };

      const result = await contactService.getContactQueries(filters);

      if (reset || page === 1) {
        setQueries(result.data);
        setCurrentPage(1);
      } else {
        setQueries(result.data); // Replace instead of append for proper pagination
      }

      // Update pagination state
      setHasMore(result.pagination.hasMore);
      setCurrentPage(page);

    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error(error.message || 'Failed to fetch contact queries', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const stats = await contactService.getContactQueryStats();
      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSpecificQuery = async (queryId: string) => {
    setIsLoadingSpecificQuery(true);
    try {
      const query = await contactService.getContactQuery(queryId);
      
      // Set the query as selected and open the detail modal
      setSelectedQuery(query);
      setIsDetailOpen(true);
      
      // Show success message
      toast.success(`Query loaded successfully (ID: ${queryId.substring(0, 8)}...)`, {
        position: 'top-right',
        autoClose: 3000,
      });
      
      // Scroll to top to ensure modal is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error fetching specific query:', error);
      
      // Show error with option to view all queries
      toast.error(
        error.message || 'Failed to load the requested query. The query may not exist or you may not have permission to view it.',
        {
          position: 'top-right',
          autoClose: 8000,
        }
      );
      
      // Optionally redirect to all queries after showing error
      setTimeout(() => {
        navigate('/admin/contact-queries');
      }, 3000);
      
    } finally {
      setIsLoadingSpecificQuery(false);
    }
  };

  const updateQueryStatus = async (
    queryId: string,
    status: string,
    notes?: string,
  ) => {
    try {
      const result = await contactService.updateContactQueryStatus(
        queryId,
        status,
        notes,
      );

      // Update queries list
      setQueries((prev) =>
        prev.map((q) => (q.queryId === queryId ? { ...q, ...result } : q)),
      );

      // Update selected query if open
      if (selectedQuery?.queryId === queryId) {
        setSelectedQuery({ ...selectedQuery, ...result });
      }

      toast.success(`Query status updated to ${status}`, {
        position: 'top-right',
        autoClose: 3000,
      });

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update query status', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const addAdminNotes = async (queryId: string, adminNotes: string) => {
    try {
      const result = await contactService.addAdminNotes(queryId, adminNotes);

      // Update queries list
      setQueries((prev) =>
        prev.map((q) => (q.queryId === queryId ? { ...q, ...result } : q)),
      );

      // Update selected query if open
      if (selectedQuery?.queryId === queryId) {
        setSelectedQuery({ ...selectedQuery, ...result });
      }

      toast.success('Admin notes have been saved', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error adding notes:', error);
      toast.error(error.message || 'Failed to add admin notes', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const addResponse = async (queryId: string, responseMessage: string) => {
    try {
      const result = await contactService.addResponseMessage(
        queryId,
        responseMessage,
      );

      // Update queries list
      setQueries((prev) =>
        prev.map((q) => (q.queryId === queryId ? { ...q, ...result } : q)),
      );

      // Update selected query if open
      if (selectedQuery?.queryId === queryId) {
        setSelectedQuery({ ...selectedQuery, ...result });
      }

      toast.success('Your response has been sent to the user', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error(error.message || 'Failed to send response', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const markAsSpam = async (queryId: string) => {
    try {
      await contactService.markAsSpam(queryId);

      // Remove from list
      setQueries((prev) => prev.filter((q) => q.queryId !== queryId));

      // Close detail modal if this query was selected
      if (selectedQuery?.queryId === queryId) {
        setIsDetailOpen(false);
        setSelectedQuery(null);
      }

      toast.success('Query has been marked as spam and removed', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error marking as spam:', error);
      toast.error(error.message || 'Failed to mark query as spam', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    fetchQueries(true, 1);
    fetchStats();
  }, [
    searchTerm,
    statusFilter,
    categoryFilter,
    priorityFilter,
    sortBy,
    sortOrder,
  ]);

  // Handle direct query access from email link
  // When an admin clicks a link in an email notification (e.g., /admin/contact-queries/123e4567-e89b-12d3-a456-426614174000)
  // this effect will automatically fetch and display that specific query
  useEffect(() => {
    if (queryId) {
      // Fetch and display the specific query
      fetchSpecificQuery(queryId);
    }
  }, [queryId]);

  const handleStatusUpdate = () => {
    if (workingQuery && newStatus) {
      updateQueryStatus(workingQuery.queryId, newStatus);
      setIsStatusModalOpen(false);
      setWorkingQuery(null);
      setNewStatus('');
    }
  };

  const handleNotesUpdate = () => {
    if (workingQuery && newNotes.trim()) {
      addAdminNotes(workingQuery.queryId, newNotes.trim());
      setIsNotesModalOpen(false);
      setWorkingQuery(null);
      setNewNotes('');
    }
  };

  const handleResponseSend = () => {
    if (workingQuery && newResponse.trim()) {
      addResponse(workingQuery.queryId, newResponse.trim());
      setIsResponseModalOpen(false);
      setWorkingQuery(null);
      setNewResponse('');
    }
  };

  const openStatusModal = (query: ContactQuery) => {
    setWorkingQuery(query);
    setNewStatus(query.status);
    setIsStatusModalOpen(true);
  };

  const openNotesModal = (query: ContactQuery) => {
    setWorkingQuery(query);
    setNewNotes(query.adminNotes || '');
    setIsNotesModalOpen(true);
  };

  const openResponseModal = (query: ContactQuery) => {
    setWorkingQuery(query);
    setNewResponse('');
    setIsResponseModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Queries</h1>
          <p className="text-gray-600 mt-1">
            Manage customer queries and support requests
            {queryId && (
              <span className="ml-2 text-blue-600 font-medium">
                • Viewing Query: {queryId.substring(0, 8)}...
              </span>
            )}
          </p>
          {isLoadingSpecificQuery && (
            <div className="flex items-center mt-2 text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Loading specific query...
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {queryId && (
            <Button
              onClick={() => {
                // Navigate back to all queries by removing the queryId from URL
                navigate('/admin/contact-queries');
                setSelectedQuery(null);
                setIsDetailOpen(false);
                // Refresh the queries list
                fetchQueries(true, 1);
              }}
              variant="secondary"
              className="flex items-center gap-2"
            >
              ← Back to All Queries
            </Button>
          )}
          <Button
            onClick={() => fetchQueries(true, currentPage)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          {/* <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Queries
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Under Review
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.underReview}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.resolved}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="priority-desc">
                  High Priority First
                </SelectItem>
                <SelectItem value="status-asc">Status A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Queries List */}
      <Card>
        <CardContent className="p-0">
          {loading && queries.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Loading queries...</p>
              </div>
            </div>
          ) : queries.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No queries found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {queries.map((query, index) => (
                <motion.div
                  key={query.queryId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div 
                    className={`flex items-start justify-between ${
                      queryId === query.queryId 
                        ? 'bg-blue-50 border-2 border-blue-200 rounded-lg p-4 -m-2' 
                        : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate max-w-md">
                          {query.subject}
                        </h3>
                        {queryId === query.queryId && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            📧 From Email
                          </Badge>
                        )}
                        <Badge className={statusColors[query.status]}>
                          {query.status.replace('_', ' ')}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={priorityColors[query.priority]}
                        >
                          {query.priority}
                        </Badge>
                        {query.category && (
                          <Badge variant="secondary">{query.category}</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {query.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {query.email}
                        </div>
                        {query.phoneNumber && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {query.phoneNumber}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(query.createdAt)}
                        </div>
                      </div>

                      <p className="text-gray-700 line-clamp-2 mb-3">
                        {query.message}
                      </p>

                      {query.assignedToName && (
                        <p className="text-sm text-blue-600">
                          Assigned to: {query.assignedToName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedQuery(query);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusModal(query)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Mark as Spam?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will mark the query as spam and remove it
                              from the list. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => markAsSpam(query.queryId)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Mark as Spam
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pagination Controls */}
              {queries.length > 0 && (
                <div className="p-6 text-center border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} • Showing {queries.length} queries
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => fetchQueries(false, currentPage - 1)}
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1 || loading}
                      >
                        {loading ? (
                          <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                        ) : null}
                        Previous
                      </Button>
                      
                      <span className="text-sm text-gray-500 px-3">
                        Page {currentPage}
                      </span>
                      
                      <Button
                        onClick={() => fetchQueries(false, currentPage + 1)}
                        variant="outline"
                        size="sm"
                        disabled={!hasMore || loading}
                      >
                        Next
                        {loading ? (
                          <RefreshCw className="w-3 h-3 animate-spin ml-1" />
                        ) : null}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Query Details
              {queryId && (
                <span className="ml-2 text-blue-600 font-normal text-sm">
                  (Accessed via email link)
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedQuery && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {selectedQuery.subject}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedQuery.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedQuery.email}</span>
                    </div>
                    {selectedQuery.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedQuery.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[selectedQuery.status]}>
                      {selectedQuery.status.replace('_', ' ')}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={priorityColors[selectedQuery.priority]}
                    >
                      {selectedQuery.priority}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Created: {formatDate(selectedQuery.createdAt)}</p>
                    <p>Updated: {formatDate(selectedQuery.updatedAt)}</p>
                    {selectedQuery.resolvedAt && (
                      <p>Resolved: {formatDate(selectedQuery.resolvedAt)}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message */}
              <div>
                <h4 className="font-medium mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedQuery.adminNotes && (
                <div>
                  <h4 className="font-medium mb-2">Admin Notes</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {selectedQuery.adminNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Response */}
              {selectedQuery.responseMessage && (
                <div>
                  <h4 className="font-medium mb-2">Response Sent</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {selectedQuery.responseMessage}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => openStatusModal(selectedQuery)}
                  variant="outline"
                >
                  Update Status
                </Button>

                <Button
                  onClick={() => openNotesModal(selectedQuery)}
                  variant="outline"
                >
                  Add Notes
                </Button>

                <Button
                  onClick={() => openResponseModal(selectedQuery)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Send Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsStatusModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate}>Update Status</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes Modal */}
      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin Notes</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Add internal notes about this query..."
              rows={6}
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsNotesModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleNotesUpdate}>Save Notes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Response</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              placeholder="Type your response to the user..."
              rows={8}
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsResponseModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleResponseSend}>Send Response</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContactQueriesPage;
