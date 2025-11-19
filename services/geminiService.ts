import { GoogleGenAI, Type } from "@google/genai";
import { ScriptSimulationResponse } from '../types';

// Check for API Key
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("Missing API_KEY in environment variables. Simulation will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-init' });

export const simulateScriptExecution = async (
  scriptName: string,
  args: string
): Promise<ScriptSimulationResponse> => {
  
  // Fallback for no API key in demo mode (prevents app crash if user just clones without env)
  if (!apiKey) {
    return {
      stdout: "ERROR: API Key not configured.\nPlease set process.env.API_KEY to run the AI simulation.\n\n[Mock Output] Script would have run here.",
      stderr: "Missing API Configuration",
      exitCode: 1
    };
  }

  const prompt = `
    You are a Linux Kernel and Bash shell simulator. 
    Execute the following command conceptually and generate a realistic output.
    
    Script: ./scripts/${scriptName}
    Arguments: ${args}
    
    Context:
    - The system is an Ubuntu 22.04 LTS server.
    - 'health_check.sh' should show CPU/Mem usage, disk space (df -h), and uptime.
    - 'pg_backup.sh' should show pg_dump logs, compression steps, and upload to S3 simulation.
    - 'deploy_staging.sh' should show git pull, npm install or docker compose up logs.
    - 'log_rotation.sh' should show compressing /var/log files.
    - 'audit_iptables.sh' should list iptables rules.

    If the arguments look malicious (e.g. containing rm -rf, ;, &&, |, >), return a permission denied error or syntax error in stderr and exit code 126 or 1.
    Otherwise, generate a successful (or realistically failed if args are bad) execution log.
    
    Generate around 10-20 lines of realistic stdout log.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stdout: {
              type: Type.STRING,
              description: "The standard output of the script execution.",
            },
            stderr: {
              type: Type.STRING,
              description: "The standard error of the script execution (if any).",
            },
            exitCode: {
              type: Type.INTEGER,
              description: "The exit code (0 for success, non-zero for failure).",
            },
          },
          required: ["stdout", "stderr", "exitCode"],
        },
      },
    });

    const result = response.text ? JSON.parse(response.text) : null;

    if (!result) {
      throw new Error("Failed to parse AI response");
    }

    return result as ScriptSimulationResponse;

  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return {
      stdout: "",
      stderr: `Internal Simulation Error: ${error instanceof Error ? error.message : String(error)}`,
      exitCode: 255
    };
  }
};
