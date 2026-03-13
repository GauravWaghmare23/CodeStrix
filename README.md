# CodeStrix IDE 🚀

CodeStrix is a professional-grade, AI-powered Integrated Development Environment (IDE) built for the next generation of web and software developers. It combines the power of modern web technologies with intelligent AI analysis and high-fidelity project simulation.

![CodeStrix Banner](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop)

CodeStrix is not just another text editor; it's a complete engineering workstation in the browser. Whether you're building a complex web application or testing algorithm performance in Python, CodeStrix provides the tools you need to succeed.

## ✨ Core Features

### 📁 Hierarchical Project Management
- **Recursive File Tree**: Organize your projects with an unlimited nesting depth. Unlike flat file systems, CodeStrix supports real folder structures, allowing for professional project organization.
- **Recursive Sidebar rendering**: Our sidebar logic ensures that your project structure is always accurately reflected, matter how deep the folders go.
- **Intuitive Sidebar**: Drag-and-drop feeling with clean recursive rendering and instant UI updates.
- **Breadcrumbs**: Real-time path traversal tracing at the top of the editor, allowing you to quickly understand your context within a large project.

### 💻 Pro Code Execution
- **Polyglot Support**: Native-like execution for JavaScript, Python, Java, and C++ directly in the browser environment.
- **Advanced CodeStrix Python Engine**: 
    - Support for modern Python 3 syntax.
    - Intelligent simulation of `def` function definitions and calls.
    - Robust logic for `for` loops and `range()` iterations.
    - Support for indented code blocks, ensuring your script logic is followed correctly.
- **Interactive Pro Terminal**: 
    - High-fidelity system console with micro-second accurate timestamps.
    - Colored output for `log`, `warn`, `error`, and `info`.
    - Interactive "Clear" functionality to reset your debugging state.
- **Full-Screen Terminal**: A dedicated 100vw console view for deep focus on backend logic and output analysis.

### 🌐 Live Web Container
- **Real-time Previews**: Modern static rendering for HTML, CSS, and JS.
- **Live Sync**: Changes are reflected in the preview container as you type, with minimal latency.
- **Full-Page Mode**: A specialized "Full Page" view that allows you to see your production-ready design in a 100vw/100vh overlay.

### 🤖 AI-Powered Workflow
- **CodeStrix Neural Auto-Fix**: (Magic Wand 🪄) Automatically detects and repairs common syntax errors, capitalization mistakes (e.g., `Console.log` vs `console.log`), and formatting inconsistencies.
- **Deep Code Analysis**: Line-by-line quality scoring, complexity analysis, and performance recommendations.
- **AI Chat Console**: A context-aware assistant that understands your current file's content and can generate code, explain bugs, or suggest architectural improvements.

## 🛠 Tech Stack

CodeStrix is built on a cutting-edge stack to ensure performance, reliability, and modern aesthetics:

- **Frontend Core**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/) as the build tool.
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) – The same engine that powers VS Code, providing world-class IntelliSense, syntax highlighting, and code manipulation.
- **Styling & UI**: 
    - [Tailwind CSS](https://tailwindcss.com/) for a utility-first, performant design system.
    - [shadcn/ui](https://ui.shadcn.com/) for high-fidelity, accessible UI components.
    - Custom Glassmorphic design tokens for a premium, futuristic feel.
- **Backend & Auth**: [Supabase](https://supabase.com/) for real-time database, authentication, and edge functions.
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query) for robust server state management.
- **Icons**: [Lucide React](https://lucide.dev/) for a consistent, professional iconography system.

  **Github Link**:https://www.canva.com/design/DAHDzOwyPIE/EfJ2TiuFEaIOWuyIzgj3hw/view?utm_content=DAHDzOwyPIE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6d1287aaf1

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher is required for local development.
- **npm**: v9.0.0 or higher (or equivalent yarn/pnpm version).
- **Supabase Account**: A Supabase project is required for the full AI and persistence features.

### Installation & Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/code-strix-ide.git
   cd code-strix-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Rename `.env.example` to `.env` or create a new one in the root:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_public_anon_key
   ```

4. **Database Setup**
   Ensure your Supabase project has the following tables:
   - `analyses`: Stores code quality snapshots.
   - `issues`: Stores individual bugs/suggestions found during analysis.
   - `profiles`: Stores user-specific settings and workspace preferences.

5. **Start Development**
   ```bash
   npm run dev
   ```
   🚀 Open your browser at `http://localhost:8080`.

## 📁 Project Architecture

CodeStrix follows a modular, scalable directory structure designed for high-performance React applications:

```text
src/
├── components/
│   ├── ide/            # Core IDE panels (Sidebar, Editor, Chat, Issues)
│   ├── ui/             # Reusable UI primitives (Buttons, Dialogs, Cards)
│   └── ThemeProvider/  # Global theme and aesthetic state
├── hooks/              # Custom logic (useAuth, useFileSystem, useCodeRunner)
├── lib/                # Utility classes and Supabase client initialization
├── integrations/       # External service connectors (Supabase Client/Types)
├── pages/              # Main Route components (Landing, IDE, Dashboard)
└── types/              # Global TypeScript interfaces for projects and code
```

### Component Flow
1. **IDE.tsx**: The central orchestrator for the workspace state.
2. **Sidebar.tsx**: Handles recursive file tree state and parent-child file relationships.
3. **CodeEditor.tsx**: An abstraction over Monaco Editor with custom theme integration.
4. **ChatConsole.tsx**: Communicates with Supabase Edge Functions for AI responses.

## 🤖 AI Execution Layer

The core of CodeStrix's intelligence lies in its Supabase Edge Functions:

- **/analyze-code**: Takes source code as input and returns a JSON array of `Issue` objects with line numbers and fix suggestions.
- **/auto-fix**: A specialized LLM chain that returns a perfectly formatted, fixed version of the input code.
- **/chat**: A streaming-ready endpoint for natural language interactions with the codebase.

## 📊 Database Schema Details

### `analyses` Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Unique analysis identifier |
| user_id | uuid | Foreign key to user profile |
| code | text | Snapshot of the analyzed code |
| quality_score | int | 0-100 score of code health |
| created_at | timestamp | Time of analysis |

### `issues` Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Unique issue identifier |
| analysis_id | uuid | Link to the parent analysis |
| line | int | Line number where issue occurs |
| type | text | Category (Error, Warning, Info) |
| fix | text | Suggested code replacement |

## 🛠 Advanced Usage

### Python Simulation Rules
The CodeStrix Python Engine is a proprietary JavaScript-based interpreter for simulated execution. To get the best results:
1. Always use 4-space indentation for blocks.
2. Function definitions should follow the standard `def func_name():` syntax.
3. Loops are currently optimized for `for i in range(N):` patterns.

### Keyboard Shortcuts (Monaco Defaults)
- **Ctrl + S**: Save changes (Trigger auto-sync).
- **Ctrl + F**: Search within code.
- **Alt + Click**: Multiple cursors.
- **Ctrl + Space**: Trigger IntelliSense.

## 🖥 Interface Guide

### 🏠 Landing Page
The entry point to the CodeStrix ecosystem.
- **Hero Section**: Showcases the value proposition of AI-driven engineering.
- **Feature Grid**: Detailed breakdown of Shield (Analysis), Zap (Auto-fix), and Terminal (Runtime).
- **Pricing Section**: Three-tier monetization model (Starter, Pro, Enterprise) with glassmorphic cards.
- **Documentation Link**: Quick access to the developer manual.

### 📊 Dashboard (Analytics)
A comprehensive view of your coding history.
- **Stat Cards**: Real-time counters for Total Scans, Total Bugs detected, Average Quality Score, and Language Diversity.
- **Activity Charts**: 
    - **Bug Severity Distribution**: Bar chart showing the split between Errors, Warnings, and Suggestions.
    - **Daily Scan Activity**: Line chart tracking your productivity over the last 7 days.
- **Scan History**: A searchable list of previous analyses. Clicking a card opens a high-fidelity modal with the code snapshot and its associated metadata.

### 🛠 The Workspace (IDE)
The core of the CodeStrix experience.
- **Recursive Sidebar**: Supports nested folders and files with real-time path state.
- **Breadcrumb Navigation**: Displays the current file path (e.g., `src > components > ide > Sidebar.tsx`).
- **Monaco Editor**: High-performance editor with VIM/Emacs bindings (optional) and deep IntelliSense.
- **AI Toolchain (Right Panel)**:
    - **AI Chat**: Contextual chat with the project files.
    - **Pro Terminal**: Captures and iterates on your code output.
    - **Live Preview**: Immersive web container for frontend projects.
    - **Issue Panel**: Real-time linting and security issue tracking.

## 🛠 Advanced Features Deep Dive

### High-Fidelity Python Execution
CodeStrix implements a custom-built simulation layer for Python. This allows you to run complex scripts without the overhead of a remote server:
- **Block Indentation**: The engine uses a stack-based approach to handle Python's scoped indentation.
- **Multi-argument Prints**: `print("Hello", name, "!")` is correctly parsed into a space-separated stream.
- **Function Persistence**: Functions defined in the global scope are stored and callable later in the script's lifecycle.
- **Loop Iteration**: `for` loops are simulated with high accuracy, supporting standard range-based iteration.

### Smart Auto-Fix (Neural Layer)
The "Magic Wand" 🪄 icon in the editor header is more than a formatter. It uses a combination of regex-based heuristics and LLM inference to:
1. **Fix Capitalization**: Common mistakes like `Console.log` or `Array.Map` are automatically lowered.
2. **Syntax Repair**: Missing semicolons, unclosed brackets, and loose quotes are identified and patched.
3. **Logic Optimization**: Detects redundant checks and suggests cleaner, more idiomatic syntax.

## 🔧 Troubleshooting

If you encounter issues during setup or usage, check these common solutions:

### Terminal shows no output
- Ensure the file's language is correctly set in the header.
- For JavaScript: The `runCode` function uses `new Function()`. Ensure you have `console.log` calls to see output.
- For Python: The script must include `print()` statements to generate visible console lines.

### AI Analysis is failing
- Check your Supabase URL and Anon Key in `.env`.
- Ensure the Supabase Edge Functions (`analyze-code`, `auto-fix`) are deployed and active.
- Verify your internet connection; the Neural Layer requires active API access.

### Files aren't saving
- CodeStrix uses local-first state. Updates are pushed to the file system state instantly.
- If changes disappear after refresh, ensure you are logged in so your workspace can sync with the Supabase `files` table.

## ❓ FAQ

**Q: Is CodeStrix free for students?**
A: Yes! The Starter plan is completely free and includes all essential IDE features for learning and small projects.

**Q: Can I run C++ code without a compiler?**
A: CodeStrix uses a high-fidelity simulation engine for C++. It parses standard `cout` and `printf` calls to provide an output experience that mimics a compiled run.

**Q: How do I connect my own domain for previews?**
A: Currently, previews are hosted within the CodeStrix secure container. Direct custom domain support for live previews is on our Phase 6 roadmap.

**Q: My Python code with complex imports isn't working.**
A: The current Python Engine is a specialized simulation for logic and algorithm testing. For scripts requiring external C-based libraries (like NumPy or Pandas), we recommend our upcoming Phase 5 Pro Backends.

## ⚡ Performance & Optimization

CodeStrix is designed to be lightweight and fast, even when handling large codebases:

### Editor Virtualization
Monaco Editor uses virtualized rendering, meaning only the visible lines of code are rendered in the DOM. This allows CodeStrix to open files with thousands of lines without any UI lag.

### Intelligent Debouncing
- **File Syncing**: We use a 500ms debounce on file content updates to prevent excessive database writes while maintaining near real-time persistence.
- **Analysis Throttling**: The Neural Layer is only triggered after a pause in typing to optimize API usage and provide a smoother editing experience.

### Bundle Optimization
By using **Vite** and tree-shaking with **Lucide React**, the initial payload of the IDE is kept under 300KB (compressed), ensuring fast load times on all connections.

## 🗺 Multi-Phase Roadmap

### Phase 1: Core Foundation (Completed)
- Monaco Editor integration.
- Supabase Auth & DB.
- Basic JS execution.

### Phase 2: Professional IDE Features (Completed)
- Hierarchical file structures.
- Pro Terminal with simulated backends for Python/Java/C++.
- Complete CodeStrix rebranding.

### Phase 3: Monetization & AI (Current)
- Subscription UI on Landing page.
- Smart Auto-Fix (Logic repair).
- Issue panel and line-level analysis.

### Phase 4: Collaborative Engineering (Q3 2024)
- Real-time pair programming.
- Shared preview links for team reviews.
- Project-level RBAC (Role Based Access Control).

### Phase 5: Deep Backend Integration (Q4 2024)
- Docker-based remote containers for true server-side execution.
- Git integration (Commit, Push, Pull directly from the sidebar).
- Database browser for connected SQL instances.

## 🎨 UI System & Atoms

CodeStrix uses a custom design system built on top of **Tailwind CSS** and **shadcn/ui**.

### Design Tokens
- **Background**: `hsl(222.2 84% 4.9%)` (Deep Space Dark)
- **Primary**: `hsl(217.2 91.2% 59.8%)` (Electric Blue)
- **Accents**: Glassmorphic blurs (`backdrop-blur-xl`) and subtle gradient borders (`border-primary/20`).

### Atomic Components
All UI elements are derived from atomic primitives:
1. **Atoms**: Buttons, Inputs, Tooltips, Separators.
2. **Molecules**: Dropdown Menus, Context Menus, Breadcrumbs.
3. **Organisms**: Sidebar, Code Editor Panel, Chat Console, Preview Container.

## 🤝 Contributing

We are passionate about building the best AI IDE, and we would love your help! 

### Project Standards
- **Component Styling**: Always use Tailwind utilities. Avoid ad-hoc CSS unless absolutely necessary.
- **State Management**: Use React Query for any server-side state.
- **Type Safety**: No `any` types. All interfaces must be defined in the relevant type file.

### Step-by-Step Guide
1. **Explore the Issues**: Look for "good first issue" labels.
2. **Fork and Clone**: Setup your local dev environment.
3. **Draft a Plan**: For major features, please open a Discussion first.
4. **Pull Requests**: Ensure your PR includes screenshots of UI changes and passes all linting checks.

## 🏛 Project Context & Credits

CodeStrix was born out of a desire to make professional-grade AI engineering accessible directly in the browser. 

- **Inspiration**: VS Code, Repl.it, and the open-source engineering community.
- **Core Maintainers**: The CodeStrix Core Team.
- **Special Thanks**: Microsoft for Monaco, the Tailwind Labs team, and the Supabase community.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with pride and ☕ by the **CodeStrix Team**. 🚀
