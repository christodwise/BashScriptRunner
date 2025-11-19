import React, { useState } from 'react';
import { ScriptDefinition } from '../types';
import { PlusIcon, TrashIcon, TerminalIcon } from './Icons';

interface ScriptManagerProps {
  customScripts: ScriptDefinition[];
  onAddScript: (script: ScriptDefinition) => void;
  onDeleteScript: (id: string) => void;
}

const ScriptManager: React.FC<ScriptManagerProps> = ({ customScripts, onAddScript, onDeleteScript }) => {
  const [newScript, setNewScript] = useState<Partial<ScriptDefinition>>({
    category: 'maintenance',
    riskLevel: 'low',
    allowedArgs: []
  });
  const [argInput, setArgInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newScript.name && newScript.filename && newScript.description) {
      const script: ScriptDefinition = {
        id: crypto.randomUUID(),
        name: newScript.name,
        description: newScript.description,
        filename: newScript.filename.endsWith('.sh') ? newScript.filename : `${newScript.filename}.sh`,
        allowedArgs: argInput.split(',').map(s => s.trim()).filter(s => s.length > 0),
        category: newScript.category as any,
        riskLevel: newScript.riskLevel as any,
      };
      onAddScript(script);
      setNewScript({ category: 'maintenance', riskLevel: 'low', allowedArgs: [] });
      setArgInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <PlusIcon className="w-5 h-5 text-emerald-500" />
            Add Custom Script
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Script Name</label>
              <input
                required
                type="text"
                placeholder="e.g. User Cleanup"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none"
                value={newScript.name || ''}
                onChange={e => setNewScript({...newScript, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Filename</label>
              <input
                required
                type="text"
                placeholder="cleanup_users.sh"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                value={newScript.filename || ''}
                onChange={e => setNewScript({...newScript, filename: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Description</label>
              <textarea
                required
                rows={3}
                placeholder="What does this script do?"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                value={newScript.description || ''}
                onChange={e => setNewScript({...newScript, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Category</label>
                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                  value={newScript.category}
                  onChange={e => setNewScript({...newScript, category: e.target.value as any})}
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="deployment">Deployment</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="security">Security</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Risk Level</label>
                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                  value={newScript.riskLevel}
                  onChange={e => setNewScript({...newScript, riskLevel: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Allowed Arguments (Comma sep)</label>
              <input
                type="text"
                placeholder="--force, --verbose"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                value={argInput}
                onChange={e => setArgInput(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Save Script
            </button>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-slate-400" />
          Custom Scripts Library
        </h3>

        {customScripts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500 border-dashed">
            <div className="bg-slate-800 p-4 rounded-full mb-4">
               <TerminalIcon className="w-8 h-8 opacity-50" />
            </div>
            <p>No custom scripts added yet.</p>
            <p className="text-sm mt-2">Use the form on the left to create your first custom script definition.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customScripts.map(script => (
              <div key={script.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 group hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-slate-200">{script.name}</h4>
                    <div className="text-xs font-mono text-slate-500 mt-1">{script.filename}</div>
                  </div>
                  <button 
                    onClick={() => onDeleteScript(script.id)}
                    className="p-2 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete Script"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{script.description}</p>
                
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded border font-medium uppercase ${
                    script.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    script.riskLevel === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {script.riskLevel}
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 uppercase">
                    {script.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptManager;