"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
interface DashboardContextProps {
  admin: boolean;
  setAdmin: (admin: boolean) => void;
  it: boolean;
  setIt: (it: boolean) => void;
  sub: string;
  setSub: (sub: string) => void;
  subAdmin: boolean;
  setSubAdmin: (subAdmin: boolean) => void;
  tit: string;
  setTit: (tit: string) => void;
}
const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<boolean>(false);
  const [it, setIt] = useState<boolean>(false);
  const [subAdmin, setSubAdmin] = useState<boolean>(false);
  const [sub, setSub] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sub') || '';
    }
    return '';
  });
  const [tit, setTit] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tit') || '';
    }
    return '';
  });
  React.useEffect(() => {
    localStorage.setItem('sub', sub);
    localStorage.setItem('tit', tit);
  }, [sub]);
  return (
    <DashboardContext.Provider value={{ admin, setAdmin, sub, setSub, subAdmin, setSubAdmin, tit, setTit, it, setIt}}>
      {children}
    </DashboardContext.Provider>
  );
};
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
