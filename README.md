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

This project is configured for automated deployment using **GitHub Actions** and **Netlify**.

### 1. Frontend (Netlify)

To set up automated deployment for the frontend:

1.  **Create a Netlify Site**: Log in to Netlify and create a new site from your GitHub repository (or a blank site).
2.  **Get Netlify Secrets**:
    - **`NETLIFY_AUTH_TOKEN`**: Generate a Personal Access Token in your Netlify [User Settings](https://app.netlify.com/user/settings/applications).
    - **`NETLIFY_SITE_ID`**: Found in your Site Settings -> Site information -> Site ID.
3.  **Add Secrets to GitHub**:
    - In your GitHub repository, go to `Settings` -> `Secrets and variables` -> `Actions`.
    - Add `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`.
    - (Optional) Add `VITE_API_BASE_URL` pointing to your hosted FastAPI backend.

Once configured, Every push to the `main` branch will automatically build and deploy your frontend to Netlify.

### 2. Backend (FastAPI)

The backend is configured with a CI pipeline (`.github/workflows/ci.yml`) that verifies dependencies and builds on every push. For hosting the backend, we recommend:
- **Railway**, **Render**, or **Fly.io** (Container-based hosting).
- Ensure you set your `OPENROUTER_API_KEY` in the hosting provider's environment variables.

## Project Structure

- `/backend/app/`: FastAPI application containing the agent logic, graphs, and tool definitions.
- `/frontend/`: React components, Vite configuration, and styles.
- `pyproject.toml` / `uv.lock`: Backend dependency configurations.
- `package.json`: Frontend dependency configurations.
- `.github/workflows/`: Automated CI/CD pipelines.
