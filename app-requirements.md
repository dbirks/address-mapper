## Summary

This document outlines a comprehensive set of requirements for building and deploying a full-stack address-extraction app on Vercel. The **backend** will be a Python FastAPI service running as a serverless function (using Vercel’s Python runtime), with an image-upload endpoint that sends uploads to GPT-4.1 for OCR and returns a structured list of addresses ([Vercel][1]). It uses the OpenAI Python SDK for model calls ([GitHub][2]) and the AG2 agent framework (formerly AutoGen) to orchestrate OCR and geocoding tool calls ([GitHub][3]). The **frontend** will be built with Vite, React, and TypeScript, styled using Tailwind CSS and shadcn/ui components ([DigitalOcean][4], [Shadcn UI][5]). After extracting addresses, the backend AG2 agent passes them to a geocoding tool to obtain latitude/longitude pairs, returning an array of `{ address, latitude, longitude }` objects. The frontend displays these on an interactive Mapbox GL map ([Mapbox][6]). Below are detailed requirements and project structure guidelines.

---

## 1. Tech Stack

### 1.1 Deployment Platform

* **Vercel** for hosting both the frontend and backend as serverless functions, leveraging the Python runtime (`@vercel/python`) and automatic builds via `vercel.json` ([Vercel][1]).

### 1.2 Backend

* **Language & Framework**: Python 3.9+ with [FastAPI](https://fastapi.tiangolo.com/) for HTTP endpoints ([FastAPI][7]).
* **ASGI Server**: Uvicorn to run FastAPI ([Stackademic][8]).
* **Agent Framework**: AG2 (formerly AutoGen) installed via `pip install ag2[openai]` for orchestrating multi-step AI workflows ([GitHub][3]).
* **LLM SDK**: OpenAI Python SDK installed via `pip install openai` for GPT-4.1 calls ([GitHub][2]).
* **Project Management**: Use `pyproject.toml` (e.g., with Poetry or PDM) to declare dependencies and tools.

### 1.3 Frontend

* **Build Tool**: [Vite](https://vite.dev/) with React + TypeScript template ([DigitalOcean][4]).
* **CSS Framework**: Tailwind CSS for utility-first styling ([Shadcn UI][9]).
* **Component Library**: [shadcn/ui](https://ui.shadcn.com/docs/installation/vite) for accessible, customizable UI primitives ([Shadcn UI][5]).
* **Mapping**: Mapbox GL JS integration via React (e.g., `react-map-gl`) for displaying pins ([Mapbox][6]).

---

## 2. Directory Structure

```
/
├── api/                      # Vercel serverless functions
│   ├── upload_image.py      # FastAPI app entrypoint
│   ├── agent.py             # AG2 agent orchestration logic
│   └── pyproject.toml       # Backend dependencies & scripts
├── src/                      # Frontend source (Vite root)
│   ├── components/          # shadcn/ui components
│   ├── App.tsx              # Main React component
│   ├── index.css            # Tailwind base
│   ├── main.tsx             # React DOM entry
│   └── vite.config.ts       # Vite config
├── public/                   # Static assets (e.g., favicon)
├── vercel.json              # Vercel build & routing config
└── README.md                # Project overview & setup
```

---

## 3. Backend Requirements

### 3.1 FastAPI Function (`api/upload_image.py`)

* **Endpoint**: `POST /api/upload-image`
* **Payload**: `multipart/form-data` with a single `file: UploadFile` parameter ([FastAPI][7]).
* **Processing**:

  1. Read the uploaded image from `UploadFile`.
  2. Invoke AG2 agent with a GPT-4.1 tool call for OCR, configured to return a JSON list of address strings.
  3. Pass the list to a geocoding tool (e.g., Mapbox Geocoding API or OpenAI function tool) within the AG2 agent.
  4. AG2 returns an array of dictionaries: `{ "address": "...", "latitude": 12.34, "longitude": 56.78 }`.
* **Response**: `application/json` with `{"results": [ { address, latitude, longitude }, ... ]}`.

### 3.2 AG2 Agent (`api/agent.py`)

* **Configuration**:

  * Use `AG2Agent` class, load OpenAI API key via `OAI_CONFIG_LIST`.
  * Define two tools:

    1. **OCR Tool**: Calls GPT-4.1 for structured extraction.
    2. **Geocode Tool**: Accepts an address string, returns lat/lng (using Mapbox or OpenAI function call).
* **Orchestration**: Agent first calls OCR tool, then iterates addresses through Geocode tool, composes final output.

---

## 4. Frontend Requirements

### 4.1 Page Layout (`src/App.tsx`)

* Fullscreen, responsive design with a header explaining:
  “Upload a picture of any form containing addresses. We’ll extract the addresses and plot them on a map.”
* **Upload Widget**: Use an `<input type="file" accept="image/*">` with Tailwind styling.
* **Map Area**: Render a Mapbox map that, upon receiving geocoded results, places marker pop-ups at each coordinate.

### 4.2 State & API Calls

* Use React hooks (`useState`, `useEffect`) to manage:

  1. Selected file.
  2. API call status/loading.
  3. `results` data from backend.
* Send file via `fetch('/api/upload-image', { method: 'POST', body: formData })`.

### 4.3 Styling & Components

* Tailwind CSS utility classes for layout and responsiveness.
* shadcn/ui components for buttons, forms, modals (initialized via `npx shadcn@canary init`) ([GitHub][10]).
* Ensure mobile-first design.

### 4.4 Map Integration

* Initialize Mapbox GL JS with `mapbox-gl` or `react-map-gl`:

  ```tsx
  import Map, { Marker, Popup } from 'react-map-gl';
  ```
* Loop over `results` state, render `<Marker longitude={lng} latitude={lat} />` with popup showing original address ([LogRocket Blog][11]).

---

## 5. Deployment Configuration

### `vercel.json`

```json
{
  "builds": [
    {
      "src": "api/*.py",
      "use": "@vercel/python"
    },
    {
      "src": "src/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1.py" },
    { "src": "/(.*)",      "dest": "/src/index.html" }
  ]
}
```

* **Python Runtime**: Vercel’s beta Python runtime supports FastAPI functions ([Vercel][1]).
* **Static**: Serve built Vite assets from `src/`.

---

## 6. Non-Functional Requirements

* **Security**: No authentication initially; ensure payload size limits and file-type checks.
* **Performance**: Agent orchestration should handle up to N images concurrently; consider caching geocoding results.
* **Maintainability**: Well-documented `pyproject.toml` and `package.json` scripts for local dev (`uvicorn api.upload_image:app --reload`, `vite`).
* **Scalability**: Vercel auto-scales functions; monitor usage via logs and AG2 traces.

---

This requirements specification provides clear guidance for an LLM-driven agent or developer team to scaffold, implement, and deploy the described application on Vercel.

[1]: https://vercel.com/docs/functions/runtimes/python?utm_source=chatgpt.com "Using the Python Runtime with Vercel Functions"
[2]: https://github.com/openai/openai-python?utm_source=chatgpt.com "The official Python library for the OpenAI API - GitHub"
[3]: https://github.com/ag2ai/ag2?utm_source=chatgpt.com "ag2ai/ag2: AG2 (formerly AutoGen): The Open-Source ... - GitHub"
[4]: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-react-project-with-vite?utm_source=chatgpt.com "How To Set Up a React Project with Vite for Fast Development"
[5]: https://ui.shadcn.com/docs/installation/vite?utm_source=chatgpt.com "Vite - Shadcn UI"
[6]: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/?utm_source=chatgpt.com "Use Mapbox GL JS in a React app | Help"
[7]: https://fastapi.tiangolo.com/tutorial/request-files/?utm_source=chatgpt.com "Request Files - FastAPI"
[8]: https://blog.stackademic.com/simple-guide-on-deploying-python-fastapi-on-vercel-free-of-cost-549e879305d6?utm_source=chatgpt.com "Simple Guide on Deploying Python FastAPI on Vercel — Free of Cost"
[9]: https://ui.shadcn.com/docs/installation/manual?utm_source=chatgpt.com "Manual Installation - Shadcn UI"
[10]: https://github.com/shadcn-ui/ui/discussions/6714?utm_source=chatgpt.com "Tailwind v4 and React 19 · shadcn-ui ui · Discussion #6714 - GitHub"
[11]: https://blog.logrocket.com/using-mapbox-gl-js-react/?utm_source=chatgpt.com "Using Mapbox GL JS with React - LogRocket Blog"
