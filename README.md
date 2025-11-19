<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  # 🚀 BashRunner - AI-Powered Script Execution Simulator
  
  **A secure, simulated web interface for executing bash scripts with realistic AI-generated terminal outputs**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-purple)](https://vitejs.dev/)
  
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Docker Deployment](#-docker-deployment)
- [Architecture](#-architecture)
- [Development](#-development)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**BashRunner** is a modern web application that provides a safe, simulated environment for executing bash scripts. Instead of running actual system commands, it leverages **Google's Gemini AI** to generate realistic terminal outputs, making it perfect for:

- 🎓 **Training and Education**: Teach bash scripting without risk
- 🧪 **Testing and Demonstrations**: Show script behavior without actual execution
- 📊 **Simulated Monitoring**: Display realistic system operations
- 🛡️ **Safe Prototyping**: Test script workflows without system modifications

The application uses AI to understand script context and generate authentic-looking terminal outputs complete with ANSI colors, progress indicators, and realistic timing.

---

## ✨ Features

### 🎨 Modern UI/UX
- **Sleek Dark Theme**: Professional terminal-inspired design
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Real-time Streaming**: Watch output appear character by character
- **ANSI Color Support**: Full terminal color rendering

### 🔐 Security First
- **Simulated Execution**: No actual system commands are executed
- **User Authentication**: Built-in login system
- **Predefined Scripts**: Safe, curated script library
- **Risk Level Indicators**: Visual warnings for high-risk operations

### 🛠️ Script Management
- **Predefined Scripts**: 5 ready-to-use maintenance scripts
  - System Health Check
  - Database Backup
  - Deploy to Staging
  - Log Rotation
  - Firewall Audit
- **Custom Scripts**: Create and manage your own scripts
- **Script Categories**: Organized by maintenance, deployment, monitoring, and security
- **Argument Support**: Pass parameters to scripts with validation

### 📊 Execution History
- **Audit Log**: Complete execution history with timestamps
- **Status Tracking**: Success/failure indicators
- **Output Review**: Access stdout/stderr from past executions
- **Performance Metrics**: Execution duration tracking

### 🤖 AI-Powered Simulation
- **Context-Aware**: Understands script purpose from filename and arguments
- **Realistic Output**: Generates authentic terminal responses
- **Error Handling**: Produces realistic error messages
- **Dynamic Behavior**: Adapts to different script types and scenarios

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Google Gemini API Key** - [Get one here](https://ai.google.dev/)
- **Git** (for cloning the repository)

Optional for Docker deployment:
- **Docker** (v20.10 or higher) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0 or higher)

---

## 🚀 Quick Start

Get up and running in 3 simple steps:

```bash
# 1. Clone the repository
git clone https://github.com/christodwise/BashScriptRunner.git
cd BashScriptRunner

# 2. Install dependencies
npm install

# 3. Set up your API key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Start the development server
npm run dev
```

Open your browser to `http://localhost:3000` and you're ready to go! 🎉

---

## 💻 Installation

### Standard Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/christodwise/BashScriptRunner.git
   cd BashScriptRunner
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   Or with yarn:
   ```bash
   yarn install
   ```

3. **Configure Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Replace `your_gemini_api_key_here` with your actual Gemini API key.

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Production Build

To create an optimized production build:

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

The build artifacts will be stored in the `dist/` directory.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key for AI simulation | Yes | - |

### Application Settings

The application stores user preferences and data in the browser's local storage:

- **Execution Logs**: History of all script executions
- **Custom Scripts**: User-defined scripts
- **Authentication State**: Current login session

To reset the application, clear your browser's local storage for `localhost:3000`.

---

## 📖 Usage

### First Time Setup

1. **Launch the Application**
   - Navigate to `http://localhost:3000` in your browser

2. **Login**
   - Enter any username (this is for demonstration purposes)
   - The default role is "Administrator"

### Running Scripts

1. **Select a Script**
   - Choose from the predefined scripts or your custom scripts
   - Each script shows:
     - Description
     - Risk level (Low/Medium/High)
     - Category (Monitoring/Maintenance/Deployment/Security)

2. **Add Arguments (Optional)**
   - Click "Add Argument" to pass parameters
   - Examples: `--verbose`, `--compress`, `--branch=develop`

3. **Execute**
   - Click the "Execute Script" button
   - Watch the terminal output stream in real-time
   - Use the "Stop Execution" button to interrupt if needed

4. **Review Results**
   - View the exit code and execution time
   - Check stdout and stderr outputs
   - Access full logs in the "Execution History" tab

### Managing Custom Scripts

1. **Navigate to "Manage Scripts"**
   - Click the settings icon or "Manage Scripts" tab

2. **Create a New Script**
   - Fill in the script details:
     - Name
     - Description
     - Filename (e.g., `my_script.sh`)
     - Category
     - Risk Level
     - Allowed Arguments

3. **Use Your Script**
   - Custom scripts appear alongside predefined scripts
   - They're saved to browser local storage

### Viewing Execution History

1. **Open "Execution History"**
   - Click the history icon or "Audit Log" tab

2. **Review Past Executions**
   - See all script runs with timestamps
   - View execution duration and status
   - Expand entries to see full output
   - Filter by status or script name

---

## 🐳 Docker Deployment

BashRunner can be easily deployed using Docker. See [DOCKER.md](DOCKER.md) for the complete deployment guide.

### Quick Start with Docker

```bash
# 1. Build the image
docker build --build-arg GEMINI_API_KEY=your_api_key_here -t bashrunner:latest .

# 2. Run the container
docker run -d -p 3000:80 --name bashrunner bashrunner:latest

# 3. Access at http://localhost:3000
```

### Quick Start with Docker Compose

```bash
# 1. Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 2. Start the application
docker-compose up -d

# 3. View logs
docker-compose logs -f
```

### What's Included

✅ **Multi-stage build** - Optimized image size (~50MB production)  
✅ **Nginx server** - Production-ready static file serving  
✅ **Health checks** - Built-in health monitoring at `/health`  
✅ **Security** - Non-root user, security headers, gzip compression  
✅ **Auto-restart** - Configurable restart policies  

For detailed Docker deployment instructions, troubleshooting, and production best practices, see **[DOCKER.md](DOCKER.md)**.

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **React 19.2** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.2** - Build tool and dev server
- **Tailwind CSS** - Styling (via inline classes)

**AI Integration:**
- **Google Gemini AI** - Script output simulation
- **@google/genai** - Official Gemini SDK

**Utilities:**
- **ansi-to-html** - Terminal color rendering

### Project Structure

```
BashScriptRunner/
├── components/           # React components
│   ├── Login.tsx        # Authentication UI
│   ├── ScriptRunner.tsx # Main script execution interface
│   ├── ScriptManager.tsx# Custom script management
│   ├── HistoryLog.tsx   # Execution history viewer
│   └── Icons.tsx        # SVG icon components
├── services/            # Business logic
│   └── geminiService.ts # AI simulation service
├── App.tsx              # Main application component
├── constants.ts         # Predefined scripts and configs
├── types.ts             # TypeScript type definitions
├── index.tsx            # Application entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
├── Dockerfile           # Docker container definition
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # This file
```

### How It Works

1. **User Interface**: User selects a script and parameters
2. **WebSocket Simulation**: Creates a simulated WebSocket connection
3. **AI Request**: Sends script context to Gemini AI
4. **Streaming Response**: AI generates realistic terminal output
5. **Real-time Display**: Output streams to the UI with ANSI colors
6. **Result Logging**: Execution details saved to local storage

### Data Flow

```
User Input → Script Selection → Gemini AI → Simulated Output → UI Display → History Log
```

---

## 🔧 Development

### Development Server

```bash
npm run dev
```

Starts Vite dev server with hot module replacement at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Code Style

The project uses TypeScript strict mode and follows React best practices:

- **Functional Components**: Using React hooks
- **Type Safety**: Full TypeScript coverage
- **Component Structure**: Single responsibility principle
- **State Management**: React hooks (useState, useEffect)
- **Local Storage**: Persistence layer for logs and scripts

### Adding New Predefined Scripts

Edit `constants.ts` to add new predefined scripts:

```typescript
{
  id: '6',
  name: 'Your Script Name',
  description: 'What your script does',
  filename: 'your_script.sh',
  allowedArgs: ['--flag1', '--flag2'],
  category: 'monitoring',
  riskLevel: 'low'
}
```

### Customizing AI Behavior

Modify the prompt in `services/geminiService.ts` to adjust how the AI simulates script execution:

```typescript
const prompt = `
  You are a Linux Kernel and Bash shell simulator.
  // Customize behavior here
`;
```

---

## 🔒 Security

### Important Security Notes

⚠️ **This application DOES NOT execute actual bash commands** - it's purely a simulation using AI.

**Security Features:**
- ✅ No system access - completely sandboxed
- ✅ All execution is simulated via AI
- ✅ No file system modifications
- ✅ No network access from scripts
- ✅ Risk level warnings for high-impact operations

**Best Practices:**
- 🔑 Keep your Gemini API key secure
- 🔒 Don't commit `.env.local` to version control
- 🚫 Don't share API keys in screenshots or demos
- 📝 Review custom scripts before adding them

**API Key Security:**
The Gemini API key is:
- Stored in environment variables
- Never exposed to the client (handled at build time)
- Not included in version control (via `.gitignore`)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues

Found a bug or have a feature request?

1. Check if the issue already exists
2. Create a new issue with detailed information
3. Include steps to reproduce (for bugs)
4. Add screenshots if applicable

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/BashScriptRunner.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   npm run build
   npm run preview
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Wait for review

### Development Guidelines

- ✅ Use TypeScript for all new code
- ✅ Follow React hooks best practices
- ✅ Keep components focused and reusable
- ✅ Add types for all functions and components
- ✅ Test thoroughly before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful AI simulation capabilities
- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **Open Source Community** - For inspiration and tools

---

## 📞 Support

Having issues or questions?

- 📧 **Email**: Open an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions
- 🐛 **Bug Reports**: Create an issue with the "bug" label
- 💡 **Feature Requests**: Create an issue with the "enhancement" label

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐️ on GitHub!

---

<div align="center">
  
  **Made with ❤️ and ☕ by the BashRunner Team**
  
  [View Demo](https://ai.studio/apps/drive/1XghhngeA8VPUJ2kPz195JtsFqIu83V5Z) • [Report Bug](https://github.com/christodwise/BashScriptRunner/issues) • [Request Feature](https://github.com/christodwise/BashScriptRunner/issues)
  
</div>
