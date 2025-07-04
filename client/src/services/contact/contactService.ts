import { axiosInstance } from '../../utils/config';

export interface ContactQueryData {
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  source?: string;
}

export interface ContactQueryResponse {
  queryId: string;
  referenceId: string;
  status: string;
  submittedAt: string;
}

export interface ContactQuery {
  queryId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  category: string;
  status: 'pending' | 'under_review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedBy?: string;
  submittedByName?: string;
  assignedTo?: string;
  assignedToName?: string;
  adminNotes?: string;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ContactQueryStats {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
  closed: number;
  highPriority: number;
  todayCount: number;
  weekCount: number;
  categoryBreakdown: Array<{ category: string; count: number }>;
}

export interface ContactQueryFilters {
  page?: number;
  limit?: number;
  status?: string | string[];
  category?: string;
  priority?: string;
  assignedTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ContactService {
  // Submit a new contact query (public endpoint)
  async submitContactQuery(data: ContactQueryData): Promise<ContactQueryResponse> {
    try {
      const response = await axiosInstance.post('/api/contact/submit', data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit contact query';
      throw new Error(message);
    }
  }

  // Get user's own queries (authenticated)
  async getMyQueries(filters: ContactQueryFilters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axiosInstance.get(`/api/contact/my-queries?${params}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch your queries';
      throw new Error(message);
    }
  }

  // Admin endpoints
  async getContactQueries(filters: ContactQueryFilters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await axiosInstance.get(`/api/contact/queries?${params}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch contact queries';
      throw new Error(message);
    }
  }

  async getContactQuery(queryId: string): Promise<ContactQuery> {
    try {
      const response = await axiosInstance.get(`/api/contact/queries/${queryId}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch contact query';
      throw new Error(message);
    }
  }

  async updateContactQueryStatus(queryId: string, status: string, notes?: string): Promise<ContactQuery> {
    try {
      const response = await axiosInstance.patch(`/api/contact/queries/${queryId}/status`, {
        status,
        notes
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update query status';
      throw new Error(message);
    }
  }

  async assignContactQuery(queryId: string, assignedTo: string, notes?: string): Promise<ContactQuery> {
    try {
      const response = await axiosInstance.patch(`/api/contact/queries/${queryId}/assign`, {
        assignedTo,
        notes
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to assign query';
      throw new Error(message);
    }
  }

  async addAdminNotes(queryId: string, adminNotes: string): Promise<ContactQuery> {
    try {
      const response = await axiosInstance.patch(`/api/contact/queries/${queryId}/notes`, {
        adminNotes
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add admin notes';
      throw new Error(message);
    }
  }

  async addResponseMessage(queryId: string, responseMessage: string): Promise<ContactQuery> {
    try {
      const response = await axiosInstance.post(`/api/contact/queries/${queryId}/response`, {
        responseMessage
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send response';
      throw new Error(message);
    }
  }

  async getContactQueryHistory(queryId: string) {
    try {
      const response = await axiosInstance.get(`/api/contact/queries/${queryId}/history`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch query history';
      throw new Error(message);
    }
  }

  async getContactQueryStats(): Promise<ContactQueryStats> {
    try {
      const response = await axiosInstance.get('/api/contact/stats');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch query statistics';
      throw new Error(message);
    }
  }

  async markAsSpam(queryId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/api/contact/queries/${queryId}/spam`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to mark query as spam';
      throw new Error(message);
    }
  }
}

export const contactService = new ContactService();
export default contactService;
