import { createContext, useContext, useState, useEffect } from 'react';
import { initialAssets, initialIssues } from '../data/assets';
import { mockUsers } from '../data/users';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState(initialAssets);
  const [issues, setIssues] = useState(initialIssues);
  const [users] = useState(mockUsers);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('maintainiq_user');
    const savedIssues = localStorage.getItem('maintainiq_issues');
    const savedAssets = localStorage.getItem('maintainiq_assets');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedIssues) setIssues(JSON.parse(savedIssues));
    if (savedAssets) setAssets(JSON.parse(savedAssets));
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('maintainiq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('maintainiq_user');
    }
  }, [user]);

  // Save issues to localStorage
  useEffect(() => {
    localStorage.setItem('maintainiq_issues', JSON.stringify(issues));
  }, [issues]);

  // Save assets to localStorage
  useEffect(() => {
    localStorage.setItem('maintainiq_assets', JSON.stringify(assets));
  }, [assets]);

   const login = (email, password) => {
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      // Password remove karke user set karo - security
      const { password: _,...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast.success(`Welcome back, ${foundUser.name}!`);
      return { success: true, user: userWithoutPassword };
    } else {
      toast.error('Invalid email or password');
      return { success: false, error: 'Invalid credentials' };
    }
  };

   const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };





  // Update issue status with history tracking
  const updateIssueStatus = (issueId, newStatus, note = '') => {
    setIssues(prev => prev.map(issue =>
      issue.id === issueId
     ? {
          ...issue,
            status: newStatus,
            resolvedAt: newStatus === 'Resolved'? new Date().toISOString() : issue.resolvedAt,
            closedAt: newStatus === 'Closed'? new Date().toISOString() : issue.closedAt,
            history: [
            ...(issue.history || []),
              {
                timestamp: new Date().toISOString(),
                action: `Status changed to ${newStatus}`,
                performedBy: user?.name || 'System',
                note: note || undefined
              }
            ]
          }
        : issue
    ));
  };

  // Assign issue to technician
  const assignIssue = (issueId, technicianName) => {
    setIssues(prev => prev.map(issue =>
      issue.id === issueId
     ? {
          ...issue,
            assignedTo: technicianName,
            status: 'Assigned',
            assignedAt: new Date().toISOString(),
            history: [
            ...(issue.history || []),
              {
                timestamp: new Date().toISOString(),
                action: `Assigned to ${technicianName}`,
                performedBy: user?.name || 'Admin'
              }
            ]
          }
        : issue
    ));
  };

  // Add new issue - Public QR report
  const addIssue = (newIssue) => {
    const issueWithHistory = {
    ...newIssue,
      id: newIssue.id || `ISS-${Date.now()}`,
      issueNumber: newIssue.issueNumber || `MI-${Date.now()}`,
      reportedAt: newIssue.reportedAt || new Date().toISOString(),
      status: newIssue.status || 'Reported',
      priority: newIssue.priority || 'Medium',
      assignedTo: newIssue.assignedTo || null,
      history: newIssue.history || [
        {
          timestamp: new Date().toISOString(),
          action: 'Issue reported via QR scan',
          performedBy: 'Anonymous User'
        }
      ]
    };
    setIssues(prev => [issueWithHistory,...prev]);
  };

  // Add new asset
  const addAsset = (assetData) => {
    const newAsset = {
    ...assetData,
      id: assetData.id || `AST-${Date.now()}`,
      assetCode: assetData.assetCode || `AC-${Date.now().toString().slice(-6)}`,
      status: assetData.status || 'Operational',
      installDate: assetData.installDate || new Date().toISOString(),
      lastInspection: assetData.lastInspection || null,
      history: assetData.history || [
        {
          timestamp: new Date().toISOString(),
          action: 'Asset registered',
          performedBy: user?.name || 'Admin'
        }
      ]
    };
    setAssets(prev => [...prev, newAsset]);
  };

  // Update asset status
  const updateAssetStatus = (assetId, newStatus) => {
    setAssets(prev => prev.map(asset =>
      asset.id === assetId
     ? {
          ...asset,
            status: newStatus,
            lastInspection: new Date().toISOString(),
            history: [
            ...(asset.history || []),
              {
                timestamp: new Date().toISOString(),
                action: `Status updated to ${newStatus}`,
                performedBy: user?.name || 'System'
              }
            ]
          }
        : asset
    ));
  };

  // Reset demo data
  const resetDemoData = () => {
    setIssues(initialIssues);
    setAssets(initialAssets);
    localStorage.removeItem('maintainiq_issues');
    localStorage.removeItem('maintainiq_assets');
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      assets,
      issues,
      login,
      logout,
      updateIssueStatus,
      assignIssue,
      addAsset,
      updateAssetStatus,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};