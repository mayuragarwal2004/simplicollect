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
  allChaptersData: Chapter[] | null;
  loading: boolean;
  getChapterDetails: (chapterId: string) => Promise<void>;
  switchChapter: (chapterId: string) => void;

}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [allChaptersData, setAllChaptersData] = useState<Chapter[] | null>(null);
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // 👈 NEW

  const fetchAllChapters = async () => {
    setLoading(true); // 👈 START
    try {
      const response = await axiosInstance('/api/chapter');
      const data = await response.data;
      if (data.length === 1) {
        setChapterData(data[0]);
      }
      setAllChaptersData(data);
    } catch (error) {
      console.error('Fetching all chapters failed:', error);
    } finally {
      setLoading(false); // 👈 END
    }
  };

  const switchChapter = (chapterId: string) => {
    const chapter = allChaptersData?.find((c) => c.chapterId === chapterId);
    setChapterData(chapter || null);
  }

  const getChapterDetails = async (chapterId: string) => {
    setLoading(true); // 👈 START
    try {
      const response = await axiosInstance(`/api/chapter/${chapterId}`);
      const data = await response.data;
      setChapterData(data);
    } catch (error) {
      console.error('Fetching chapter details failed:', error);
    } finally {
      setLoading(false); // 👈 END
    }
  };

  const fetchMember = async () => {
    setLoading(true); // 👈 START
    try {
      const response = await axiosInstance('/api/member/me');
      const data = await response.data;
      setMemberData(data);
    } catch (error) {
      console.error('Fetching member details failed:', error);
    } finally {
      setLoading(false); // 👈 END
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (!memberData) fetchMember();
      if (!allChaptersData) fetchAllChapters();
    } else {
      setMemberData(null);
      setAllChaptersData(null);
      setChapterData(null);
    }
  }, [isAuthenticated]);

  return (
    <DataContext.Provider
      value={{
        memberData,
        chapterData,
        allChaptersData,
        loading, // 👈 EXPOSE IT
        switchChapter,
        getChapterDetails,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
