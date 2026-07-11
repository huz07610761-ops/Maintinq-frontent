import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AssetPublicPage = () => {
  const { id } = useParams();
  const { assets, addIssue } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: '', priority: 'Medium' });

  const asset = assets.find(a => a.id === id);

  if (!asset) return <div className="p-8 text-center">Asset not found</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    addIssue({
      assetId: asset.id,
      description: formData.description,
      priority: formData.priority,
      title: formData.description.slice(0, 50), // AI Triage mock
      category: 'General',
      reportedBy: 'Public User',
      aiSuggested: true,
      possibleCauses: ['Unknown - needs inspection'],
      initialChecks: ['Visual inspection required'],
    });
    setShowForm(false);
    setFormData({ description: '', priority: 'Medium' });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Operational': 'bg-green-100 text-green-800',
      'Issue Reported': 'bg-yellow-100 text-yellow-800',
      'Under Maintenance': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src={asset.image} alt={asset.name} className="w-full h-48 object-cover" />

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
                <p className="text-sm text-gray-500">{asset.assetCode} • {asset.location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(asset.status)}`}>
                {asset.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{asset.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Condition</p>
                <p className="font-medium">{asset.condition}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Service</p>
                <p className="font-medium">{asset.lastServiceDate}</p>
              </div>
              <div>
                <p className="text-gray-500">Next Service</p>
                <p className="font-medium">{asset.nextServiceDate}</p>
              </div>
            </div>

            {!showForm? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <AlertTriangle size={20} />
                Report an Issue
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Describe the issue</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded-lg p-2 h-24"
                    placeholder="e.g. The AC is making noise and not cooling properly"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full border rounded-lg p-2"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                    Submit Issue
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetPublicPage;