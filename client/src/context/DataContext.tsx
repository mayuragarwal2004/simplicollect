// context/DataContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Chapter } from '../models/Chapter';
import { Member } from '../models/Member';
import { axiosInstance } from '../utils/config';
import { useAuth } from './AuthContext';

// Define the structure of our context's value
interface DataContextProps {
  memberData: Member | null;
  chapterData: Chapter | null;
  getChapterDetails: (chapterId: string) => Promise<void>;
}

// Create the context with an initial default value
const DataContext = createContext<DataContextProps | undefined>(undefined);

// Provider component to wrap around the app or component subtree
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [chapterData, setChapterData] = useState<Chapter | null>(null);

  // Function to fetch chapter details
  const getChapterDetails = async (chapterId: string) => {
    try {
      const response = await axiosInstance(`/api/chapter/${chapterId}`);
      const data = await response.data;
      setChapterData(data);
    } catch (error) {
      console.error('Fetching chapter details failed:', error);
    }
  };

  // Fetch member details
  const fetchMember = async () => {
    try {
      const response = await axiosInstance('/api/member/me');
      const data = await response.data;
      setMemberData(data);
    } catch (error) {
      console.error('Fetching member details failed:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (!memberData) fetchMember();
      if (memberData?.chapterId) {
        getChapterDetails(memberData.chapterId);
      }
    }
  }, [isAuthenticated, memberData]);

  return (
    <DataContext.Provider value={{ memberData, chapterData, getChapterDetails }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to access the DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
