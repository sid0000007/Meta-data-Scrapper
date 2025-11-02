# Virtual Script Monitor - AWS EC2 Dashboard

A modern, full-stack web application for managing and monitoring AWS EC2 instances and remote Node.js scripts on Windows servers via AWS Systems Manager (SSM).

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0.4-black)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-06b6d4)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Architecture](#architecture)
5. [Tech Stack](#tech-stack)
6. [Installation & Setup](#installation--setup)
7. [Project Structure](#project-structure)
8. [API Documentation](#api-documentation)
9. [Features](#features)
10. [Environment Configuration](#environment-configuration)
11. [Development Guide](#development-guide)
12. [Future Enhancements](#future-enhancements)
13. [Troubleshooting](#troubleshooting)

---

## Overview

**Virtual Script Monitor** is a cloud-based VM monitoring dashboard designed for DevOps teams and operations engineers who need to manage AWS EC2 instances and control distributed Node.js monitoring scripts running on Windows servers.

### Key Capabilities:
- 🖥️ **EC2 Instance Management** - Start/stop EC2 instances from a unified dashboard
- 📜 **Remote Script Execution** - Control Node.js scripts on Windows instances via AWS SSM
- 📊 **Real-time Monitoring** - Auto-refresh instance status every 15 seconds
- 🎨 **Modern UI** - Clean, responsive interface with dark mode support
- ⚡ **Type-Safe** - Full TypeScript implementation with Zod validation
- 🔐 **AWS Native** - Direct integration with AWS SDKs (EC2, SSM, IAM)

---

## Problem Statement

### Challenges Addressed:

1. **Remote Windows VM Management**
   - Difficulty managing Node.js monitoring scripts on Windows EC2 instances without RDP/SSH access
   - Need for a centralized control mechanism

2. **Distributed Instance Control**
   - No unified way to start/stop multiple EC2 instances across the fleet
   - Manual AWS Console access required for each operation

3. **Script Deployment Complexity**
   - Hard to deploy and manage monitoring scripts across different EC2 instances
   - No visibility into which scripts are running on which instances

4. **Operational Overhead**
   - Teams need quick access to control infrastructure without deep AWS knowledge
   - Lack of real-time status visibility for monitoring scripts

---

## Solution

**Virtual Script Monitor** provides:

✅ **Single Dashboard** for EC2 instance management and script control
✅ **One-Click Actions** to start/stop instances and scripts
✅ **Real-Time Status** with automatic refreshing
✅ **User-Friendly Interface** requiring minimal AWS expertise
✅ **Secure API** using AWS credentials and environment variables

### How It Works:

```
Browser Dashboard
    ↓ (Axios HTTP requests)
Next.js API Routes
    ↓ (AWS SDK)
AWS Services (EC2, SSM)
    ↓ (Remote command execution)
Windows EC2 Instances
    ↓ (PowerShell)
Node.js Monitoring Scripts (C:\monitoring)
```

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Browser                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         AdvanceScriptTable Component                │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │   EC2 Instance Management Table             │   │   │
│  │  │   - List instances (ID, Type, State)       │   │   │
│  │  │   - Start/Stop buttons with state feedback │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │   Script Control Table                      │   │   │
│  │  │   - Toggle switches to start/stop scripts  │   │   │
│  │  │   - Status badges (Running/Stopped/Error)  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
         (Axios API calls via REST)
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│         Next.js API Routes (Backend/Node.js)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GET/POST  /api/ec2-instances                       │  │
│  │  - Fetch instances (DescribeInstancesCommand)       │  │
│  │  - Start/Stop instances                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST  /api/scriptRunners                           │  │
│  │  - Execute PowerShell scripts via SSM               │  │
│  │  - start/stop Node.js monitoring scripts            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
      (AWS SDK v3 calls with credentials)
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              AWS Services (Cloud)                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AWS EC2                AWS SSM        AWS IAM       │  │
│  │  - Describe Instances   - SendCommand  - Auth        │  │
│  │  - Start Instances      - GetDocument  - Permissions │  │
│  │  - Stop Instances                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│       Windows EC2 Instances (AWS EC2 Fleet)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Instance ID: i-1234567890abcdef0                     │  │
│  │  ├─ AWS Systems Manager Agent (Running)             │  │
│  │  ├─ Node.js Runtime                                │  │
│  │  └─ C:\monitoring\                                  │  │
│  │     └─ monitor.js (Node.js monitoring script)       │  │
│  │                                                      │  │
│  │ Instance ID: i-abcdef0123456789                     │  │
│  │  ├─ AWS Systems Manager Agent (Running)             │  │
│  │  ├─ Node.js Runtime                                │  │
│  │  └─ C:\monitoring\                                  │  │
│  │     └─ monitor.js (Node.js monitoring script)       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App (Layout)
└── page.tsx (Home Page)
    └── AdvanceScriptTable
        ├── EC2 Instance Management Table
        │   ├── TanStack React Table
        │   ├── Start/Stop Buttons
        │   └── Badge Components
        └── Script Control Table
            ├── TanStack React Table
            ├── Toggle Switches
            └── Status Badges
        └── Sonner Notifications
```

### Data Flow

```
1. Component Mount
   └── useEffect hook triggers
       └── Calls getAvailableEC2Instances()

2. API Call Flow
   Browser → Axios → /api/ec2-instances → EC2Client.DescribeInstances() → Browser

3. User Action (Start Instance)
   Click Button → handleStartInstance() → Axios POST → /api/ec2-instances
   → EC2Client.StartInstances() → Instance state updated → UI refreshes

4. Script Execution
   Click Toggle → controlScript() → Axios POST → /api/scriptRunners
   → SSM.SendCommand() → PowerShell runs on Windows Instance
   → monitor.js starts/stops → Success toast → Table updates

5. Auto-Refresh Cycle
   Every 15 seconds → setInterval → getAvailableEC2Instances()
   → Update component state → Re-render tables with new data
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.0.4 | React framework with API routes |
| **React** | 18.2.0 | UI component library |
| **TypeScript** | 5.0+ | Type-safe JavaScript |
| **TailwindCSS** | 3.4.1 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Pre-built Radix UI components |
| **TanStack React Table** | 8.20.5 | Headless table component library |
| **Axios** | 1.7.9 | HTTP client for API calls |
| **Lucide React** | Latest | Icon library (468+ icons) |
| **Sonner** | Latest | Toast notification library |
| **Zod** | 3.23.8 | TypeScript-first schema validation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest (via npm) | JavaScript runtime |
| **TypeScript** | 5.0+ | Type-safe backend code |
| **Next.js API Routes** | 15.0.4 | Serverless API endpoints |

### AWS SDKs
| Package | Version | Purpose |
|---------|---------|---------|
| **@aws-sdk/client-ec2** | Latest | EC2 instance management |
| **@aws-sdk/client-ssm** | Latest | Remote command execution |
| **@aws-sdk/client-iam** | Latest | Identity & access management |

### Additional Tools
| Package | Version | Purpose |
|---------|---------|---------|
| **ws** | 8.18.0 | WebSocket support (future enhancement) |
| **Puppeteer** | 23.10.1 | Browser automation (future enhancement) |
| **ESLint** | Latest | Code linting & standards |
| **PostCSS** | Latest | CSS transformation |

---

## Installation & Setup

### Prerequisites

- **Node.js** 18.0+ with npm
- **AWS Account** with EC2 instances
- **AWS Credentials** (Access Key ID & Secret Access Key)
- **Windows EC2 Instances** with:
  - AWS Systems Manager (SSM) Agent running
  - IAM role with SSM permissions
  - Node.js installed at `C:\monitoring\`
  - `monitor.js` script present

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/script-monitor-app.git
cd script-monitor-app
```

#### 2. Install Dependencies

```bash
npm install
```

This installs all packages defined in `package.json` including:
- Next.js, React, and frontend libraries
- AWS SDKs
- Development dependencies

#### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your AWS credentials:

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1

# Comma-separated list of EC2 instance IDs to monitor
ALLOWED_EC2_INSTANCES=i-1234567890abcdef0,i-abcdef0123456789

# URL for monitoring (used for future web scraping feature)
MONITORING_WEBPAGE=https://example.com/health
```

#### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

#### 5. Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
Meta-data-Scrapper/
├── src/
│   ├── app/                              # Next.js App Router directory
│   │   ├── layout.tsx                    # Root layout (HTML structure)
│   │   ├── page.tsx                      # Home page (renders AdvanceScriptTable)
│   │   └── api/                          # API routes (backend)
│   │       ├── ec2-instances/
│   │       │   └── route.ts              # GET/POST - EC2 management
│   │       └── scriptRunners/
│   │           └── route.ts              # POST - Script execution
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components (reusable)
│   │   │   ├── badge.tsx                 # Status badges
│   │   │   ├── button.tsx                # Interactive buttons
│   │   │   ├── card.tsx                  # Card containers
│   │   │   ├── input.tsx                 # Input fields
│   │   │   ├── select.tsx                # Dropdown selectors
│   │   │   ├── switch.tsx                # Toggle switches
│   │   │   └── table.tsx                 # Table component
│   │   │
│   │   └── custom/                       # Project-specific components
│   │       ├── AdvanceScriptTable.tsx    # Main dashboard component
│   │       └── ScriptTable.tsx           # Legacy component (unused)
│   │
│   ├── lib/
│   │   ├── aws-config.ts                 # API client functions
│   │   └── utils.ts                      # Utility functions (cn)
│   │
│   └── types/
│       └── script-monitor.ts             # TypeScript type definitions
│
├── public/                               # Static assets
│   └── apple.png                         # Logo/image
│
├── Configuration Files
│   ├── package.json                      # Dependencies & scripts
│   ├── tsconfig.json                     # TypeScript configuration
│   ├── next.config.ts                    # Next.js configuration
│   ├── tailwind.config.ts                # TailwindCSS theme & plugins
│   ├── postcss.config.mjs                # PostCSS plugins
│   ├── .eslintrc.json                    # ESLint rules
│   ├── components.json                   # shadcn component config
│   └── .env.example                      # Environment variables template
│
├── .gitignore                            # Git ignore rules
├── README.md                             # This file
└── package-lock.json                     # Locked dependency versions
```

### Key Directory Explanations

- **`src/app/`** - Next.js App Router pages and API routes
- **`src/components/`** - Reusable React components (UI & custom)
- **`src/lib/`** - Shared utility functions and API clients
- **`src/types/`** - TypeScript interfaces and type definitions
- **`public/`** - Static files served directly (images, icons, etc.)

---

## API Documentation

### EC2 Instances Management

#### GET `/api/ec2-instances`

Fetch all available EC2 instances.

**Request:**
```bash
GET /api/ec2-instances
```

**Response (200 OK):**
```json
{
  "instances": [
    {
      "id": "i-1234567890abcdef0",
      "type": "t2.micro",
      "state": "running",
      "publicDns": "ec2-54-123-45-67.compute.amazonaws.com"
    },
    {
      "id": "i-abcdef0123456789",
      "type": "t2.small",
      "state": "stopped",
      "publicDns": "ec2-54-123-45-68.compute.amazonaws.com"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Error message describing what went wrong"
}
```

---

#### POST `/api/ec2-instances`

Start or stop an EC2 instance.

**Request:**
```json
{
  "instanceId": "i-1234567890abcdef0",
  "action": "start" | "stop"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Instance started successfully"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to start instance: [AWS error message]"
}
```

**Behavior:**
- Calls AWS EC2 `StartInstancesCommand` or `StopInstancesCommand`
- Instance state transitions to `pending`/`stopping`
- Full state change takes 30-60 seconds
- UI disables button during transition

---

### Script Execution

#### POST `/api/scriptRunners`

Execute a Node.js monitoring script on a Windows EC2 instance.

**Request:**
```json
{
  "instanceId": "i-1234567890abcdef0",
  "action": "start" | "stop",
  "scriptPath": "C:\\monitoring"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "commandId": "cmd-1234567890abcdef0",
  "message": "Script execution command sent successfully"
}
```

**Error Response (500):**
```json
{
  "error": "Instance must be running before executing scripts"
}
```

**How It Works:**
1. Validates instance is in `running` state
2. Sends PowerShell command via AWS Systems Manager (SSM)
3. Command executed: `cd C:\monitoring && node monitor.js start` or `stop`
4. Uses `AWS-RunPowerShellScript` document
5. Returns command ID for tracking

---

## Features

### ✅ Implemented Features

#### 1. **EC2 Instance Management**
- 📋 List all EC2 instances with details (ID, type, state)
- ▶️ Start instances with one click
- ⏹️ Stop instances with one click
- 🔄 Disable buttons during state transitions (pending/stopping)
- 🎨 Dynamic button styling (red for running, gray for stopped)

#### 2. **Script Control**
- 🎚️ Toggle switches to start/stop scripts
- ✅ Only enable script controls when instance is running
- 📊 Status badges (Running, Not Started, Error)
- 🚀 Execute PowerShell commands on Windows instances
- 📍 Scripts located at `C:\monitoring\monitor.js`

#### 3. **Real-Time Monitoring**
- ⏱️ Auto-refresh instance status every 15 seconds
- 🔄 Graceful state updates without page reload
- ⚠️ Error state with descriptive messages
- 💾 Component cleanup on unmount

#### 4. **User Feedback**
- 🔔 Toast notifications for success/error messages
- 🚫 Disable actions during processing
- 📝 Detailed error messages for troubleshooting
- 💡 Loading states with spinner

#### 5. **User Interface**
- 🌙 Dark mode support (via TailwindCSS)
- 📱 Responsive design (works on mobile & desktop)
- 🎨 Modern UI with shadcn components
- ⚡ Fast, interactive tables (TanStack React Table)

#### 6. **Development Experience**
- 🔷 Full TypeScript support
- ✔️ Type-safe AWS SDK calls
- 🛡️ Zod schema validation
- 📋 ESLint for code quality

---

## Environment Configuration

### Environment Variables

**File:** `.env.local` (create from `.env.example`)

#### AWS Credentials (Required)

```env
# AWS Access Key ID
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE

# AWS Secret Access Key
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# AWS Region (where your EC2 instances are located)
AWS_REGION=us-east-1
```

#### Application Configuration (Required)

```env
# Comma-separated list of EC2 instance IDs to monitor
# Only these instances will appear in the dashboard
ALLOWED_EC2_INSTANCES=i-1234567890abcdef0,i-abcdef0123456789,i-xyz9876543210

# URL for monitoring (used by web scraping feature - future enhancement)
MONITORING_WEBPAGE=https://example.com/health-check
```

### Security Considerations

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Never commit `.env.local`** - Add to `.gitignore` immediately
2. **Use AWS IAM User** - Create a dedicated IAM user with minimal permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ec2:DescribeInstances",
           "ec2:StartInstances",
           "ec2:StopInstances",
           "ssm:SendCommand",
           "ssm:GetCommandInvocation"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
3. **Rotate credentials regularly** - Change access keys every 90 days
4. **Use AWS Secrets Manager** - For production deployments
5. **Enable MFA** - On your AWS account

---

## Development Guide

### Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Run ESLint with fix
npm run lint -- --fix
```

### Development Workflow

#### 1. Making Code Changes

```bash
# Start dev server
npm run dev

# Edit files in src/
# Changes automatically reload in browser
```

#### 2. TypeScript

```bash
# TypeScript is automatically checked during build
# For real-time checking, use your IDE (VS Code recommended)

# tsconfig.json settings:
# - target: ES2017
# - strict: true (strict type checking)
# - module: esnext
# - moduleResolution: bundler
```

#### 3. Adding New API Endpoints

Create new file in `src/app/api/[feature]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Your implementation
    return NextResponse.json({ data: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Your implementation
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 });
  }
}
```

#### 4. Adding New Components

Create in `src/components/custom/YourComponent.tsx`:

```typescript
'use client'; // Client component

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function YourComponent() {
  const [state, setState] = useState(false);

  return (
    <div>
      {/* Your JSX */}
    </div>
  );
}
```

#### 5. Adding New Types

Add to `src/types/script-monitor.ts`:

```typescript
export interface YourNewType {
  id: string;
  name: string;
  // ...
}
```

### Code Style Guidelines

- **TypeScript**: Use strict mode, avoid `any` types
- **Components**: Use functional components with hooks
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Async/Await**: Prefer over `.then()` chains
- **Error Handling**: Use try-catch with meaningful error messages
- **Comments**: Document complex logic, not obvious code

### Debugging Tips

#### 1. Browser Console
```javascript
// Check network requests
// Open DevTools → Network tab
// Monitor API calls in real-time
```

#### 2. React DevTools
```
// Install React DevTools browser extension
// Inspect component state and props
// Track re-renders
```

#### 3. Server Logs
```bash
# Check terminal running `npm run dev`
# View API route logs
console.log('Debug message:', variable);
```

#### 4. TypeScript Errors
```bash
# Check TypeScript errors during development
# Red underlines in VS Code indicate type errors
# Hover for error details
```

---

## Future Enhancements

### 🔮 Planned Features

#### 1. **Real-Time WebSocket Updates**
- Replace 15-second polling with real-time WebSocket connections
- Reduce latency from seconds to milliseconds
- Lower server load with persistent connections
- *Status*: `ws` package already installed, ready for implementation

#### 2. **Web Scraping & Monitoring**
- Integrate Puppeteer for monitoring website health
- Scrape target URL for content changes
- Alert on webpage failures or anomalies
- *Status*: `Puppeteer` already installed, awaiting integration

#### 3. **Performance Metrics Dashboard**
- Display CPU, memory, disk usage graphs
- Real-time metrics from EC2 instances
- Historical trend analysis
- Resource utilization alerts

#### 4. **Multi-Region Support**
- Switch between AWS regions (us-east-1, eu-west-1, etc.)
- Manage instances across multiple regions
- Region selector in UI

#### 5. **Access Control & Authentication**
- User login system with OAuth/JWT
- Role-based access control (RBAC)
  - Admin: Full control
  - Operator: Start/stop only
  - Viewer: Read-only access
- Audit logging for all actions

#### 6. **Script Library Management**
- Upload custom scripts to instances
- Version control for scripts
- Script templates for common tasks
- Deployment history tracking

#### 7. **Automation & Scheduling**
- Cron-like scheduling for start/stop actions
- Auto-shutdown after idle period
- Cost optimization strategies
- Bulk operations (start/stop all)

#### 8. **Advanced Dashboard**
- Instance grouping by tags
- Custom dashboard layouts
- Favorites/pinning
- Search & filter capabilities
- Export data to CSV/JSON

#### 9. **Logging & Analytics**
- Aggregate logs from instances
- Activity timeline
- Performance analytics
- Compliance reporting

#### 10. **Notifications & Alerts**
- Email notifications for critical events
- Slack integration
- Custom alert rules
- Status page integration

---

## Troubleshooting

### Common Issues & Solutions

#### ❌ Error: "Cannot find module '@aws-sdk/client-ec2'"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

#### ❌ Error: "AWS credentials not found"

**Solution:**
1. Verify `.env.local` file exists in project root
2. Check file has correct credentials:
   ```env
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=us-east-1
   ```
3. Restart development server:
   ```bash
   npm run dev
   ```

---

#### ❌ Error: "Instance must be running before executing scripts"

**Cause:** Trying to run a script on a stopped instance

**Solution:**
1. Click the Start button for the instance first
2. Wait 30-60 seconds for instance to fully start
3. Try script execution again

---

#### ❌ Error: "Failed to send command to instance"

**Possible Causes:**
1. **SSM Agent not running** on instance
2. **IAM role missing** on EC2 instance
3. **Instance doesn't have SSM permissions**
4. **Script path incorrect** (should be `C:\monitoring`)

**Solution:**
1. SSH into Windows instance via EC2 console
2. Verify SSM agent is running:
   ```powershell
   Get-Service AmazonSSMAgent
   ```
3. Start agent if stopped:
   ```powershell
   Start-Service AmazonSSMAgent
   ```
4. Verify script exists at `C:\monitoring\monitor.js`

---

#### ❌ Error: "Instances not appearing in dashboard"

**Cause:** Instance IDs not in `ALLOWED_EC2_INSTANCES` env variable

**Solution:**
1. Get instance ID from AWS Console
2. Add to `.env.local`:
   ```env
   ALLOWED_EC2_INSTANCES=i-1234567890abcdef0,i-new-instance-id
   ```
3. Restart dev server

---

#### ❌ Button shows "disabled" state even though instance is running

**Cause:** UI state not synced with actual instance state

**Solution:**
```bash
# Manual refresh
# Press F5 to reload page
# Or click browser refresh button
```

The auto-refresh should sync within 15 seconds.

---

#### ❌ Port 3000 already in use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001
```

Or kill process using port 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Getting Help

- 📖 **AWS Documentation**: https://docs.aws.amazon.com/
- 🔗 **Next.js Docs**: https://nextjs.org/docs
- 💬 **React Hooks**: https://react.dev/reference/react/hooks
- 🎨 **TailwindCSS**: https://tailwindcss.com/docs
- 📦 **shadcn/ui**: https://ui.shadcn.com/

---

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Project Status

**Version**: 1.0.0
**Status**: Active Development
**Last Updated**: 2025-01-02
**Maintainer**: DevOps Team

---

## Changelog

### v1.0.0 (Current)
- ✅ EC2 instance management (start/stop)
- ✅ Remote script execution via SSM
- ✅ Real-time monitoring with 15-second refresh
- ✅ Responsive UI with dark mode
- ✅ Toast notifications
- ✅ Type-safe implementation

### Roadmap
- 🔜 WebSocket real-time updates
- 🔜 Performance metrics dashboard
- 🔜 User authentication & RBAC
- 🔜 Script library management
- 🔜 Scheduling & automation

---

**Built with ❤️ using Next.js, React, and AWS**
