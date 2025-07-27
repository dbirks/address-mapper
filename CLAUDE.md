# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### API (FastAPI/Python)
- **Run API locally**: `cd api && python main.py` (serves on http://localhost:8000)
- **API docs**: Navigate to http://localhost:8000/docs for Swagger UI
- **Format code**: `uvx ruff format` (from api/ directory)
- **Lint code**: `uvx ruff check` (from api/ directory)
- **Run tests**: `pytest` (from repository root)

### UI (React/Vite)
- **Install deps**: `cd ui && pnpm install`
- **Run dev server**: `cd ui && pnpm dev` (serves on http://localhost:5173)
- **Build for production**: `cd ui && pnpm build` (outputs to ui/dist/)
- **Format/lint**: `npx @biomejs/biome check --write .` (from ui/ directory)

### Docker
- **Run full stack**: `docker compose up` (API on :8000, UI on :3000)

### Task Runner
- **Install Task**: https://taskfile.dev/installation/
- **Common tasks**: `task --list` to see all available tasks
- **Quick dev**: `task dev` (starts both API and UI)
- **Format all**: `task format`
- **Test all**: `task test`

## Architecture

This is a full-stack address extraction application with two main components:

### API Structure (`api/`)
- **FastAPI application** with modular router architecture
- **Main routers**:
  - `/v1/extract`: Upload image → extract addresses via OpenAI Vision → geocode with Mapbox
  - `/v1/geocode`: Direct address geocoding
  - `/v1/health`: Health check endpoint
- **External services**: Requires OPENAI_API_KEY and MAPBOX_API_KEY environment variables
- **Azure OpenAI integration**: Configured for Azure OpenAI deployment

### UI Structure (`ui/`)
- **React SPA** with React Router for navigation
- **Three main pages**: Camera (upload), List (view records), Map (visualize coordinates)
- **Local state management**: Records stored in localStorage
- **UI library**: Tailwind CSS with shadcn/ui components and Lucide icons
- **Mobile-first design** with bottom navigation

### Key Integration Points
- UI calls `/v1/extract` endpoint for image processing
- Records contain: id, thumbnail, addresses[], coordinates[]
- Currently UI uses mock data; integration with API in progress

## Environment Setup
- API requires `.env` file with OPENAI_API_KEY and MAPBOX_API_KEY
- Python 3.13+ required for API
- Node.js with pnpm for UI development

## Code Style
- **Python**: Use ruff for formatting and linting (configured in pyproject.toml)
- **TypeScript/React**: Use Biome for formatting and linting (configured in biome.jsonc)
- **Testing**: pytest for Python unit tests (see api/tests/)

## Development Workflow
- **Commit frequently**: Make small, focused commits with clear messages
- **Run tests before committing**: Use `task test` or individual test commands
- **Format code before committing**: Use `task format` to ensure consistent style