import { ScriptDefinition } from './types';

export const APP_NAME = "Bash Runner UI";

export const PREDEFINED_SCRIPTS: ScriptDefinition[] = [
  {
    id: '1',
    name: 'System Health Check',
    description: 'Checks CPU, Memory, and Disk usage statistics.',
    filename: 'health_check.sh',
    allowedArgs: ['--verbose', '--json'],
    category: 'monitoring',
    riskLevel: 'low'
  },
  {
    id: '2',
    name: 'Database Backup',
    description: 'Create a snapshot of the primary PostgreSQL database.',
    filename: 'pg_backup.sh',
    allowedArgs: ['--compress', '--target=s3'],
    category: 'maintenance',
    riskLevel: 'medium'
  },
  {
    id: '3',
    name: 'Deploy to Staging',
    description: 'Pulls latest code from git and restarts services.',
    filename: 'deploy_staging.sh',
    allowedArgs: ['--branch=develop', '--force'],
    category: 'deployment',
    riskLevel: 'high'
  },
  {
    id: '4',
    name: 'Rotate Logs',
    description: 'Archives old logs and restarts syslog service.',
    filename: 'log_rotation.sh',
    allowedArgs: ['--retention=7d'],
    category: 'maintenance',
    riskLevel: 'medium'
  },
  {
    id: '5',
    name: 'Firewall Audit',
    description: 'Lists open ports and recent blocked attempts.',
    filename: 'audit_iptables.sh',
    allowedArgs: [],
    category: 'security',
    riskLevel: 'low'
  }
];
