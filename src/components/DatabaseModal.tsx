import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { Database, CheckCircle2, Server, Key, X, RefreshCw, Layers } from 'lucide-react';

interface DatabaseModalProps {
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await userService.getSystemStatus();
      setStatus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Database Architecture</h3>
              <p className="text-xs text-slate-300">Persistent MongoDB Storage Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Active status box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {status?.database?.host || 'MongoDB Connected'}
                </span>
              </div>
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Driver / ODM
                </span>
                <span className="font-semibold text-slate-800">Mongoose (v8.x)</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Storage Type
                </span>
                <span className="font-semibold text-slate-800">
                  {status?.database?.isAtlas ? 'MongoDB Atlas (Cloud)' : 'MongoDB Server'}
                </span>
              </div>
            </div>
          </div>

          {/* MongoDB Atlas Setup Instructions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              How to Connect Your MongoDB Atlas Cluster
            </h4>
            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-mono">
              <p className="text-slate-700 font-sans font-medium mb-1">
                To connect directly to your own MongoDB Atlas database:
              </p>
              <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-[11px] overflow-x-auto select-all">
                MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.abcde.mongodb.net/blognest?retryWrites=true&w=majority
              </div>
              <p className="text-slate-500 font-sans text-[11px] mt-1">
                Add this to your environment file (<code className="text-blue-600">.env</code>) and restart. BlogNest will automatically synchronize all schemas, indexes, and documents with MongoDB Atlas.
              </p>
            </div>
          </div>

          {/* Models list */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Mongoose Schemas & Relationships
            </h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-slate-800">User Schema:</span> name, email (unique), password (bcrypt), role, timestamps.
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-slate-800">Post Schema:</span> title, content, excerpt, author (ref: User), category, tags, commentCount.
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-slate-800">Comment Schema:</span> content, author (ref: User), post (ref: Post), timestamps.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
