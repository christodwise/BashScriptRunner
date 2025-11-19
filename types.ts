export interface ScriptDefinition {
  id: string;
  name: string;
  description: string;
  filename: string;
  allowedArgs: string[]; // Hints for UI
  category: 'maintenance' | 'deployment' | 'monitoring' | 'security';
  riskLevel: 'low' | 'medium' | 'high';
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface ExecutionLog {
  id: string;
  scriptId: string;
  scriptName: string;
  timestamp: number;
  durationMs: number;
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  exitCode: number;
  executedBy: string;
  arguments: string;
}

export interface ScriptSimulationResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
}
