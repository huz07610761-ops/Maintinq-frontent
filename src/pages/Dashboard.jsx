import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  AlertCircle,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  QrCode,
  CheckCircle,
  Clock,
  Wrench,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, issues, assets, updateIssueStatus, setUser, resetDemoData } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Filter issues based on role
  const filteredIssues = issues.filter(issue => {
    if (user.role === 'technician' && issue.assignedTo!== user.name) return false;
    if (statusFilter!== 'all' && issue.status!== statusFilter) return false;
    if (priorityFilter!== 'all' && issue.priority!== priorityFilter) return false;
    if (searchQuery &&!issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Stats
  const stats = {
    totalAssets: assets.length,
    operationalAssets: assets.filter(a => a.status === 'Operational').length,
    totalIssues: issues.length,
    openIssues: issues.filter(i =>!['Resolved', 'Closed'].includes(i.status)).length,
    criticalIssues: issues.filter(i => i.priority === 'Critical').length,
    resolvedToday: issues.filter(i => {
      if (!i.resolvedAt) return false;
      return new Date(i.resolvedAt).toDateString() === new Date().toDateString();
    }).length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Operational': 'bg-green-100 text-green-800 border-green-200',
      'Reported': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Assigned': 'bg-blue-100 text-blue-800 border-blue-200',
      'Inspection Started': 'bg-purple-100 text-purple-800 border-purple-200',
      'Maintenance In Progress': 'bg-orange-100 text-orange-800 border-orange-200',
      'Waiting for Parts': 'bg-red-100 text-red-800 border-red-200',
      'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Closed': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'Low': 'bg-slate-100 text-slate-700 border-slate-200',
      'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
      'High': 'bg-orange-100 text-orange-700 border-orange-200',
      'Critical': 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[priority] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getAssetName = (assetId) => assets.find(a => a.id === assetId)?.name || 'Unknown';

  const menuItems = user.role === 'admin'? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: Package },
    { id: 'issues', label: 'Issues', icon: AlertCircle },
    { id: 'technicians', label: 'Technicians', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'issues', label: 'My Tasks', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench size={18} />
              </div>
              <span className="font-bold text-lg">MaintainIQ</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            {sidebarOpen? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                 ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => { setUser(null); navigate('/'); }}
              className="w-full mt-3 flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {activeTab === 'dashboard'? 'Dashboard Overview' : activeTab}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {user.role === 'admin'? 'Manage your maintenance operations' : 'Track your assigned tasks'}
            </p>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Assets', value: stats.totalAssets, icon: Package, color: 'blue', change: '+2' },
                  { label: 'Operational', value: stats.operationalAssets, icon: CheckCircle, color: 'green', change: '98%' },
                  { label: 'Open Issues', value: stats.openIssues, icon: AlertCircle, color: 'orange', change: '-3' },
                  { label: 'Resolved Today', value: stats.resolvedToday, icon: TrendingUp, color: 'emerald', change: '+5' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                        <stat.icon className={`text-${stat.color}-600`} size={24} />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-700`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Issues */}
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Issues</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Issue #</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Asset</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Priority</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Assigned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {issues.slice(0, 5).map(issue => (
                        <tr key={issue.id} className="hover:bg-slate-50">
                          <td className="p-4 font-mono text-sm">{issue.issueNumber}</td>
                          <td className="p-4 text-sm">{getAssetName(issue.assetId)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(issue.priority)}`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(issue.status)}`}>
                              {issue.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-slate-700">{issue.assignedTo || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && user.role === 'admin' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Asset Management</h2>
                  <p className="text-sm text-slate-500">Manage all registered assets</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={18} />
                  Add Asset
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Asset Code</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Name</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Category</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Location</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {assets.map(asset => (
                        <tr key={asset.id} className="hover:bg-slate-50">
                          <td className="p-4 font-mono text-sm">{asset.assetCode}</td>
                          <td className="p-4 text-sm font-medium">{asset.name}</td>
                          <td className="p-4 text-sm text-slate-600">{asset.category}</td>
                          <td className="p-4 text-sm text-slate-600">{asset.location}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(asset.status)}`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-slate-100 rounded-lg" title="View QR">
                                <QrCode size={16} />
                              </button>
                              <button className="p-2 hover:bg-slate-100 rounded-lg" title="Edit">
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Issues Tab */}
          {activeTab === 'issues' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {user.role === 'admin'? 'All Issues' : 'My Tasks'}
                  </h2>
                  <p className="text-sm text-slate-500">{filteredIssues.length} issues found</p>
                </div>
                {user.role === 'admin' && (
                  <button
                    onClick={resetDemoData}
                    className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Reset Demo Data
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="all">All Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Issues Table */}
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Issue #</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Asset</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Title</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Priority</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Assigned To</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredIssues.map(issue => (
                        <tr key={issue.id} className="hover:bg-slate-50">
                          <td className="p-4 font-mono text-sm">{issue.issueNumber}</td>
                          <td className="p-4 text-sm">{getAssetName(issue.assetId)}</td>
                          <td className="p-4 text-sm max-w-xs truncate">{issue.title}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(issue.priority)}`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(issue.status)}`}>
                              {issue.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-slate-700">{issue.assignedTo || '-'}</td>
                          <td className="p-4">
                            <button
                              onClick={() => setSelectedIssue(issue)}
                              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Technicians Tab */}
          {activeTab === 'technicians' && user.role === 'admin' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Technician Management</h2>
              <p className="text-slate-500">Coming soon - Manage technicians and view performance metrics</p>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && user.role === 'admin' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Analytics & Reports</h2>
              <p className="text-slate-500">Coming soon - Charts and MTTR analytics</p>
            </div>
          )}
        </div>
      </main>

      {/* Update Issue Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedIssue(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Update Issue</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedIssue.issueNumber}</p>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Status</label>
                <select
                  defaultValue={selectedIssue.status}
                  onChange={(e) => updateIssueStatus(selectedIssue.id, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Reported">Reported</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Inspection Started">Inspection Started</option>
                  <option value="Maintenance In Progress">In Progress</option>
                  <option value="Waiting for Parts">Waiting for Parts</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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