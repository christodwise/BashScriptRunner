import React, { useState, useRef, useEffect, useMemo } from 'react';
import Convert from 'ansi-to-html';
import { ScriptExecutionSocket } from '../services/geminiService';
import { ExecutionLog, ExecutionStatus, ScriptDefinition } from '../types';
import { PlayIcon, TerminalIcon, XCircleIcon } from './Icons';

interface ScriptRunnerProps {
  onExecutionComplete: (log: ExecutionLog) => void;
  user: string;
  availableScripts: ScriptDefinition[];
}

const ScriptRunner: React.FC<ScriptRunnerProps> = ({ onExecutionComplete, user, availableScripts }) => {
  // Use the first script as default if available, otherwise empty
  const [selectedScriptId, setSelectedScriptId] = useState<string>(availableScripts.length > 0 ? availableScripts[0].id : '');
  const [args, setArgs] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [exitCode, setExitCode] = useState<number | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ScriptExecutionSocket | null>(null);

  // Initialize ANSI converter
  const ansiConverter = useMemo(() => new Convert({
    fg: '#e2e8f0', // slate-200
    bg: 'transparent',
    newline: true,
    escapeXML: true,
    colors: {
      0: '#000000', 1: '#ef4444', 2: '#22c55e', 3: '#eab308', 4: '#3b82f6', 5: '#a855f7', 6: '#06b6d4', 7: '#e2e8f0',
    }
  }), []);

  const selectedScript = availableScripts.find(s => s.id === selectedScriptId) || availableScripts[0];

  // Update selected script if the list changes and current selection is invalid
  useEffect(() => {
    if (!availableScripts.find(s => s.id === selectedScriptId) && availableScripts.length > 0) {
      setSelectedScriptId(availableScripts[0].id);
    }
  }, [availableScripts, selectedScriptId]);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.stop();
      }
    };
  }, []);

  const handleStop = () => {
    if (socketRef.current && isRunning) {
      socketRef.current.stop();
    }
  };

  const handleRun = () => {
    if (isRunning || !selectedScript) return;
    
    setIsRunning(true);
    setExitCode(null);
    // Start with a clean prompt
    const initialOutput = `> ./scripts/${selectedScript.filename} ${args}\n\x1b[36m[System] Initializing secure connection...\x1b[0m\n`;
    setConsoleOutput(initialOutput);
    
    const startTime = Date.now();
    let currentRawOutput = initialOutput;

    // Initialize Socket
    const socket = new ScriptExecutionSocket(selectedScript.filename, args);
    socketRef.current = socket;

    socket.onopen = () => {
        // Connection active
    };

    socket.onmessage = (event) => {
        const chunk = event.data;
        // Remove hidden exit code for display
        const displayChunk = chunk.replace(/<<<EXIT_CODE:\s*\d+>>>/g, '');
        
        if (displayChunk) {
            setConsoleOutput(prev => prev + displayChunk);
            currentRawOutput += displayChunk;
        }
    };

    socket.onclose = (event) => {
        const durationMs = Date.now() - startTime;
        setExitCode(event.code);
        setIsRunning(false);
        
        // Append final status
        const statusMsg = event.code === 0 
            ? `\n\x1b[32m✔ Process completed successfully (Exit: 0)\x1b[0m`
            : `\n\x1b[31m✘ Process failed (Exit: ${event.code})\x1b[0m`;
            
        setConsoleOutput(prev => prev + statusMsg);

        const status = event.code === 0 ? ExecutionStatus.SUCCESS : ExecutionStatus.FAILURE;

        const newLog: ExecutionLog = {
            id: crypto.randomUUID(),
            scriptId: selectedScript.id,
            scriptName: selectedScript.filename,
            timestamp: startTime,
            durationMs,
            status,
            stdout: currentRawOutput.replace(/\x1b\[[0-9;]*m/g, ''), // Strip ANSI for plain text logs
            stderr: event.code !== 0 ? "Process returned non-zero exit code" : "",
            exitCode: event.code,
            executedBy: user,
            arguments: args
        };

        onExecutionComplete(newLog);
        socketRef.current = null;
    };

    socket.onerror = (event) => {
        console.error("Socket Error", event);
        setConsoleOutput(prev => prev + "\n\x1b[31mError: Connection to script engine lost.\x1b[0m");
        setIsRunning(false);
    };

    socket.connect();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'low': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  if (!selectedScript) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-10 border border-slate-800 border-dashed rounded-xl bg-slate-900/50">
           <TerminalIcon className="w-12 h-12 mb-4 opacity-50" />
           <p>No scripts available. Add a script in the "Manage Scripts" tab.</p>
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)] min-h-[500px]">
      
      {/* Controls Column */}
      <div className="lg:col-span-1 flex flex-col gap-6 h-full">
        
        {/* Configuration Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex-shrink-0">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-emerald-500" />
            Script Config
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Available Scripts</label>
              <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer hover:border-slate-600"
                value={selectedScriptId}
                onChange={(e) => {
                  setSelectedScriptId(e.target.value);
                  setArgs('');
                }}
                disabled={isRunning}
              >
                {availableScripts.map(script => (
                  <option key={script.id} value={script.id}>
                    {script.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Details Box */}
            <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">{selectedScript.filename}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getRiskColor(selectedScript.riskLevel)} uppercase font-bold tracking-wider`}>
                  {selectedScript.riskLevel}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedScript.description}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Arguments</label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="--flag value"
                  value={args}
                  onChange={(e) => setArgs(e.target.value)}
                  disabled={isRunning}
                />
                {selectedScript.allowedArgs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedScript.allowedArgs.map(arg => (
                      <button
                        key={arg}
                        onClick={() => setArgs(prev => {
                          if (prev.includes(arg)) return prev; // Avoid dupes
                          return prev ? `${prev} ${arg}` : arg;
                        })}
                        disabled={isRunning}
                        className={`text-[10px] px-2 py-1 rounded border transition-colors font-mono ${
                          isRunning 
                            ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' 
                            : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        {arg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-2">
                {!isRunning ? (
                    <button
                      onClick={handleRun}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20 active:scale-[0.98]"
                    >
                      <PlayIcon className="w-4 h-4" />
                      Execute Script
                    </button>
                ) : (
                    <button
                      onClick={handleStop}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all shadow-lg bg-red-600 hover:bg-red-500 shadow-red-900/20 active:scale-[0.98]"
                    >
                      <XCircleIcon className="w-4 h-4" />
                      Stop Execution
                    </button>
                )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 flex flex-col justify-center items-center text-center text-slate-500 gap-2">
           <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
             <TerminalIcon className="w-5 h-5" />
           </div>
           <p className="text-sm max-w-[200px]">
             Output is streamed in real-time via simulated secure WebSocket channel.
           </p>
        </div>

      </div>

      {/* Output Column */}
      <div className="lg:col-span-2 h-full flex flex-col shadow-xl shadow-black/20">
        <div className="bg-slate-800 rounded-t-xl p-3 flex items-center justify-between border-x border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
            </div>
            <div className="ml-3 flex items-center gap-2 bg-black/20 px-3 py-1 rounded text-xs text-slate-400 font-mono border border-white/5">
               <span>bash</span>
               <span className="text-slate-600">/</span>
               <span>{selectedScript.filename}</span>
            </div>
          </div>
          {exitCode !== null && (
            <div className={`text-xs font-mono px-2 py-1 rounded flex items-center gap-1.5 font-bold ${
              exitCode === 0 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {exitCode === 0 ? <span className="text-[10px]">✔</span> : <span className="text-[10px]">✖</span>}
              EXIT {exitCode}
            </div>
          )}
        </div>
        
        <div className="flex-1 bg-[#0f172a] border-x border-b border-slate-700 rounded-b-xl p-4 overflow-y-auto font-mono text-sm scrollbar-thin relative">
          {consoleOutput ? (
            <pre className="whitespace-pre-wrap break-words leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: ansiConverter.toHtml(consoleOutput) }} />
              {isRunning && (
                 <span className="inline-block w-2 h-4 bg-slate-400 align-middle animate-pulse ml-0.5 shadow-[0_0_8px_rgba(148,163,184,0.5)]"></span>
              )}
            </pre>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <TerminalIcon className="w-12 h-12 mb-4" />
                <p>Waiting for execution command...</p>
             </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>

    </div>
  );
};

export default ScriptRunner;