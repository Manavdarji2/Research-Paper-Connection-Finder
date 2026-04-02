# MCP Project - AI Agent System

This project is an advanced AI Agent system built using **FastAPI**, **Langchain**, **FastMCP**, and a **React/Vite** frontend. It features a modern, interactive web interface capable of visualizing the AI's "thought process" and reasoning steps in a force-directed graph (using \`react-force-graph-2d\`) alongside real-time markdown-supported chat streaming.

## Key Features

- **Advanced Reasoning Pipeline:** A structured architecture handling user requests with planning, tool decision, and execution phases.
- **Real-time Streamed Responses:** Instant display of AI responses and live-thinking process.
- **Graph Visualization:** Interactive tracking and display of AI operations and internal state.
- **Model Context Protocol (MCP) Integration:** Extends capabilities with specialized external tools.
- **Smart Chat Management:** Automatic, context-aware title generation for chat history.
- **Flexible LLM Backends:** Uses OpenRouter and Langchain to easily integrate and switch between models (e.g., `google/gemma-3-4b-it:free`).

## Technology Stack

- **Backend:** Python 3.13+, FastAPI, FastMCP, Langchain, NetworkX, Uvicorn 
- **Frontend:** React 19, Vite, Axios, Lucide React, React Markdown, React Force Graph 2D
- **Package Management:** `uv` (backend), `npm` (frontend)

## Setup Instructions

### 1. Backend Setup

The backend utilizes `uv` for lightning-fast dependency management and requires Python 3.13+.

1. Navigate to the root directory.
2. Install the dependencies using `uv` (or `pip` if you prefer):
   ```bash
   uv sync
   # or
   pip install -e .
   ```
3. Set up the environment variables:
   - Copy the example `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Make sure to add your `OPENROUTER_API_KEY` in the newly created `.env` file.

4. Start the backend server:
   ```bash
   uv run uvicorn backend.app.main:app --reload
   ```
   *(The API will be accessible at `http://localhost:8000`)*

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The web interface will be accessible at `http://localhost:5173`)*

## Deployment

This project is configured for automated deployment using **GitHub Actions**, **Vercel**, and **Render**.

### 1. Frontend (Vercel)

The frontend is deployed to Vercel via a GitHub Action (`.github/workflows/deploy_vercel.yml`).

1.  **Vercel Setup**:
    - Create a new project in your Vercel Dashboard.
    - Obtain your **`VERCEL_ORG_ID`** and **`VERCEL_PROJECT_ID`** from the project settings.
    - Generate a **`VERCEL_TOKEN`** in your [Vercel Account Settings](https://vercel.com/account/tokens).
2.  **Add Secrets to GitHub**:
    - Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` to your GitHub repository secrets.
    - (Optional) Add `VITE_API_BASE_URL` pointing to your hosted FastAPI backend.

### 2. Backend (Render)

The backend is configured for **Render** using a `render.yaml` Blueprint.

1.  **Deploy on Render**:
    - Connect your GitHub repository to Render.
    - Select **Blueprints** and choose this repository.
    - Render will automatically detect the `render.yaml` and configure the service.
2.  **Environment Variables**:
    - Set `OPENROUTER_API_KEY` in the Render dashboard for the `mcp-backend` service.
    - The server will start automatically using `uvicorn`.

## Project Structure

- `/backend/app/`: FastAPI application containing the agent logic, graphs, and tool definitions.
- `/frontend/`: React components, Vite configuration, and styles.
- `pyproject.toml` / `uv.lock`: Backend dependency configurations.
- `package.json`: Frontend dependency configurations.
- `.github/workflows/`: Automated CI/CD pipelines.
