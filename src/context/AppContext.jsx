import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialAssets, initialIssues } from '../data/assets';
import toast from 'react-hot-toast'; // Ye add karo

const AppContext = createContext();

export function AppProvider({ children }) {

  const [assets, setAssets] = useState(() => {
    const stored = localStorage.getItem('maintainiq_assets');
    return stored? JSON.parse(stored) : initialAssets;
  });

  // Fix 1: issue -> issues
  const [issues, setIssues] = useState(() => {
    const stored = localStorage.getItem('maintainiq_issues');
    return stored? JSON.parse(stored) : initialIssues;
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem('maintainiq_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('maintainiq_issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = (newIssue) => {
    // Fix 2: issues.length + 1 taake duplicate na ho
    const nextNumber = issues.length + 1;
    const issueNumber = `ISS-2026-${String(nextNumber).padStart(3, '0')}`;

    const issue = {
     ...newIssue,
      id: `ISS-${Date.now()}`,
      issueNumber,
      status: 'Reported',
      reportedAt: new Date().toISOString(),
    };

    setIssues([issue,...issues]);

    // Asset ka status update karo
    setAssets(assets.map(a =>
      a.id === newIssue.assetId? {...a, status: 'Issue Reported' } : a
    ));

    toast.success('Issue reported successfully!');
    return issue;
  };

  const updateIssueStatus = (issueId, newStatus, note = '') => {
    setIssues(issues.map(iss => {
      if (iss.id === issueId) {
        const updated = {...iss, status: newStatus };
        if (note) updated.maintenanceNote = note;
        if (newStatus === 'Resolved') updated.resolvedAt = new Date().toISOString();
        return updated;
      }
      return iss;
    }));

    // Agar resolve ho gaya to asset wapas Operational
    if (newStatus === 'Resolved') {
      const issue = issues.find(i => i.id === issueId);
      setAssets(assets.map(a =>
        a.id === issue.assetId? {...a, status: 'Operational' } : a
      ));
    }

    toast.success(`Status updated to ${newStatus}`);
  };

  const resetDemoData = () => {
    setAssets(initialAssets);
    setIssues(initialIssues);
    toast.success('Demo data reset!');
  };

  return (
    <AppContext.Provider value={{
      assets, issues, user, setUser,
      addIssue, updateIssueStatus, resetDemoData,
      setIssues, setAssets
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);