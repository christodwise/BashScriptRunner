import React, { useState, useRef, useEffect } from 'react';
import { PREDEFINED_SCRIPTS } from '../constants';
import { simulateScriptExecution } from '../services/geminiService';
import { ExecutionLog, ExecutionStatus, ScriptDefinition } from '../types';
import { PlayIcon, TerminalIcon } from './Icons';

interface ScriptRunnerProps {
  onExecutionComplete: (log: ExecutionLog) => void;
  user: string;
}

const ScriptRunner: React.FC<ScriptRunnerProps> = ({ onExecutionComplete, user }) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>(PREDEFINED_SCRIPTS[0].id);
  const [args, setArgs] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>('Ready to execute...');
  const [exitCode, setExitCode] = useState<number | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const selectedScript = PREDEFINED_SCRIPTS.find(s => s.id === selectedScriptId) || PREDEFINED_SCRIPTS[0];

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  const handleRun = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setExitCode(null);
    setConsoleOutput(`> ./scripts/${selectedScript.filename} ${args}\nInitializing environment...\n`);
    
    const startTime = Date.now();

    // Artificial delay to simulate network/startup latency
    await new Promise(r => setTimeout(r, 800));

    const result = await simulateScriptExecution(selectedScript.filename, args);
    const durationMs = Date.now() - startTime;

    // Update Console
    setConsoleOutput(prev => 
      `${prev}\n${result.stdout}\n${result.stderr ? `STDERR:\n${result.stderr}\n` : ''}\n[Process completed with exit code ${result.exitCode}]`
    );
    setExitCode(result.exitCode);
    setIsRunning(false);

    // Create Log Entry
    const status = result.exitCode === 0 ? ExecutionStatus.SUCCESS : ExecutionStatus.FAILURE;
    
    const newLog: ExecutionLog = {
      id: crypto.randomUUID(),
      scriptId: selectedScript.id,
      scriptName: selectedScript.filename,
      timestamp: startTime,
      durationMs,
      status,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      executedBy: user,
      arguments: args
    };

    onExecutionComplete(newLog);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'low': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      {/* Controls Column */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Script Selection Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-emerald-500" />
            Configuration
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Select Script</label>
              <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                value={selectedScriptId}
                onChange={(e) => {
                  setSelectedScriptId(e.target.value);
                  setArgs(''); // Reset args on script change
                }}
              >
                {PREDEFINED_SCRIPTS.map(script => (
                  <option key={script.id} value={script.id}>
                    {script.name} ({script.filename})
                  </option>
                ))}
              </select>
            </div>

            {/* Script Details Info Box */}
            <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded border ${getRiskColor(selectedScript.riskLevel)} uppercase font-bold tracking-wider`}>
                  {selectedScript.riskLevel} Risk
                </span>
                <span className="text-xs text-slate-500 uppercase">{selectedScript.category}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedScript.description}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Arguments (Optional)</label>
              <input
                type="text"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="e.g. --verbose"
                value={args}
                onChange={(e) => setArgs(e.target.value)}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedScript.allowedArgs.map(arg => (
                  <button
                    key={arg}
                    onClick={() => setArgs(prev => prev ? `${prev} ${arg}` : arg)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded transition-colors font-mono"
                  >
                    {arg}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all shadow-lg ${
                isRunning 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Executing...
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  Run Script
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
          <h4 className="text-blue-400 text-sm font-semibold mb-1">Simulation Mode</h4>
          <p className="text-xs text-blue-300/70">
            This interface simulates script execution using the Gemini API. 
            No actual commands are executed on the host server.
          </p>
        </div>

      </div>

      {/* Output Column */}
      <div className="lg:col-span-2 h-[600px] lg:h-auto flex flex-col">
        <div className="bg-slate-950 border border-slate-800 rounded-t-xl p-3 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-950">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
            </div>
            <span className="ml-3 text-xs text-slate-400 font-mono">bash — 80x24</span>
          </div>
          {exitCode !== null && (
            <div className={`text-xs font-mono px-2 py-0.5 rounded ${exitCode === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              Exit: {exitCode}
            </div>
          )}
        </div>
        
        <div className="flex-1 bg-[#0d1117] border-x border-b border-slate-800 rounded-b-xl p-4 overflow-y-auto font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <pre className="whitespace-pre-wrap break-words">
            <span className="text-slate-500 select-none">user@server:~$ </span>
            <span className={exitCode === 0 ? 'text-emerald-400' : exitCode !== null ? 'text-red-400' : 'text-slate-200'}>
              {consoleOutput}
            </span>
            {isRunning && <span className="animate-pulse inline-block w-2 h-4 bg-slate-400 ml-1 align-middle"></span>}
          </pre>
          <div ref={terminalEndRef} />
        </div>
      </div>

    </div>
  );
};

export default ScriptRunner;
