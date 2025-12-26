<div align="center">

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!--                              HERO SECTION                                    -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->

<br>

<img src="https://img.shields.io/badge/🔥_SELF--HOSTED-Convex_Backend-FF6B6B?style=for-the-badge&labelColor=1a1a2e" alt="Convex">
<img src="https://img.shields.io/badge/🦀_RUST-CLI_Client-DDA15E?style=for-the-badge&labelColor=1a1a2e" alt="Rust">
<img src="https://img.shields.io/badge/🐍_PYTHON-CLI_Client-3776AB?style=for-the-badge&labelColor=1a1a2e" alt="Python">
<img src="https://img.shields.io/badge/⚛️_REACT-19_+_Vite_7-61DAFB?style=for-the-badge&labelColor=1a1a2e" alt="React">
<img src="https://img.shields.io/badge/🐘_POSTGRES-Database-336791?style=for-the-badge&labelColor=1a1a2e" alt="PostgreSQL">

<br><br>

# 📝 Convex Notes

### ✨ _A stunning, self-hosted real-time notes application_ ✨

<br>

[⚡ Quick Start](#-quick-start) &nbsp;•&nbsp;
[🏗️ Architecture](#%EF%B8%8F-architecture) &nbsp;•&nbsp;
[🦀 Rust CLI](#-rust-cli) &nbsp;•&nbsp;
[🐍 Python CLI](#-python-cli) &nbsp;•&nbsp;
[⚛️ Frontend](#%EF%B8%8F-react-frontend)

<br>

<img src="https://img.shields.io/badge/Live_Sync-WebSocket-10B981?style=flat-square&logo=socket.io&logoColor=white" alt="WebSocket">
<img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
<img src="https://img.shields.io/badge/Clean_Architecture-SOLID-9333ea?style=flat-square" alt="Clean Architecture">
<img src="https://img.shields.io/badge/uv-Package_Manager-DE5FE9?style=flat-square" alt="uv">

</div>

<br>

---

<br>

## 🎯 Why Convex Notes?

> **Own your data. Control your backend. Build in Rust or Python.**

<table>
<tr>
<td align="center" width="25%">
<br>
<img width="48" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/docker.svg" alt="Docker">
<br><br>
<strong>🏠 Self-Hosted</strong>
<br><br>
<sub>No cloud lock-in<br>Full data ownership</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
<img width="48" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/rust.svg" alt="Rust">
<br><br>
<strong>🦀 Rust CLI</strong>
<br><br>
<sub>Blazing fast<br>Memory safe</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
<img width="48" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/python.svg" alt="Python">
<br><br>
<strong>🐍 Python CLI</strong>
<br><br>
<sub>Rich terminal UI<br>Pydantic models</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
<img width="48" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/react.svg" alt="React">
<br><br>
<strong>⚛️ Modern UI</strong>
<br><br>
<sub>React 19 + Vite 7<br>Glassmorphism</sub>
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
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'primaryTextColor': '#fff', 'primaryBorderColor': '#818cf8', 'lineColor': '#a5b4fc', 'secondaryColor': '#1e1b4b', 'background': '#0f172a', 'mainBkg': '#1e293b', 'nodeBorder': '#818cf8', 'clusterBkg': '#1e1b4b40', 'clusterBorder': '#6366f150', 'edgeLabelBackground': '#1e293b'}}}%%

flowchart TB
    subgraph DOCKER["🐳 DOCKER COMPOSE"]
        direction TB

        subgraph DB_LAYER["💾 Data Layer"]
            PG[("🐘 PostgreSQL<br/>Port 5432")]
        end

        subgraph CONVEX["⚙️ Convex Backend"]
            API["🔧 API Server<br/>Port 3210"]
            HTTP["🌐 HTTP Actions<br/>Port 3211"]
        end

        subgraph ADMIN["📊 Admin"]
            DASH["Dashboard<br/>Port 9999"]
        end
    end

    subgraph CLIENTS["👨‍💻 CLIENT APPLICATIONS"]
        direction LR
        RUST["🦀 Rust CLI"]
        PYTHON["🐍 Python CLI"]
        REACT["⚛️ React App<br/>Port 3000"]
    end

    RUST <-. "WebSocket" .-> API
    PYTHON <-. "WebSocket" .-> API
    REACT <-. "WebSocket" .-> API
    API <--> PG
    DASH --> API

    style PG fill:#336791,stroke:#5A8DB8,stroke-width:2px,color:#fff
    style API fill:#ef4444,stroke:#f87171,stroke-width:2px,color:#fff
    style HTTP fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
    style DASH fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
    style RUST fill:#dda15e,stroke:#e5b97e,stroke-width:2px,color:#000
    style PYTHON fill:#3776ab,stroke:#5a9bd4,stroke-width:2px,color:#fff
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
| 🦀  | **Rust**   | Rust CLI          | [↗ rustup.rs](https://rustup.rs)       |
| 🐍  | **uv**     | Python CLI        | [↗ astral.sh/uv](https://astral.sh/uv) |
| 📦  | **Bun**    | Package manager   | [↗ bun.sh](https://bun.sh)             |
| 📋  | **Task**   | Task automation   | [↗ taskfile.dev](https://taskfile.dev) |

<br>

### ⚡ Express Setup

```bash
# One-liner to get started
task setup && task docker:up && task admin:key

# Copy the admin key to .env.local, then run in separate terminals:
task convex:dev      # Terminal 1 - Push functions
task frontend:dev    # Terminal 2 - React frontend
task rust:run        # Terminal 3 - Rust CLI
task python:run      # Terminal 4 - Python CLI (alternative)
```

<br>

### 📖 Step-by-Step Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'lineColor': '#a5b4fc', 'textColor': '#e2e8f0', 'background': '#0f172a'}}}%%

flowchart LR
    A["🐳<br/>Docker Up"] --> B["🔑<br/>Admin Key"] --> C["📝<br/>Env Config"] --> D["📦<br/>Convex Dev"] --> E["🚀<br/>Run Apps"]

    style A fill:#ef4444,stroke:#fca5a5,stroke-width:2px,color:#fff
    style B fill:#f59e0b,stroke:#fcd34d,stroke-width:2px,color:#000
    style C fill:#06b6d4,stroke:#67e8f9,stroke-width:2px,color:#000
    style D fill:#10b981,stroke:#6ee7b7,stroke-width:2px,color:#000
    style E fill:#8b5cf6,stroke:#c4b5fd,stroke-width:2px,color:#fff
```

<details>
<summary><kbd>📋 Detailed Commands</kbd></summary>

<br>

```bash
# 1️⃣ Start Docker services
task docker:up

# 2️⃣ Generate admin key
task admin:key

# 3️⃣ Update .env.local with the generated key
# CONVEX_SELF_HOSTED_ADMIN_KEY='your-key-here'

# 4️⃣ Push Convex functions (keep this terminal running)
task convex:dev

# 5️⃣ Start applications (in separate terminals)
task frontend:dev  # React at http://localhost:3000
task rust:run      # Rust CLI
task python:run    # Python CLI (alternative)
```

</details>

<br>

---

<br>

## 🦀 Rust CLI

<br>

> ### _Blazing fast terminal experience with clean architecture_

<br>

```
╔══════════════════════════════════════════════════════════╗
║           📝 CONVEX NOTES MANAGER                        ║
║         Self-Hosted • Rust Client • v0.1.0               ║
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

### 🏛️ Clean Architecture

```
backend/
├── Cargo.toml              # Workspace root
└── crates/
    ├── common/             # 🔧 Config & utilities
    ├── db/                 # 💾 Entity, Repository, Service
    ├── convex-client/      # 🔗 Convex adapter
    └── cli/                # 🖥️ UI & handlers
```

<br>

| Crate            | Purpose             |
| :--------------- | :------------------ |
| `convex`         | Convex client SDK   |
| `colored`        | Terminal colors     |
| `dialoguer`      | Interactive prompts |
| `prettytable-rs` | Formatted tables    |

<br>

---

<br>

## 🐍 Python CLI

<br>

> ### _Beautiful Rich terminal UI with Pydantic validation_

<br>

```
╭──────────────────────────────────────────────────────────────╮
│           📝 CONVEX NOTES MANAGER                            │
│         Self-Hosted • Python Client • v0.1.0                 │
╰──────────────────────────────────────────────────────────────╯

🚀 Connecting to http://127.0.0.1:3210...
✅ Connected to Convex backend!

What would you like to do?
  1. 📋 List all notes
  2. ✏️  Create a new note
  3. 📝 Update a note
  4. 🗑️  Delete a note
  5. 👀 Watch notes (real-time)
  6. 🚪 Exit
```

<br>

### 🏛️ Clean Architecture

```
python-cli/
├── pyproject.toml          # uv project config
└── src/convex_notes/
    ├── entity/             # 📦 Pydantic models
    ├── repository/         # 🔗 Protocol + Convex adapter
    ├── service/            # 🧠 Business logic
    ├── handlers/           # 🎯 Command handlers
    └── ui/                 # 🎨 Rich components
```

<br>

| Package    | Purpose            |
| :--------- | :----------------- |
| `convex`   | Convex client SDK  |
| `rich`     | Beautiful terminal |
| `pydantic` | Data validation    |
| `typer`    | CLI framework      |

<br>

---

<br>

## ⚛️ React Frontend

<br>

> ### _Modern glassmorphism UI with real-time Convex updates_

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
    📡 Data Layer
      Convex React
      Real-time Sync
      Optimistic UI
```

<br>

|     | Feature             | Description                    |
| :-: | :------------------ | :----------------------------- |
| 🌙  | **Dark Mode**       | Purple gradient backgrounds    |
| 💫  | **Glassmorphism**   | Cards with backdrop blur       |
| ⚡  | **Instant Updates** | Real-time Convex subscriptions |
| 📱  | **Responsive**      | Mobile-first design            |

<br>

---

<br>

## 📁 Project Structure

<br>

```
📦 convex-notes/
│
├── 🐳 docker-compose.yml      ← PostgreSQL + Convex + Dashboard
├── 📋 Taskfile.yml            ← Task automation commands
├── 🔐 .env.local              ← Environment secrets (gitignored)
│
├── 📂 convex/                 ← Convex backend functions
│   ├── schema.ts              ← Database schema
│   └── notes.ts               ← CRUD handlers
│
├── 🦀 backend/                ← Rust CLI (workspace)
│   └── crates/                ← common, db, convex-client, cli
│
├── 🐍 python-cli/             ← Python CLI (uv project)
│   └── src/convex_notes/      ← entity, repository, service, handlers
│
├── ⚛️ frontend/               ← React application
│   └── src/                   ← hooks, routes, integrations
│
└── 💾 data/                   ← Local persistence (gitignored)
```

<br>

---

<br>

## 🛠️ Task Commands

<br>

| Command             | Description                    |
| :------------------ | :----------------------------- |
| `task`              | List all available commands    |
| `task setup`        | Install all dependencies       |
| `task docker:up`    | Start Docker containers        |
| `task docker:down`  | Stop Docker containers         |
| `task convex:dev`   | Push & watch Convex functions  |
| `task frontend:dev` | Start React development server |
| `task rust:run`     | Run Rust CLI                   |
| `task python:run`   | Run Python CLI                 |

<br>

---

<br>

## 🔗 Service URLs

<br>

|     | Service       | URL                     | Description            |
| :-: | :------------ | :---------------------- | :--------------------- |
| 🔧  | **Backend**   | `http://127.0.0.1:3210` | Convex API endpoint    |
| 🌐  | **HTTP**      | `http://127.0.0.1:3211` | HTTP action handlers   |
| 📊  | **Dashboard** | `http://localhost:9999` | Convex admin interface |
| ⚛️  | **Frontend**  | `http://localhost:3000` | React application      |
| 🐘  | **Postgres**  | `localhost:5432`        | PostgreSQL database    |

<br>

---

<br>

## 🐛 Troubleshooting

<br>

<details>
<summary><kbd>🚫 Port already in use</kbd></summary>

<br>

Windows Hyper-V may reserve certain port ranges. To check:

```powershell
netsh interface ipv4 show excludedportrange protocol=tcp
```

**Solution:** Change the conflicting port in `docker-compose.yml`.

</details>

<details>
<summary><kbd>🔌 Connection failed</kbd></summary>

<br>

1. Verify Docker is running: `docker ps`
2. Check container logs: `task docker:logs`
3. Ensure `.env.local` contains correct `CONVEX_URL`

</details>

<details>
<summary><kbd>📦 Functions not found</kbd></summary>

<br>

Run `task convex:dev` and wait for the message: _"Convex functions ready!"_

</details>

<details>
<summary><kbd>🐍 Python errors</kbd></summary>

<br>

```bash
cd python-cli
uv sync          # Install dependencies
uv run convex-notes  # Run CLI
```

</details>

<br>

---

<br>

<div align="center">

### Built with ❤️ using

[**Convex**](https://convex.dev) &nbsp;•&nbsp;
[**Rust**](https://rust-lang.org) &nbsp;•&nbsp;
[**Python**](https://python.org) &nbsp;•&nbsp;
[**React**](https://react.dev) &nbsp;•&nbsp;
[**PostgreSQL**](https://postgresql.org)

<br>

<sub>MIT License © 2025</sub>

</div>
