<div align="center">

<!-- Hero Section with Animated Gradient Background Effect -->
<br>

<img src="https://img.shields.io/badge/🔥_SELF--HOSTED-Convex_Backend-FF6B6B?style=for-the-badge&labelColor=1a1a2e" alt="Convex">
<img src="https://img.shields.io/badge/🦀_RUST-CLI_Client-DDA15E?style=for-the-badge&labelColor=1a1a2e" alt="Rust">
<img src="https://img.shields.io/badge/⚛️_REACT-19_+_Vite_7-61DAFB?style=for-the-badge&labelColor=1a1a2e" alt="React">
<img src="https://img.shields.io/badge/🐘_POSTGRES-Database-336791?style=for-the-badge&labelColor=1a1a2e" alt="PostgreSQL">

<br><br>

# 📝 Convex Notes

### ✨ _A stunning, self-hosted real-time notes application_ ✨

<br>

**[⚡ Quick Start](#-quick-start)** &nbsp;•&nbsp;
**[🏗️ Architecture](#%EF%B8%8F-architecture)** &nbsp;•&nbsp;
**[🦀 CLI](#-rust-cli)** &nbsp;•&nbsp;
**[⚛️ Frontend](#%EF%B8%8F-react-frontend)** &nbsp;•&nbsp;
**[📚 Docs](#-documentation)**

<br>

<img src="https://img.shields.io/badge/Live_Sync-WebSocket-10B981?style=flat-square&logo=socket.io&logoColor=white" alt="WebSocket">
<img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
<img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">

</div>

<br>

---

<br>

## 🎯 Why Convex Notes?

> **Own your data. Control your backend. Build in Rust.**

<table>
<tr>
<td align="center" width="25%">
<br>
<img width="50" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/docker.svg" alt="Docker">
<br><br>
<strong>🏠 Self-Hosted</strong>
<br>
<sub>No cloud lock-in<br>Full data ownership</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
<img width="50" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/rust.svg" alt="Rust">
<br><br>
<strong>🦀 Rust Powered</strong>
<br>
<sub>Blazing fast CLI<br>Memory safe</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
<img width="50" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/react.svg" alt="React">
<br><br>
<strong>⚛️ Modern UI</strong>
<br>
<sub>React 19 + Vite 7<br>Glassmorphism</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
<img width="50" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/clock.svg" alt="Realtime">
<br><br>
<strong>⚡ Real-Time</strong>
<br>
<sub>WebSocket sync<br>Instant updates</sub>
<br><br>
</td>
</tr>
</table>

<br>

---

<br>

## 🏗️ Architecture

<br>

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'primaryTextColor': '#fff', 'primaryBorderColor': '#818cf8', 'lineColor': '#a5b4fc', 'secondaryColor': '#1e1b4b', 'tertiaryColor': '#312e81', 'background': '#0f172a', 'mainBkg': '#1e293b', 'nodeBorder': '#818cf8', 'clusterBkg': '#1e1b4b40', 'clusterBorder': '#6366f150', 'titleColor': '#e0e7ff', 'edgeLabelBackground': '#1e293b'}}}%%

flowchart TB
    subgraph DOCKER["🐳 &nbsp; DOCKER COMPOSE"]
        direction TB

        subgraph DB_LAYER["💾 &nbsp; Data Layer"]
            PG[("🐘 PostgreSQL<br/>───────────<br/>Port 5432")]
        end

        subgraph CONVEX["⚙️ &nbsp; Convex Backend"]
            API["🔧 API Server<br/>───────────<br/>Port 3210"]
            HTTP["🌐 HTTP Actions<br/>───────────<br/>Port 3211"]
        end

        subgraph ADMIN["� &nbsp; Admin"]
            DASH["Dashboard<br/>───────────<br/>Port 9999"]
        end
    end

    subgraph CLIENTS["👨‍💻 &nbsp; CLIENT APPLICATIONS"]
        direction LR
        RUST["🦀 Rust CLI<br/>───────────<br/>Interactive"]
        REACT["⚛️ React App<br/>───────────<br/>Port 3000"]
    end

    subgraph FUNCTIONS["� &nbsp; CONVEX FUNCTIONS"]
        direction LR
        NOTES["📄 notes.ts"]
        SCHEMA["📋 schema.ts"]
    end

    RUST <-. "⚡ WebSocket" .-> API
    REACT <-. "⚡ WebSocket" .-> API
    API <--> PG
    API --> HTTP
    DASH --> API
    NOTES -.-> API
    SCHEMA -.-> API

    style PG fill:#336791,stroke:#5A8DB8,stroke-width:2px,color:#fff
    style API fill:#ef4444,stroke:#f87171,stroke-width:2px,color:#fff
    style HTTP fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
    style DASH fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
    style RUST fill:#dda15e,stroke:#e5b97e,stroke-width:2px,color:#000
    style REACT fill:#61dafb,stroke:#81e4fc,stroke-width:2px,color:#000
```

<br>

---

<br>

## 🚀 Quick Start

<br>

### 📋 Prerequisites

|     | Tool       | Purpose           | Install                                |
| :-: | :--------- | :---------------- | :------------------------------------- |
| 🐳  | **Docker** | Container runtime | [↗ docker.com](https://docker.com)     |
| 🦀  | **Rust**   | CLI application   | [↗ rustup.rs](https://rustup.rs)       |
| 📦  | **Bun**    | Package manager   | [↗ bun.sh](https://bun.sh)             |
| 📋  | **Task**   | Task automation   | [↗ taskfile.dev](https://taskfile.dev) |

<br>

### ⚡ Express Setup

```bash
task setup && task docker:up && task admin:key
# Copy key to .env.local, then:
task convex:dev      # Terminal 1
task frontend:dev    # Terminal 2
task rust:run        # Terminal 3
```

<br>

### 📖 Step-by-Step

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'lineColor': '#a5b4fc', 'textColor': '#e2e8f0', 'background': '#0f172a'}}}%%

flowchart LR
    A["🐳<br/>Docker Up"]
    B["🔑<br/>Admin Key"]
    C["📝<br/>Env Config"]
    D["📦<br/>Convex Dev"]
    E["🚀<br/>Run Apps"]

    A --> B --> C --> D --> E

    style A fill:#ef4444,stroke:#fca5a5,stroke-width:2px,color:#fff
    style B fill:#f59e0b,stroke:#fcd34d,stroke-width:2px,color:#000
    style C fill:#06b6d4,stroke:#67e8f9,stroke-width:2px,color:#000
    style D fill:#10b981,stroke:#6ee7b7,stroke-width:2px,color:#000
    style E fill:#8b5cf6,stroke:#c4b5fd,stroke-width:2px,color:#fff
```

<br>

<details>
<summary><kbd>� Click for detailed commands</kbd></summary>

<br>

```bash
# 1️⃣ Start Docker services
task docker:up

# 2️⃣ Generate admin key
task admin:key

# 3️⃣ Update .env.local with the key
# CONVEX_SELF_HOSTED_ADMIN_KEY='your-key-here'

# 4️⃣ Push Convex functions (keep running)
task convex:dev

# 5️⃣ Start apps (separate terminals)
task frontend:dev  # React at :3000
task rust:run      # Rust CLI
```

</details>

<br>

---

<br>

## 🦀 Rust CLI

<br>

> ### _Beautiful terminal experience with interactive menus_

<br>

```ansi
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           📝 CONVEX NOTES MANAGER                        ║
║         Self-Hosted • Rust Client • v0.1.0               ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

🚀 Connecting to http://127.0.0.1:3210...
✅ Connected to Convex backend!

? What would you like to do?
❯ 📋 List all notes
  ✏️  Create a new note
  📝 Update a note
  🗑️  Delete a note
  👀 Watch notes (real-time)
  🚪 Exit
```

<br>

### 📦 Dependencies

| Crate            | Purpose             |     |
| :--------------- | :------------------ | :-: |
| `convex`         | Convex client SDK   | 🔗  |
| `colored`        | Terminal colors     | 🎨  |
| `dialoguer`      | Interactive prompts | 💬  |
| `prettytable-rs` | Formatted tables    | 📊  |
| `envconfig`      | Config management   | ⚙️  |
| `chrono`         | Date/time           | 🕐  |
| `tokio`          | Async runtime       | ⚡  |
| `futures`        | Stream handling     | 🌊  |

<br>

### 🔄 Data Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'actorBkg': '#1e293b', 'actorBorder': '#818cf8', 'actorTextColor': '#e0e7ff', 'signalColor': '#a5b4fc', 'signalTextColor': '#e0e7ff', 'labelBoxBkgColor': '#312e81', 'labelBoxBorderColor': '#6366f1', 'labelTextColor': '#e0e7ff', 'loopTextColor': '#c4b5fd', 'noteBkgColor': '#3730a3', 'noteTextColor': '#e0e7ff', 'noteBorderColor': '#6366f1', 'activationBkgColor': '#4f46e5', 'activationBorderColor': '#818cf8', 'sequenceNumberColor': '#fff'}}}%%

sequenceDiagram
    autonumber

    participant U as 👤 User
    participant C as 🦀 CLI
    participant B as ⚙️ Backend
    participant D as � Postgres

    rect rgba(99, 102, 241, 0.15)
        Note over U,D: ✏️ Create Note Flow
        U->>C: Enter title & content
        C->>+B: mutation("notes:create")
        B->>D: INSERT INTO notes
        D-->>B: ✓ Success
        B-->>-C: FunctionResult::Value(id)
        C-->>U: ✅ "Note created!"
    end

    rect rgba(16, 185, 129, 0.15)
        Note over U,D: 📡 Real-time Subscription
        C->>B: subscribe("notes:list")
        loop Every Change
            B-->>C: Updated notes array
            C-->>U: 🔄 Display refresh
        end
    end
```

<br>

---

<br>

## ⚛️ React Frontend

<br>

> ### _Modern glassmorphism UI with real-time updates_

<br>

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'lineColor': '#818cf8'}}}%%

mindmap
  root((⚛️<br/>Frontend))
    🔧 Build Stack
      Vite 7
      TypeScript
      React 19
    🎨 Styling
      TailwindCSS 4
      Glassmorphism
      Dark Mode
    🛣️ Navigation
      TanStack Router
      File-based
    📡 Data Layer
      Convex React
      Real-time Sync
      Optimistic UI
    🧩 Components
      shadcn/ui
      Lucide Icons
```

<br>

### ✨ Features

|     | Feature             | Description                 |
| :-: | :------------------ | :-------------------------- |
|  �  | **Dark Mode**       | Purple gradient backgrounds |
| 💫  | **Glassmorphism**   | Cards with backdrop blur    |
| ⚡  | **Instant Updates** | Convex subscriptions        |
| 📱  | **Responsive**      | All screen sizes            |
|  �  | **Optimistic UI**   | Snappy interactions         |

<br>

---

<br>

## 📁 Project Structure

<br>

```
📦 convex-notes/
│
├── 🐳 docker-compose.yml     ← PostgreSQL + Convex + Dashboard
├── 📋 Taskfile.yml           ← Task automation
├── 🔐 .env.local             ← Environment secrets
│
├── 📂 convex/                ← Backend functions
│   ├── schema.ts             ← Database schema
│   └── notes.ts              ← CRUD operations
│
├── 🦀 backend/               ← Rust CLI
│   ├── Cargo.toml
│   └── src/main.rs
│
├── ⚛️ frontend/              ← React app
│   └── src/
│       ├── hooks/useNotes.ts
│       └── routes/index.tsx
│
└── 💾 data/                  ← Local persistence
    ├── postgres/             ← PostgreSQL data
    └── convex/               ← Convex cache
```

<br>

---

<br>

## 📝 Database Schema

<br>

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1' }}}%%

erDiagram
    NOTES {
        string _id PK "Auto-generated"
        string title "Required"
        string content "Required"
        number createdAt "Unix ms"
        number updatedAt "Unix ms"
    }
```

<details>
<summary><kbd>📄 View TypeScript Schema</kbd></summary>

```typescript
// convex/schema.ts
export default defineSchema({
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_created", ["createdAt"]),
});
```

</details>

<br>

---

<br>

## 🛠️ Task Commands

<br>

| Command             | Description            |
| :------------------ | :--------------------- |
| `task`              | List all commands      |
| `task setup`        | Install everything     |
| `task docker:up`    | Start containers       |
| `task docker:down`  | Stop containers        |
| `task docker:logs`  | View logs              |
| `task admin:key`    | Generate admin key     |
| `task convex:dev`   | Push & watch functions |
| `task frontend:dev` | Start React            |
| `task rust:run`     | Run CLI                |
| `task rust:watch`   | Auto-rebuild           |

<br>

---

<br>

## 🔗 Service URLs

<br>

|     | Service       | URL                     | Description  |
| :-: | :------------ | :---------------------- | :----------- |
| 🔧  | **Backend**   | `http://127.0.0.1:3210` | Convex API   |
| 🌐  | **HTTP**      | `http://127.0.0.1:3211` | HTTP Actions |
| 📊  | **Dashboard** | `http://localhost:9999` | Admin UI     |
| ⚛️  | **Frontend**  | `http://localhost:3000` | React App    |
| 🐘  | **Postgres**  | `localhost:5432`        | Database     |

<br>

---

<br>

## � Documentation

<br>

<details>
<summary><kbd>🚫 Port already in use</kbd></summary>

<br>

Windows Hyper-V may reserve ports:

```powershell
netsh interface ipv4 show excludedportrange protocol=tcp
```

Change ports in `docker-compose.yml` if needed.

</details>

<details>
<summary><kbd>🔌 Connection failed</kbd></summary>

<br>

1. Check Docker: `docker ps`
2. View logs: `task docker:logs`
3. Verify `.env.local` has correct `CONVEX_URL`

</details>

<details>
<summary><kbd>📦 Functions not found</kbd></summary>

<br>

Run `task convex:dev` and wait for "Convex functions ready!"

</details>

<details>
<summary><kbd>🦀 Rust errors</kbd></summary>

<br>

```bash
cargo check  # See detailed errors
cargo clean  # Clear cache and rebuild
```

</details>

<br>

---

<br>

<div align="center">

**Built with ❤️ using**

[Convex](https://convex.dev) &nbsp;•&nbsp; [Rust](https://rust-lang.org) &nbsp;•&nbsp; [React](https://react.dev) &nbsp;•&nbsp; [PostgreSQL](https://postgresql.org)

<br>

<sub>MIT License © 2025</sub>

</div>
