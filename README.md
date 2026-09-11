# Recruvo — Smarter Hiring. Brighter Teams.

![Recruvo Banner](https://raw.githubusercontent.com/RohiVK/Recruvo/main/frontend/public/favicon.svg)

> **Recruvo** is an AI-powered candidate screening and recruitment intelligence platform designed to eliminate hiring friction. Grounded strictly in job description requirements and verified candidate profiles, Recruvo empowers recruiters with multi-dimensional match scoring, side-by-side candidate comparisons, tailored interview question generation, and contextual AI decision support.

---

## 🌟 Key Features

### 0. 🎨 Dual-Theme Visual Identity (CLASSIC ◐ GEN-Z)
- **Instant Global Toggle:** Switch themes instantly with zero page reload via the header toggle or Settings tab.
- **CLASSIC Theme:** Clean, professional, minimal, recruiter-friendly with crisp slate/white surfaces, high readability, and Notion/Linear aesthetic.
- **GEN-Z Theme:** Modern AI-native developer aesthetic with dark obsidian surfaces (`#08090E`), glowing accents, bento layouts, oversized statistics, radial score rings, and subtle gradient trims inspired by modern AI startup interfaces.
- **Persistent Preference:** Remembers user visual selection across browser sessions via `localStorage`.

### 1. 📋 Job Description Intelligence
- **Multi-Format Upload:** Upload JDs in **PDF**, **DOCX**, or **TXT** format, or paste raw job requisitions.
- **Structured AI Extraction:** Automatically extracts job title, hiring company, location, experience requirements, required skills, preferred qualifications, and core responsibilities.
- **Full Requisition Management:** Live interactive editing of JD fields and delete capabilities with automatic cascade cleanup of obsolete screening data.

### 2. 📄 Resume Parsing & Candidate Roster
- **Batch Processing:** Upload multiple candidate resumes simultaneously (PDF, DOCX, TXT).
- **Deep Profile Extraction:** Accurately extracts candidate contact info, technical skills, chronological work experience, educational history, certifications, and project portfolios.
- **Candidate Management:** Individual candidate profile inspection and deletion with real-time roster updates.

### 3. 🎯 Multi-Dimensional AI Screening
- **Multi-Factor Scoring Matrix:** Evaluates candidates across five distinct pillars:
  - **Technical Competency Fit**
  - **Experience & Seniority Alignment**
  - **Educational Background**
  - **Project Relevance**
  - **Overall JD Match Percentage**
- **Gap & Strength Analysis:** Explicitly identifies matching verified competencies vs. flagged missing skills from the Job Description.
- **Tailored Interview Framework:** Generates customized technical and behavioral interview questions targeted at probing candidate gap areas.

### 4. 🔍 Candidate Deep-Dive (5-Pillar View)
- **Overview:** Match score gauge, executive AI summary, contact info, and quick recommendation.
- **Skills Matrix:** Side-by-side comparison of verified candidate skills vs. JD required/preferred skills.
- **Experience Timeline:** Detailed roles, companies, durations, and project descriptions.
- **Education:** Academic qualifications, institutions, and graduation years.
- **Recommendations & Interview Prep:** Actionable recruiter notes and numbered interview questions.

### 5. ⚖️ Side-by-Side Candidate Comparison
- **Direct 2-Candidate Evaluation:** Select any two candidates from your roster for an instant head-to-head comparison matrix.
- **Trade-off Analysis:** Compares overall match, technical fit, experience, strengths, and gap areas to assist final hiring decisions.
- **Contextual Comparison AI:** Dedicated prompt suggestions for comparing technical depth, seniority, and skill tradeoffs.

### 6. 🤖 Contextual Recruvo AI Decision Assistant
- **Strict Grounding & Anti-Hallucination:** Answers strictly using the uploaded JD and candidate resume records.
- **Contextual Integration:** Seamlessly integrated into Candidate Analysis, Results Table, and Comparison pages (never cluttering main navigation).
- **Resilient Fallback Engine:** Guarantees instant decision assistance with rich domain heuristics even under API rate limits.
- **Clean Typography:** Zero raw markdown clutter — outputs styled dot bullets, numbered lists, and bold headers.

### 7. 📥 Multi-Format Export Engine
- **Single Candidate PDF Report:** Professional PDF report with candidate match scores, skills breakdown, summary, and interview focus areas.
- **Candidate Comparison PDF:** Side-by-side comparison matrix formatted with tables and trade-off insights.
- **Complete Results CSV:** Full candidate dataset export for spreadsheet analysis.

### 8. ⚙️ Workspace & Data Control
- **Embedded PostgreSQL (PGlite):** Runs immediately without requiring external database installation.
- **External PostgreSQL Support:** Connects seamlessly to production PostgreSQL instances via `DATABASE_URL`.
- **Cache & Session Reset:** One-click workspace cache wipe and data refresh.
- **Recruiter Feedback System:** Built-in 5-star rating, suggestion box, and bug report submission.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, React Router v7, Vite 8 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React Icons |
| **Export Engines** | jsPDF, jspdf-autotable, CSV exporter |
| **Backend Runtime** | Node.js (ES Modules), Express 5 |
| **Database Engine** | Embedded PGlite (PostgreSQL WebAssembly) / PostgreSQL (`pg`) |
| **AI Decision Engine** | Google Gen AI SDK (`@google/genai` with `gemini-3.6-flash`) |
| **Document Parsers** | Multer (Multipart Memory Storage), `pdf-parse`, `mammoth` (DOCX) |

---

## 📁 Repository Structure

```
Recruvo/
├── backend/
│   ├── config/
│   │   ├── db.js                 # PGlite & PostgreSQL connection wrapper
│   │   └── gemini.js             # Google Gemini AI client configuration
│   ├── controllers/
│   │   ├── chat.controller.js    # Grounded contextual AI chat & fallback engine
│   │   ├── feedback.controller.js# User feedback & bug report handling
│   │   ├── job_description.controller.js # JD upload, extraction, update & delete
│   │   ├── resume.controller.js  # Resume extraction (PDF/DOCX) & candidate CRUD
│   │   ├── screening.controller.js # Multi-dimensional AI candidate screening
│   │   └── settings.controller.js# System health & cache status
│   ├── models/
│   │   ├── gemini.schemas.js     # Structured JSON schemas for Gemini
│   │   ├── job_description.schema.js # PostgreSQL Job Description model
│   │   ├── resume.model.js       # PostgreSQL Resume model
│   │   └── screening.schema.js   # PostgreSQL Screening & evaluation model
│   ├── routes/                   # Express REST API route definitions
│   ├── index.js                  # Express application entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # API clients (chat, jobs, resumes, screenings, exports)
│   │   ├── components/
│   │   │   ├── ai/               # RecruvoAIChat contextual widget
│   │   │   └── layout/           # AppShell, Sidebar, Header, Global Command Palette
│   │   ├── context/              # RecruvoContext state management
│   │   ├── pages/                # Dashboard, UploadJD, UploadResumes, Analysis,
│   │   │                         # CandidateAnalysis, CompareCandidates, Export, Settings, Feedback
│   │   ├── App.jsx               # Application routing & layout
│   │   ├── main.jsx              # React DOM root
│   │   └── index.css             # Tailwind CSS design system tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Google Gemini API Key**: [Get a Gemini API key](https://aistudio.google.com/app/apikey)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/RohiVK/Recruvo.git
cd Recruvo
```

---

### Step 2: Configure Environment Variables

Create a `.env` file inside the `backend/` directory:
```bash
cd backend
```

Add the following configuration to `backend/.env`:
```env
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: External PostgreSQL connection (leave blank to use embedded PGlite)
# DATABASE_URL=postgresql://username:password@localhost:5432/recruvo_db
```

---

### Step 3: Install Dependencies & Run

#### Terminal 1 — Start the Backend Server:
```bash
cd backend
npm install
npm run dev
```
*Backend server will start at `http://localhost:3000`.*

#### Terminal 2 — Start the Frontend Application:
```bash
cd frontend
npm install
npm run dev
```
*Frontend application will be available at `http://localhost:5173`.*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check returning status of server, database, and Gemini |
| `POST` | `/api/job-descriptions` | Parse and store raw text Job Description |
| `POST` | `/api/job-descriptions/upload` | Upload and parse JD file (PDF, DOCX, TXT) |
| `GET` | `/api/job-descriptions` | List all active Job Descriptions |
| `GET` | `/api/job-descriptions/:id` | Get specific Job Description |
| `PUT` | `/api/job-descriptions/:id` | Update Job Description fields |
| `DELETE` | `/api/job-descriptions/:id` | Delete Job Description and cascade screenings |
| `POST` | `/api/resumes` | Batch upload and parse candidate resumes (PDF, DOCX, TXT) |
| `GET` | `/api/resumes` | List all uploaded candidate profiles |
| `GET` | `/api/resumes/:id` | Get candidate profile by ID |
| `DELETE` | `/api/resumes/:id` | Delete candidate resume and cascade screenings |
| `POST` | `/api/screenings` | Screen candidate against JD and generate scores |
| `GET` | `/api/screenings` | Fetch screening results (supports `?resumeId=` and `?jdId=`) |
| `POST` | `/api/chat` | Send grounded query to Recruvo AI contextual assistant |
| `POST` | `/api/feedback` | Submit user feedback or bug report |

---

## 🔒 Security & Anti-Hallucination Guardrails

- **Strict Source Distinction:** Recruvo explicitly separates candidate resume facts from Job Description requirements and AI evaluations.
- **Unverified Information Handling:** If requested information is absent from candidate documents, Recruvo AI explicitly states that the data cannot be verified.
- **Local Embedded Storage:** In default mode, candidate records and screening scores remain securely persisted within local embedded PostgreSQL (`PGlite`).

---

## 📄 License

This project is licensed under the **MIT License**.

---

*“Smarter Hiring. Brighter Teams.”* — **Recruvo**