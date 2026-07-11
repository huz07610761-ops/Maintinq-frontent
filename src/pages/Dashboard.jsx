import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Filter, AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, issues, assets, updateIssueStatus, setUser, resetDemoData } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

 useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

   if (!user) {
    return null; // Ya loading spinner dikha do
  }

  const filteredIssues = issues.filter(issue => {
    if (user.role === 'technician' && issue.assignedTo!== user.name) return false;
    if (statusFilter!== 'all' && issue.status!== statusFilter) return false;
    if (priorityFilter!== 'all' && issue.priority!== priorityFilter) return false;
    if (searchQuery &&!issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: issues.length,
    open: issues.filter(i =>!['Resolved', 'Closed'].includes(i.status)).length,
    myTasks: issues.filter(i => i.assignedTo === user.name).length,
    resolvedToday: issues.filter(i => {
      if (!i.resolvedAt) return false;
      return new Date(i.resolvedAt).toDateString() === new Date().toDateString();
    }).length,
  };

  const getStatusColor = (status) => {
    const colors = {
      'Reported': 'bg-yellow-100 text-yellow-800',
      'Assigned': 'bg-blue-100 text-blue-800',
      'Inspection Started': 'bg-purple-100 text-purple-800',
      'Maintenance In Progress': 'bg-orange-100 text-orange-800',
      'Waiting for Parts': 'bg-red-100 text-red-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-slate-100 text-slate-700',
      'Medium': 'bg-blue-100 text-blue-700',
      'High': 'bg-orange-100 text-orange-700',
      'Critical': 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getAssetName = (assetId) => assets.find(a => a.id === assetId)?.name || 'Unknown';

  const handleUpdateStatus = (issueId, newStatus) => {
    updateIssueStatus(issueId, newStatus);
    setSelectedIssue(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">MaintainIQ</h1>
            <p className="text-sm text-slate-500">
              {user.role === 'admin'? 'Administrator Dashboard' : 'Technician Dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">{user.name}</span>
            <button
              onClick={() => { setUser(null); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards - Admin Only */}
        {user.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Issues', value: stats.total, icon: AlertCircle, color: 'text-slate-600' },
              { label: 'Open Issues', value: stats.open, icon: Clock, color: 'text-orange-600' },
              { label: 'My Tasks', value: stats.myTasks, icon: Wrench, color: 'text-blue-600' },
              { label: 'Resolved Today', value: stats.resolvedToday, icon: CheckCircle, color: 'text-green-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Issues Table */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {user.role === 'admin'? 'All Issues' : 'My Assigned Issues'}
              </h2>
              {user.role === 'admin' && (
                <button
                  onClick={resetDemoData}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
                >
                  Reset Demo Data
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 max-w-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="Reported">Reported</option>
                <option value="Assigned">Assigned</option>
                <option value="Inspection Started">Inspection Started</option>
                <option value="Maintenance In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-600">Issue #</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600">Asset</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600">Title</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600">Priority</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600">Assigned To</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length === 0? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-slate-500">
                      No issues found
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr key={issue.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-mono text-sm">{issue.issueNumber}</td>
                      <td className="p-4">{getAssetName(issue.assetId)}</td>
                      <td className="p-4 max-w-xs truncate">{issue.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="p-4">{issue.assignedTo || '-'}</td>
                      <td className="p-4">
                        {(user.role === 'admin' || issue.assignedTo === user.name) && (
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50"
                          >
                            Update
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedIssue(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Update Issue: {selectedIssue.issueNumber}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Status</label>
                <select
                  defaultValue={selectedIssue.status}
                  onChange={(e) => handleUpdateStatus(selectedIssue.id, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Reported">Reported</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Inspection Started">Inspection Started</option>
                  <option value="Maintenance In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;