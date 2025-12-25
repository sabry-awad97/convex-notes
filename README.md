<p align="center">
  <img src="https://img.shields.io/badge/Convex-Self--Hosted-FF6B6B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6Ii8+PC9zdmc+" alt="Convex">
  <img src="https://img.shields.io/badge/Rust-CLI-DDA15E?style=for-the-badge&logo=rust" alt="Rust">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Docker-Powered-2496ED?style=for-the-badge&logo=docker" alt="Docker">
</p>

<h1 align="center">📝 Convex Notes</h1>

<p align="center">
  <strong>A beautiful, self-hosted notes application with real-time sync</strong><br>
  <sub>Built with Convex • Rust • React • Docker</sub>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-rust-cli">Rust CLI</a> •
  <a href="#-react-frontend">Frontend</a>
</p>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🦀 Rust CLI

- Interactive terminal UI with colors
- Fuzzy-select menus with `dialoguer`
- Beautiful tables with `prettytable-rs`
- Real-time subscriptions via WebSocket
- Environment config with `envconfig`

</td>
<td width="50%">

### ⚛️ React Frontend

- Modern glassmorphism design
- Real-time updates with Convex React
- TailwindCSS v4 styling
- TanStack Router navigation
- Fully responsive layout

</td>
</tr>
<tr>
<td>

### 🐳 Self-Hosted Backend

- No cloud dependency
- Local SQLite storage
- Full data ownership
- Easy Docker deployment
- Admin dashboard included

</td>
<td>

### 🔄 Real-Time Sync

- Instant updates across all clients
- WebSocket subscriptions
- Optimistic UI updates
- Offline-first architecture
- Conflict-free data sync

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "🐳 Docker Environment"
        subgraph "Convex Stack"
            BE["🔧 Backend<br/><code>:3210</code>"]
            HA["🌐 HTTP Actions<br/><code>:3211</code>"]
            DB[("💾 SQLite<br/>./data")]
            DASH["📊 Dashboard<br/><code>:9999</code>"]
        end
    end

    subgraph "👨‍💻 Developer Machine"
        subgraph "Rust Client"
            RC["🦀 CLI App"]
            WS1["📡 WebSocket"]
        end

        subgraph "React Frontend"
            FE["⚛️ Vite Dev Server<br/><code>:3000</code>"]
            WS2["📡 WebSocket"]
        end

        subgraph "Convex Functions"
            FN["📄 notes.ts"]
            SC["📋 schema.ts"]
        end
    end

    RC --> WS1
    WS1 <-->|"Real-time"| BE
    FE --> WS2
    WS2 <-->|"Real-time"| BE
    BE <--> DB
    BE --> HA
    DASH -->|"Admin"| BE
    FN -->|"npx convex dev"| BE
    SC -->|"Schema"| BE

    style BE fill:#ff6b6b,stroke:#333,color:#fff
    style RC fill:#dda15e,stroke:#333,color:#fff
    style FE fill:#61dafb,stroke:#333,color:#333
    style DB fill:#577590,stroke:#333,color:#fff
    style DASH fill:#9b5de5,stroke:#333,color:#fff
```

---

## 🚀 Quick Start

### Prerequisites

| Tool        | Purpose               | Install                              |
| ----------- | --------------------- | ------------------------------------ |
| 🐳 Docker   | Run Convex backend    | [docker.com](https://docker.com)     |
| 🦀 Rust     | CLI application       | [rustup.rs](https://rustup.rs)       |
| 📦 Bun/Node | Frontend & Convex CLI | [bun.sh](https://bun.sh)             |
| 📋 Task     | Task automation       | [taskfile.dev](https://taskfile.dev) |

### One-Command Setup

```bash
# Clone and enter the project
git clone <repo-url> && cd convex-notes

# Install everything
task setup
```

### Step-by-Step Guide

```mermaid
flowchart LR
    subgraph "1️⃣ Backend"
        A[docker compose up] --> B[Generate Key]
    end

    subgraph "2️⃣ Functions"
        B --> C[Update .env.local]
        C --> D[npx convex dev]
    end

    subgraph "3️⃣ Clients"
        D --> E[Frontend: bun run dev]
        D --> F[Rust: cargo run]
    end

    style A fill:#ff6b6b,stroke:#333,color:#fff
    style B fill:#feca57,stroke:#333,color:#333
    style C fill:#48dbfb,stroke:#333,color:#333
    style D fill:#1dd1a1,stroke:#333,color:#333
    style E fill:#61dafb,stroke:#333,color:#333
    style F fill:#dda15e,stroke:#333,color:#333
```

<details>
<summary><strong>📖 Detailed Instructions</strong></summary>

#### 1. Start the Docker Backend

```bash
task docker:up
# or: docker compose up -d
```

> 💡 The backend will be available at `http://127.0.0.1:3210`  
> 📊 Dashboard at `http://localhost:9999`

#### 2. Generate Admin Key

```bash
task admin:key
# or: docker compose exec backend ./generate_admin_key.sh
```

Copy the generated key to `.env.local`:

```env
CONVEX_SELF_HOSTED_URL='http://127.0.0.1:3210'
CONVEX_SELF_HOSTED_ADMIN_KEY='convex-self-hosted|your-key-here'
CONVEX_URL='http://127.0.0.1:3210'
```

#### 3. Push Convex Functions

```bash
task convex:dev
# or: npx convex dev
```

> ⏳ Keep this terminal running - it watches for changes

#### 4. Start the Frontend

```bash
task frontend:dev
# or: cd frontend && bun run dev
```

> 🌐 Open http://localhost:3000

#### 5. Run the Rust CLI

```bash
task rust:run
# or: cd backend && cargo run
```

</details>

---

## 🦀 Rust CLI

A beautiful terminal application with interactive menus and colored output.

### Screenshots

```
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

### Dependencies

| Crate            | Purpose             |
| ---------------- | ------------------- |
| `convex`         | Convex Rust client  |
| `colored`        | Terminal colors     |
| `dialoguer`      | Interactive prompts |
| `prettytable-rs` | Formatted tables    |
| `envconfig`      | Configuration       |
| `chrono`         | Date formatting     |
| `tokio`          | Async runtime       |

### Data Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI as 🦀 Rust CLI
    participant Convex as 🔧 Backend
    participant DB as 💾 SQLite

    User->>CLI: Select "Create Note"
    CLI->>CLI: dialoguer::Input
    User->>CLI: Enter title & content
    CLI->>Convex: mutation("notes:create")
    Convex->>DB: INSERT
    DB-->>Convex: Success
    Convex-->>CLI: FunctionResult::Value(id)
    CLI->>CLI: colored output ✅
    CLI-->>User: "Note created!"
```

---

## ⚛️ React Frontend

A modern, glassmorphism-styled notes interface with real-time updates.

### Tech Stack

```mermaid
mindmap
  root((Frontend))
    Build
      Vite 7
      TypeScript
      React 19
    Styling
      TailwindCSS 4
      Glassmorphism
      Gradients
    Routing
      TanStack Router
      File-based routes
    Data
      Convex React
      Real-time sync
      Optimistic UI
    Components
      shadcn/ui
      Lucide Icons
```

### Features

- 🎨 **Dark mode** with purple gradient backgrounds
- 💫 **Glassmorphism** cards with backdrop blur
- ⚡ **Instant updates** via Convex subscriptions
- 📱 **Responsive** design for all screen sizes
- 🔄 **Optimistic UI** for snappy interactions

---

## 📁 Project Structure

```
convex-notes/
├── 🐳 docker-compose.yml      # Self-hosted Convex stack
├── 📋 Taskfile.yml            # Task automation (task --list)
├── 🔐 .env.local              # Secrets (gitignored)
├── 📦 package.json            # Root dependencies
│
├── 📂 convex/                 # Convex backend functions
│   ├── schema.ts              # Database schema
│   └── notes.ts               # CRUD mutations/queries
│
├── 🦀 backend/                # Rust CLI application
│   ├── Cargo.toml             # Rust dependencies
│   └── src/
│       └── main.rs            # CLI entrypoint
│
├── ⚛️ frontend/               # React application
│   ├── index.html             # Entry HTML
│   ├── package.json           # Frontend deps
│   ├── vite.config.ts         # Vite configuration
│   └── src/
│       ├── main.tsx           # React entrypoint
│       ├── hooks/
│       │   └── useNotes.ts    # Convex data hook
│       ├── routes/
│       │   └── index.tsx      # Notes page
│       └── integrations/
│           └── convex/        # Convex setup
│
└── 📂 data/                   # SQLite storage (gitignored)
```

---

## 📝 Database Schema

```mermaid
erDiagram
    NOTES {
        string _id PK "Auto-generated ID"
        string title "Note title"
        string content "Note content"
        number createdAt "Unix timestamp (ms)"
        number updatedAt "Unix timestamp (ms)"
    }
```

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

---

## 🛠️ Available Tasks

Run `task` to see all available commands:

| Command               | Description               |
| --------------------- | ------------------------- |
| `task setup`          | Install all dependencies  |
| `task docker:up`      | Start Convex backend      |
| `task docker:down`    | Stop Convex backend       |
| `task docker:logs`    | View backend logs         |
| `task admin:key`      | Generate admin key        |
| `task convex:dev`     | Push & watch functions    |
| `task frontend:dev`   | Start React dev server    |
| `task frontend:build` | Build for production      |
| `task rust:run`       | Run Rust CLI              |
| `task rust:watch`     | Auto-rebuild on changes   |
| `task rust:check`     | Check for errors          |
| `task clean`          | Clean all build artifacts |

---

## 🔗 Service URLs

| Service             | URL                   | Description          |
| ------------------- | --------------------- | -------------------- |
| 🔧 **Backend**      | http://127.0.0.1:3210 | Convex API endpoint  |
| 🌐 **HTTP Actions** | http://127.0.0.1:3211 | HTTP action handlers |
| 📊 **Dashboard**    | http://localhost:9999 | Admin interface      |
| ⚛️ **Frontend**     | http://localhost:3000 | React application    |

---

## 🐛 Troubleshooting

<details>
<summary><strong>🚫 Port already in use</strong></summary>

Windows Hyper-V may reserve ports. Check with:

```powershell
netsh interface ipv4 show excludedportrange protocol=tcp
```

Solution: Change the port in `docker-compose.yml`

</details>

<details>
<summary><strong>🔌 Can't connect to backend</strong></summary>

1. Check Docker is running: `docker ps`
2. Verify backend health: `docker compose logs backend`
3. Ensure `.env.local` has correct `CONVEX_URL`

</details>

<details>
<summary><strong>📦 Functions not found</strong></summary>

Run `task convex:dev` and wait for "Convex functions ready!"

</details>

<details>
<summary><strong>🦀 Rust compilation errors</strong></summary>

```bash
cargo check  # See detailed errors
cargo clean  # Clear cache and rebuild
```

</details>

---

## 📄 License

MIT © 2024

---

<p align="center">
  Made with ❤️ using <a href="https://convex.dev">Convex</a>, <a href="https://rust-lang.org">Rust</a>, and <a href="https://react.dev">React</a>
</p>
