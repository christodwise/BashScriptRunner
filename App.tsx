import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ScriptRunner from './components/ScriptRunner';
import HistoryLog from './components/HistoryLog';
import ScriptManager from './components/ScriptManager';
import { TerminalIcon, HistoryIcon, LogOutIcon, SettingsIcon } from './components/Icons';
import { ExecutionLog, ScriptDefinition } from './types';
import { PREDEFINED_SCRIPTS } from './constants';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'runner' | 'history' | 'manager'>('runner');
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [customScripts, setCustomScripts] = useState<ScriptDefinition[]>([]);

  // Load logs and custom scripts from local storage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('bashRunnerLogs');
    if (savedLogs) {
      try {
        setExecutionLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to load logs", e);
      }
    }

    const savedScripts = localStorage.getItem('bashRunnerCustomScripts');
    if (savedScripts) {
      try {
        setCustomScripts(JSON.parse(savedScripts));
      } catch (e) {
        console.error("Failed to load custom scripts", e);
      }
    }
  }, []);

  // Save logs to local storage whenever they change
  useEffect(() => {
    if (executionLogs.length > 0) {
      localStorage.setItem('bashRunnerLogs', JSON.stringify(executionLogs));
    }
  }, [executionLogs]);

  // Save custom scripts to local storage
  useEffect(() => {
    localStorage.setItem('bashRunnerCustomScripts', JSON.stringify(customScripts));
  }, [customScripts]);

  const handleLogin = (username: string) => {
    setUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser('');
    setActiveTab('runner');
  };

  const handleExecutionComplete = (log: ExecutionLog) => {
    setExecutionLogs(prev => [log, ...prev]);
  };

  const handleAddScript = (script: ScriptDefinition) => {
    setCustomScripts(prev => [...prev, script]);
  };

  const handleDeleteScript = (id: string) => {
    setCustomScripts(prev => prev.filter(s => s.id !== id));
  };

  // Combine predefined and custom scripts
  const allScripts = [...PREDEFINED_SCRIPTS, ...customScripts];

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white">
              <span className="font-mono text-sm">&gt;_</span>
            </div>
            BashRunner
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('runner')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'runner'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <TerminalIcon className="w-5 h-5" />
            <span className="font-medium">Run Scripts</span>
          </button>
          
          <button
            onClick={() => setActiveTab('manager')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'manager'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="font-medium">Manage Scripts</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <HistoryIcon className="w-5 h-5" />
            <span className="font-medium">Execution History</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user}</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="font-bold text-white flex items-center gap-2">
           <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white">
            <span className="font-mono text-sm">&gt;_</span>
          </div>
          BashRunner
        </h1>
        <div className="flex gap-2">
           <button
            onClick={() => setActiveTab('runner')}
            className={`p-2 rounded-lg ${activeTab === 'runner' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
           >
             <TerminalIcon className="w-6 h-6" />
           </button>
           <button
            onClick={() => setActiveTab('manager')}
            className={`p-2 rounded-lg ${activeTab === 'manager' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
           >
             <SettingsIcon className="w-6 h-6" />
           </button>
           <button
            onClick={() => setActiveTab('history')}
            className={`p-2 rounded-lg ${activeTab === 'history' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
           >
             <HistoryIcon className="w-6 h-6" />
           </button>
           <button onClick={handleLogout} className="p-2 text-red-400">
             <LogOutIcon className="w-6 h-6" />
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:pl-64 p-6 lg:p-10 pt-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {activeTab === 'runner' && 'Script Execution'}
              {activeTab === 'manager' && 'Manage Custom Scripts'}
              {activeTab === 'history' && 'Audit Log'}
            </h2>
            <p className="text-slate-400">
              {activeTab === 'runner' && 'Select and execute predefined or custom maintenance scripts safely.'}
              {activeTab === 'manager' && 'Define new scripts to be executed by the system. Changes are saved locally.'}
              {activeTab === 'history' && 'Review past script executions and status reports.'}
            </p>
          </header>

          {activeTab === 'runner' && (
            <div className="animate-fadeIn">
              <ScriptRunner 
                onExecutionComplete={handleExecutionComplete} 
                user={user} 
                availableScripts={allScripts}
              />
            </div>
          )}

          {activeTab === 'manager' && (
            <div className="animate-fadeIn">
              <ScriptManager 
                customScripts={customScripts}
                onAddScript={handleAddScript}
                onDeleteScript={handleDeleteScript}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fadeIn">
              <HistoryLog logs={executionLogs} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;