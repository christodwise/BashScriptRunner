import React from 'react';
import { ExecutionLog, ExecutionStatus } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface HistoryLogProps {
  logs: ExecutionLog[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p>No execution history found.</p>
      </div>
    );
  }

  // Sort by newest first
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-400 font-medium tracking-wider">
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Script Name</th>
              <th className="px-6 py-4">Executed At</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4 text-right">Exit Code</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-800/50">
            {sortedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {log.status === ExecutionStatus.SUCCESS ? (
                      <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-xs font-semibold ${log.status === ExecutionStatus.SUCCESS ? 'text-emerald-400' : 'text-red-400'}`}>
                      {log.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-200 font-mono font-medium">{log.scriptName}</div>
                  {log.arguments && (
                    <div className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[200px]">{log.arguments}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono">
                  {log.durationMs}ms
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {log.executedBy}
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-500">
                  {log.exitCode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryLog;
