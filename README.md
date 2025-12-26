<div align="center">

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!--                              HERO SECTION                                    -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->

<br>

<img src="https://img.shields.io/badge/🔥_SELF--HOSTED-Convex_Backend-FF6B6B?style=for-the-badge&labelColor=1a1a2e" alt="Convex">
<img src="https://img.shields.io/badge/🦀_RUST-CLI-DDA15E?style=for-the-badge&labelColor=1a1a2e" alt="Rust">
<img src="https://img.shields.io/badge/🐍_PYTHON-CLI-3776AB?style=for-the-badge&labelColor=1a1a2e" alt="Python">
<img src="https://img.shields.io/badge/🥟_BUN-CLI-FBF0DF?style=for-the-badge&labelColor=1a1a2e" alt="Bun">
<img src="https://img.shields.io/badge/🐹_GO-CLI-00ADD8?style=for-the-badge&labelColor=1a1a2e" alt="Go">
<img src="https://img.shields.io/badge/⚡_ZIG-CLI-F7A41D?style=for-the-badge&labelColor=1a1a2e" alt="Zig">
<img src="https://img.shields.io/badge/⚛️_REACT-19-61DAFB?style=for-the-badge&labelColor=1a1a2e" alt="React">

<br><br>

# 📝 Convex Notes

### ✨ _A stunning, self-hosted real-time notes application_ ✨

<br>

[⚡ Quick Start](#-quick-start) &nbsp;•&nbsp;
[🦀 Rust](#-rust-cli) &nbsp;•&nbsp;
[🐍 Python](#-python-cli) &nbsp;•&nbsp;
[🥟 Bun](#-bun-cli) &nbsp;•&nbsp;
[🐹 Go](#-go-cli) &nbsp;•&nbsp;
[⚡ Zig](#-zig-cli) &nbsp;•&nbsp;
[⚛️ React](#%EF%B8%8F-react-frontend)

<br>

<img src="https://img.shields.io/badge/Live_Sync-WebSocket-10B981?style=flat-square&logo=socket.io&logoColor=white" alt="WebSocket">
<img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/Clean_Architecture-SOLID-9333ea?style=flat-square" alt="Clean Architecture">
<img src="https://img.shields.io/badge/Uber_FX-DI-00ADD8?style=flat-square" alt="Uber FX">

</div>

<br>

---

<br>

## 🎯 Why Convex Notes?

> **Own your data. Control your backend. Choose your language.**

<table>
<tr>
<td align="center" width="16%">
<img width="36" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/docker.svg" alt="Docker">
<br>
<strong>🏠 Self-Hosted</strong>
</td>
<td align="center" width="16%">
<img width="36" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/rust.svg" alt="Rust">
<br>
<strong>🦀 Rust</strong>
</td>
<td align="center" width="16%">
<img width="36" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/python.svg" alt="Python">
<br>
<strong>🐍 Python</strong>
</td>
<td align="center" width="16%">
<img width="36" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/bun.svg" alt="Bun">
<br>
<strong>🥟 Bun</strong>
</td>
<td align="center" width="16%">
<img width="36" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/go.svg" alt="Go">
<br>
<strong>🐹 Go</strong>
</td>
<td align="center" width="16%">
<img width="36" src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/react.svg" alt="React">
<br>
<strong>⚛️ React</strong>
</td>
</tr>
</table>

<br>

---

<br>

## 🏗️ Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'background': '#0f172a'}}}%%

flowchart TB
    subgraph DOCKER["🐳 DOCKER"]
        PG[("🐘 PostgreSQL")]
        API["⚙️ Convex :3210"]
    end

    subgraph CLIENTS["👨‍💻 CLI CLIENTS"]
        direction LR
        RUST["🦀 Rust"]
        PYTHON["🐍 Python"]
        BUN["🥟 Bun"]
        GO["🐹 Go"]
        REACT["⚛️ React"]
    end

    RUST & PYTHON & BUN & GO & REACT <-. "WebSocket/HTTP" .-> API
    API <--> PG

    style PG fill:#336791,color:#fff
    style API fill:#ef4444,color:#fff
    style RUST fill:#dda15e,color:#000
    style PYTHON fill:#3776ab,color:#fff
    style BUN fill:#fbf0df,color:#000
    style GO fill:#00add8,color:#fff
    style REACT fill:#61dafb,color:#000
```

<br>

---

<br>

## 🚀 Quick Start

### 📋 Prerequisites

| Tool      | Purpose    | Install                              |
| --------- | ---------- | ------------------------------------ |
| 🐳 Docker | Containers | [docker.com](https://docker.com)     |
| 🦀 Rust   | Rust CLI   | [rustup.rs](https://rustup.rs)       |
| 🐍 uv     | Python CLI | [astral.sh/uv](https://astral.sh/uv) |
| 🥟 Bun    | Bun CLI    | [bun.sh](https://bun.sh)             |
| 🐹 Go     | Go CLI     | [go.dev](https://go.dev)             |

### ⚡ Express Setup

```bash
task setup && task docker:up && task admin:key
# Copy admin key to .env.local

task convex:dev      # Terminal 1
task frontend:dev    # Terminal 2

# Pick ANY CLI:
task rust:run        # 🦀 Rust
task python:run      # 🐍 Python
task bun:run         # 🥟 Bun
task go:run          # 🐹 Go
```

<br>

---

<br>

## 🦀 Rust CLI

> _Blazing fast with async Convex SDK_

```
backend/crates/
├── common/         # Config & utilities
├── db/             # Entity, Repository, Service
├── convex-client/  # Convex adapter
└── cli/            # UI & handlers
```

| Crate       | Purpose       |
| ----------- | ------------- |
| `convex`    | Native SDK    |
| `dialoguer` | CLI prompts   |
| `tokio`     | Async runtime |

<br>

---

<br>

## 🐍 Python CLI

> _Beautiful Rich terminal with Pydantic_

```
python-cli/src/convex_notes/
├── entity/         # Pydantic models
├── repository/     # Protocol + Convex
├── service/        # Business logic
└── handlers/       # Commands
```

| Package    | Purpose          |
| ---------- | ---------------- |
| `convex`   | Python SDK       |
| `rich`     | Beautiful output |
| `pydantic` | Validation       |

<br>

---

<br>

## 🥟 Bun CLI

> _TypeScript with @clack/prompts_

```
bun-cli/src/
├── entity/         # TypeScript types
├── repository/     # Interface + Convex
├── service/        # Business logic
├── handlers/       # Commands
└── ui/             # picocolors
```

| Package          | Purpose     |
| ---------------- | ----------- |
| `convex`         | JS SDK      |
| `@clack/prompts` | CLI prompts |
| `picocolors`     | Colors      |

<br>

---

<br>

## 🐹 Go CLI

> _Uber FX dependency injection + HTTP API_

```
go-cli/
├── main.go           # uber/fx DI setup
├── cmd/app.go        # Menu loop
└── internal/
    ├── entity/       # Note types
    ├── repository/   # Interface + HTTP
    ├── service/      # Business logic
    └── handler/      # Commands
```

| Package       | Purpose              |
| ------------- | -------------------- |
| `uber/fx`     | Dependency injection |
| `survey`      | CLI prompts          |
| `tablewriter` | Pretty tables        |

<br>

---

<br>

## ⚡ Zig CLI

> _Pure Zig with std.http.Client_

```
zig-cli/src/
├── main.zig          # Entry point
├── app.zig           # Menu loop
├── entity/           # Note types
├── repository/       # HTTP client
├── service/          # Business logic
├── handler/          # Commands
└── ui/               # ANSI colors
```

| Feature | Implementation            |
| ------- | ------------------------- |
| HTTP    | `std.http.Client`         |
| I/O     | `std.Io.Threaded`         |
| Memory  | `GeneralPurposeAllocator` |

<br>

---

<br>

## ⚛️ React Frontend

> _Glassmorphism UI with real-time updates_

| Feature          | Description          |
| ---------------- | -------------------- |
| 🌙 Dark Mode     | Purple gradients     |
| 💫 Glassmorphism | Backdrop blur        |
| ⚡ Real-time     | Convex subscriptions |

<br>

---

<br>

## 📁 Project Structure

```
📦 convex-notes/
├── 🐳 docker-compose.yml
├── 📂 convex/           # Backend functions
├── 🦀 backend/          # Rust CLI
├── 🐍 python-cli/       # Python CLI
├── 🥟 bun-cli/          # Bun CLI
├── 🐹 go-cli/           # Go CLI
└── ⚛️ frontend/         # React app
```

<br>

---

<br>

## 🛠️ Commands

| Command             | Description    |
| ------------------- | -------------- |
| `task rust:run`     | 🦀 Rust CLI    |
| `task python:run`   | 🐍 Python CLI  |
| `task bun:run`      | 🥟 Bun CLI     |
| `task go:run`       | 🐹 Go CLI      |
| `task frontend:dev` | ⚛️ React :3000 |

<br>

---

<br>

<div align="center">

### Built with ❤️

[**Convex**](https://convex.dev) • [**Rust**](https://rust-lang.org) • [**Python**](https://python.org) • [**Bun**](https://bun.sh) • [**Go**](https://go.dev) • [**React**](https://react.dev)

<sub>MIT License © 2025</sub>

</div>
