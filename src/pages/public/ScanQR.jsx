import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { QrCode, Search, ArrowRight, Smartphone } from 'lucide-react';

const ScanQR = () => {
  const navigate = useNavigate();
  const { assets } = useApp();
  const [assetCode, setAssetCode] = useState('');
  const [error, setError] = useState('');

  // QR scan simulate karna - demo ke liye asset select kar do
  const handleQuickSelect = (assetId) => {
    navigate(`/asset/${assetId}`);
  };

  // Asset code se search karo
  const handleSearch = (e) => {
    e.preventDefault();
    const found = assets.find(a => 
      a.assetCode.toLowerCase() === assetCode.toLowerCase() ||
      a.id.toLowerCase() === assetCode.toLowerCase()
    );
    
    if (found) {
      navigate(`/asset/${found.id}`);
    } else {
      setError('Asset not found. Try: LIB-AC-01, CLS-PROJ-01, LAB-MICRO-05');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <QrCode className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MaintainIQ</h1>
              <p className="text-sm text-gray-500">Scan Asset QR Code</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 mt-8">
        {/* QR Scanner Mock */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Smartphone className="text-blue-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Scan QR Code on Asset
            </h2>
            <p className="text-gray-600">
              Point your camera at the QR code sticker on the equipment
            </p>
          </div>

          {/* Camera Mock */}
          <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse"></div>
            <div className="text-center z-10">
              <QrCode className="text-white/50 mx-auto mb-3" size={80} />
              <p className="text-white/70 text-sm">Camera Preview</p>
              <p className="text-white/50 text-xs mt-1">Demo Mode: Use quick select below</p>
            </div>
            {/* Scanning Frame */}
            <div className="absolute inset-8 border-2 border-blue-400 rounded-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br"></div>
            </div>
          </div>

          {/* Manual Entry */}
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter Asset Code manually
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={assetCode}
                  onChange={(e) => {
                    setAssetCode(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. LIB-AC-01 or AST-001"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
              >
                Search
                <ArrowRight size={18} />
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </form>
        </div>

        {/* Quick Select for Demo */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Demo: Quick Select Asset
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            For hackathon demo, click any asset below to simulate QR scan
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleQuickSelect(asset.id)}
                className="text-left p-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {asset.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {asset.assetCode} • {asset.location}
                    </p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      asset.status === 'Operational' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-blue-600 mt-1" size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;