import React, { createContext, useEffect, useState } from 'react'

const AppContext = createContext();

export function AppProvider({children}) {
  const [assets,setAssets] = useState([]);
  const [issues,setIssues] = useState([])
  const [user,setUser] = useState(null);

  useEffect(()=>{
    const storedAssets = localStorage.getItem('maintainiq_assets');
    const storedIssues = localStorage.getItem('maintainiq_issues');
    setAssets(storedAssets? JSON.parse(storedAssets) : initialAssets);
    setIssues(storedIssues? JSON.parse(storedIssues) : initialIssues);
  },[])

   useEffect(() => {
    localStorage.setItem('maintainiq_assets', JSON.stringify(assets));
  }, [assets]);
  
  useEffect(() => {
    localStorage.setItem('maintainiq_issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = (newIssue) =>{
    const issueNumber = `ISS-2026-${String(issues.length).padStart(3,'0')}`;
    const issue = {
        ...newIssue,
        id: `ISS-${Date.now()}`,
        issueNumber,
        status:'Reported',
        reportedAt: new Date().toISOString(),
    };
    setIssues([issue,...issues]);

setAssets(assets.map(a =>
      a.id === newIssue.assetId? {...a, status: 'Issue Reported' } : a
    ));

    toast.success('Issue reported successfully!');
    return issue;
  };

  const resetDemoData = () => {
    setAssets(initialAssets);
    setIssues(initialIssues);
    toast.success('Demo data reset!');
  };

  return (
    <AppContext.Provider value={{
      assets, issues, user, setUser,
      addIssue, resetDemoData, setIssues, setAssets
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext)