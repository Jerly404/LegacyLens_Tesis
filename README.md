# LegacyAI — AI Legacy Software Analysis & Reverse Engineering Platform

![Platform](https://img.shields.io/badge/Platform-LegacyAI%20Enterprise-3B82F6?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Local LLMs](https://img.shields.io/badge/Inference-Local%20Ollama-7C3AED?style=for-the-badge)

**LegacyAI** is a professional, developer-focused SaaS platform engineered for software companies, CTOs, and software architects to understand unknown codebases, recover software architecture, extract dependencies, generate automated documentation, produce reverse-engineered UML diagrams, and query legacy repositories via offline, local Large Language Models (DeepSeek Coder, Qwen 2.5 Coder, Codestral, Llama 3).

---

## 1. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          LegacyAI Monorepo                             │
├────────────────────────────────┬───────────────────────────────────────┤
│  Frontend (Angular 20 Standalone)│  Backend (NestJS Clean Architecture) │
│  - Dark Theme (#0F1117, #151821)│  - DDD Domain & Repositories          │
│  - AST Code Viewer             │  - Prisma ORM (PostgreSQL)            │
│  - Interactive Dependency Graph│  - EventsGateway (WebSockets)         │
│  - Mermaid UML Generators      │  - JWT & Roles Guard                  │
│  - Codebase RAG AI Chat        │  - Local LLM Connector (Ollama)       │
├────────────────────────────────┴───────────────────────────────────────┤
│                 Shared Package (@codelens/shared)                      │
│                 - TypeScript Types, Interfaces, and DTOs               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Features

- **Dashboard**: High-level KPIs, real-time GPU/VRAM hardware monitor, recent legacy codebases table, and live reverse-engineering activity timeline.
- **Projects Explorer**: Search and filter repositories by language, architecture, LOC, and analysis status (Grid & Table views).
- **Multi-Step Upload Wizard**: 4-step wizard supporting ZIP drag & drop (up to 500MB), Git repository connectors, and local folder uploads with customizable AI parameters.
- **Analysis Progress**: Real-time multi-stage visual pipeline (Uploading -> AST Parsing -> Architecture Recovery -> Dependency Extraction -> Documentation Generation -> Vector Indexing) with live terminal logs.
- **Project Overview & Code Viewer**: VS Code style folder tree explorer, syntax-highlighted code viewer with complexity metrics, copy micro-interactions, and direct "Ask AI" actions.
- **Interactive Dependency Graph**: Multi-layer call graph (Controllers -> Services -> Repositories -> DB -> Message Queues) with zoom, pan, and interactive node inspector.
- **Architecture Analysis**: AI architectural style recovery (Layered, Monolithic, MVC, Clean, Hexagonal, Microservices, Event-Driven), confidence metrics, AST evidence tracing, and prioritized refactoring recommendations.
- **Technical Documentation**: Automated specifications covering System Overview, Architecture, REST API Contracts, Database Dictionaries, Modules, and Deployment with inline Markdown editor and PDF/Markdown/DOCX export.
- **Reverse-Engineered UML Diagrams**: Mermaid.js powered Class Diagrams, Sequence Diagrams, Component Diagrams, and Flowcharts with zoom, pan, fullscreen mode, and SVG export.
- **Codebase RAG AI Assistant**: Cursor/ChatGPT-inspired conversational assistant referencing exact code citations (`[file.java:line]`), conversation history, and contextual prompt suggestions.
- **Executive & Technical Reports**: Stakeholder-ready reports (Executive Summary, Technical Audit, Architecture Review, Refactoring Roadmap) with export to PDF, DOCX, Markdown, and JSON.
- **Settings & AI Configuration**: Local LLM switcher (DeepSeek Coder 33B, Qwen 2.5 Coder 32B, Codestral 22B), local endpoint configuration (`http://localhost:11434`), and real-time GPU acceleration monitoring (RTX 3050).

---

## 3. Project Structure

```text
├── frontend/                     # Angular 20 Standalone SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/             # Core Services & State (Auth, Projects, Analysis, Chat, Theme, etc.)
│   │   │   ├── features/         # Feature Modules (Dashboard, Projects, Upload, Overview, etc.)
│   │   │   ├── layouts/          # AdminLayout (Sidebar, Topbar) and AuthLayout
│   │   │   └── shared/           # Reusable UI Components (Cards, Buttons, CodeViewer, Graph, Diagrams)
│   │   ├── styles.css            # Dark mode tokens & glassmorphism styling
│   │   └── tailwind.config.js    # Design system colors and tokens
├── backend/                      # NestJS REST & WebSocket API
│   ├── src/
│   │   ├── common/               # Guards, Interceptors, Decorators, WebSockets Gateway
│   │   └── modules/              # Modular Clean Architecture (Projects, Analyzer, AI, UML, Docs)
│   └── prisma/                   # PostgreSQL Schema & Migrations
└── shared/                       # Shared Types & DTOs
    └── src/                      # TypeScript definitions consumed by frontend & backend
```

---

## 4. Getting Started & Installation

### Prerequisites
- **Node.js**: v20+ / v22+
- **npm** or **pnpm**
- **Ollama** (Optional, for local LLM inference)

### Installation

```bash
# 1. Install all monorepo dependencies
npm install --legacy-peer-deps

# 2. Build shared models library
npm run build:shared

# 3. Build all packages
npm run build:all
```

---

## 5. Running the Application

### Frontend Development Server

```bash
# Launch Angular application
npm run dev:frontend
```
> The application will be running at `http://localhost:4200/`.

### Backend Development Server

```bash
# Launch NestJS backend server
npm run dev:backend
```
> The API will be available at `http://localhost:3000/api` with Swagger docs at `http://localhost:3000/api/docs`.

---

## 6. Connecting Local LLMs (Ollama)

LegacyAI is designed to run with local, air-gapped open-source models.

1. Install and start [Ollama](https://ollama.ai/):
```bash
ollama serve
```

2. Pull recommended coding models:
```bash
# DeepSeek Coder 33B
ollama pull deepseek-coder:33b

# Qwen 2.5 Coder 32B
ollama pull qwen2.5-coder:32b
```

3. In LegacyAI, navigate to **Settings** (`/settings`) and verify the connection to `http://localhost:11434`.

---

## 7. Running Tests & Quality Assurance

```bash
# 1. Run all unit tests across the entire monorepo (Backend + Frontend)
npm run test:all

# 2. Run automated quality gate (Build + Lint + Tests)
npm run verify:all

# 3. Run Backend Jest unit tests
npm run test:backend

# 4. Run Frontend Angular/Jest unit tests
npm run test:frontend

# 5. Run Linting across all workspaces
npm run lint:all
```

---

## 8. Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Software Architect (Admin)** | `architect@legacyai.io` | `password123` |
| **Senior Developer** | `developer@legacyai.io` | `password123` |
| **Engineering Manager** | `manager@legacyai.io` | `password123` |
