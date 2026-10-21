# Recruvo

Recruvo is a recruitment screening application for reviewing candidate resumes against job descriptions. It combines document parsing, AI-assisted evaluation, candidate comparison, and report exports in a single workspace.

## Features

- **Job descriptions:** Upload PDF, DOCX, or TXT files, or paste text. Review and edit extracted requirements and select an active job.
- **Candidate management:** Upload resumes in batches and review structured contact details, skills, experience, education, and projects.
- **Screening:** Evaluate technical skills, experience, education, and project relevance, with an overall job-match score, skill gaps, strengths, and interview questions.
- **Candidate details:** Navigate between overview, skills, experience, education and projects, and interview preparation tabs.
- **Comparison:** Review two candidates side by side against the selected job description.
- **Contextual assistant:** Ask questions using job and candidate records. Heuristic fallbacks support some operations when Gemini is unavailable.
- **Reports:** Export individual candidate and comparison reports as PDF, or download screening results as CSV.
- **User interface:** A public landing page and responsive recruiter workspace with consistent green accents, task-based navigation, and inline feedback.
- **Workspace tools:** Configure the Gemini key, refresh data, clear local session state, and submit feedback.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, React Router 8, Vite 8 |
| Styling | Tailwind CSS 4, Lucide React |
| Backend | Node.js, Express 5 |
| Database | Embedded PGlite or external PostgreSQL |
| AI integration | Google Gen AI SDK |
| Document processing | Multer, pdf-parse, Mammoth |
| Reports | jsPDF, jspdf-autotable, CSV export |

## Getting Started

### Requirements

- Node.js 22.22.0 or later, compatible with the dependencies in the lockfiles.
- npm.
- A Gemini API key for Gemini-backed parsing, screening, and assistant responses.
- PostgreSQL only if using an external database; embedded PGlite is the default.

### 1. Clone and install

```bash
git clone https://github.com/RohiVK/Recruvo.git
cd Recruvo
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key

# Optional: use external PostgreSQL instead of embedded PGlite.
# DATABASE_URL=postgresql://username:password@localhost:5432/recruvo_db
```

The embedded database stores data in `backend/hirely_pgdata/` when the backend runs from its directory. A Gemini key can also be configured through the workspace Settings page. Keep API keys out of version control.

The frontend uses `http://localhost:3000` for API requests. To change it, create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Run the application

From the repository root:

```bash
npm run dev
```

Alternatively, run the backend and frontend in separate terminals from the repository root:

```bash
npm run start:backend
```

```bash
npm run start:frontend
```

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:3000/health`

### 4. Use the workspace

1. Open the landing page and use Quick Demo Login to enter the workspace.
2. Upload or paste a job description and select it as the active role.
3. Upload candidate resumes and run screening from Analysis.
4. Review candidate details, compare profiles, and export reports.

Sample resumes are available in `sample_resumes/`.

### Frontend build

```bash
npm run build --prefix frontend
npm run preview --prefix frontend
```

The frontend build is written to `frontend/dist/`. The backend must run separately for API requests.

## Repository Structure

```text
Recruvo/
|-- backend/
|   |-- config/          # Database and Gemini configuration
|   |-- controllers/     # Document processing and application logic
|   |-- models/          # Database access and structured schemas
|   |-- routes/          # Express API routes
|   `-- index.js         # Backend entry point
|-- frontend/
|   `-- src/
|       |-- api/         # API clients and report exports
|       |-- components/  # Layout, UI, and assistant components
|       |-- context/     # Shared application state
|       |-- pages/       # Landing page and workspace screens
|       |-- App.jsx      # Routing
|       `-- index.css    # Shared styles and design tokens
|-- sample_resumes/
`-- README.md
```

## API Reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Server, database, and Gemini status |
| `GET`, `POST` | `/api/job-descriptions` | List jobs or parse a job description from text |
| `POST` | `/api/job-descriptions/upload` | Upload a job description file |
| `GET`, `PUT`, `DELETE` | `/api/job-descriptions/:id` | Read, update, or delete a job |
| `GET`, `POST` | `/api/resumes` | List candidates or upload resume files |
| `GET`, `PUT`, `DELETE` | `/api/resumes/:id` | Read, update, or delete a candidate |
| `GET`, `POST` | `/api/screenings` | List evaluations or screen a candidate against a job |
| `GET`, `PUT`, `DELETE` | `/api/screenings/:id` | Read, update, or delete an evaluation |
| `POST` | `/api/chat` | Query the contextual assistant |
| `POST` | `/api/feedback` | Submit feedback or a bug report |
| `GET` | `/api/settings` | Read API configuration status |
| `POST` | `/api/settings/gemini-key` | Update the Gemini API key |

Screening results can be filtered using `resume_id` and `jd_id`, for example: `/api/screenings?resume_id=1&jd_id=2`. Resume uploads use the multipart field `files`; job description uploads use `file`.

## Implementation Notes

- The current interface uses a fixed green theme; theme switching is not enabled.
- Login and registration are frontend demonstrations using local browser state. They do not provide production authentication or API access control.
- AI-generated scores, summaries, and extracted information require human review. Heuristic fallback output is not equivalent to a Gemini evaluation.
- Document contents are processed by the backend and may be sent to Gemini when AI processing is configured. Embedded storage does not mean all processing stays on the device.

## Contributors

- [RohiVK](https://github.com/RohiVK)
- [5uhaeb](https://github.com/5uhaeb)
