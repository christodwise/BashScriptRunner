import { GoogleGenAI, Type } from "@google/genai";
import { ScriptSimulationResponse } from '../types';

// Check for API Key
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("Missing API_KEY in environment variables. Simulation will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-init' });

export class ScriptExecutionSocket {
  public onopen: (() => void) | null = null;
  public onmessage: ((event: { data: string }) => void) | null = null;
  public onclose: ((event: { code: number, reason: string }) => void) | null = null;
  public onerror: ((event: { error: any }) => void) | null = null;

  private isStopped = false;
  private fullOutput: string = "";

  constructor(private scriptName: string, private args: string) {}

  public stop() {
    this.isStopped = true;
    this.emitMessage("\n\x1b[31m^C [Script interrupted by user]\x1b[0m\n");
    this.emitClose(130, "Interrupted");
  }

  public async connect() {
    // Simulate connection delay
    await new Promise(r => setTimeout(r, 300));

    if (this.onopen) this.onopen();

    // Fallback for no API key
    if (!apiKey) {
      this.emitMessage("\x1b[31mERROR: API Key not configured.\nPlease set process.env.API_KEY to run the AI simulation.\x1b[0m\n");
      this.emitClose(1, "Missing Configuration");
      return;
    }

    const prompt = `
      You are a Linux Kernel and Bash shell simulator. 
      Execute the following command and stream the standard output (stdout) and standard error (stderr) as if it were running in a real terminal.
      
      Script: ./scripts/${this.scriptName}
      Arguments: ${this.args}
      
      Context:
      - The system is an Ubuntu 22.04 LTS server.
      - Produce realistic logs with ANSI color codes for a rich terminal experience.
      - Use \x1b[32m(Green)\x1b[0m for success, \x1b[31m(Red)\x1b[0m for errors, \x1b[33m(Yellow)\x1b[0m for warnings, and \x1b[36m(Cyan)\x1b[0m for info/headers.
      
      Scripts Behavior:
      - If the script name matches one of the standard maintenance scripts (health_check.sh, pg_backup.sh, deploy_staging.sh, log_rotation.sh, audit_iptables.sh), execute its specific logic with detailed, specialized output (progress bars, specific tables).
      - **If the script name is UNKNOWN (a custom user script)**: Infer its purpose from the filename and arguments. Generate plausible, realistic output that a script with that name would produce. Be creative but realistic for a server environment.
      
      IMPORTANT:
      - Output ONLY the raw terminal text including ANSI codes. 
      - Do NOT use JSON.
      - Stream the output naturally.
      - At the very end of the execution, print exactly the following line to indicate the exit code:
        <<<EXIT_CODE: 0>>> (for success)
        or 
        <<<EXIT_CODE: 1>>> (for failure/error)
      
      If arguments look malicious (rm -rf, etc), print a permission denied error in Red and use exit code 126 or 1.
    `;

    try {
      const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      for await (const chunk of response) {
        if (this.isStopped) {
          return;
        }
        const text = chunk.text;
        if (text) {
          this.emitMessage(text);
          this.fullOutput += text;
        }
      }

      if (this.isStopped) return;

      // Parse exit code from full output
      let exitCode = 0;
      const match = this.fullOutput.match(/<<<EXIT_CODE:\s*(\d+)>>>/);
      if (match) {
        exitCode = parseInt(match[1], 10);
      } else {
        // Default to 0 if no explicit code found, but check for "error" keyword
        if (this.fullOutput.toLowerCase().includes("error")) {
            exitCode = 1;
        } else {
            exitCode = 0; 
        }
      }

      this.emitClose(exitCode, "Completed");

    } catch (error) {
      if (this.isStopped) return;
      console.error("Gemini Stream Error:", error);
      this.emitMessage(`\n\x1b[31mInternal Simulation Error: ${error instanceof Error ? error.message : String(error)}\x1b[0m\n`);
      this.emitClose(255, "Internal Error");
    }
  }

  private emitMessage(data: string) {
    if (this.onmessage) {
      this.onmessage({ data });
    }
  }

  private emitClose(code: number, reason: string) {
    if (this.onclose) {
      this.onclose({ code, reason });
    }
  }
}

// Legacy function kept for type compatibility if needed, but unused.
export const simulateScriptExecution = async (
  scriptName: string,
  args: string
): Promise<ScriptSimulationResponse> => {
  return { stdout: "Deprecated", stderr: "", exitCode: 0 };
};