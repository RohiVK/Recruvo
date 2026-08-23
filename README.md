# Hirely

Hirely is an AI-powered hiring platform designed to streamline candidate screening and talent acquisition. It processes resumes and job descriptions, converting unstructured text into structured data using Google Gemini (`gemini-3.6-flash`). The backend evaluates how closely candidates align with job requirements, producing match scores from 1 to 10 along with detailed reasoning.

---

## Features

- **Candidate Intelligence:** Parse PDF and plain text resumes into structured candidate profiles including skills, experience, education, and projects.
- **Job Requirement Parsing:** Extract structured requirements, responsibilities, technical skills, and qualifications from raw job description text.
- **AI Match Evaluation:** Evaluate candidate-role compatibility with a scoring system (1 to 10) and actionable feedback explaining the score.
- **Embedded Local Database:** Runs out-of-the-box using PGlite (embedded PostgreSQL in Node.js) with optional support for external PostgreSQL database instances.
- **Recruiter Dashboard:** Comprehensive overview of active job roles, uploaded candidates, screening results, and analytics.
- **Workspace Navigation:** Fast keyboard-driven command palette (`Ctrl + K`) for quick navigation and global actions.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, React Router v7, Vite 8, Tailwind CSS v4, Lucide Icons |
| Backend | Node.js, Express 5 |
| Database | PGlite (embedded PostgreSQL) / Standard PostgreSQL |
| AI Integration | Google Gen AI SDK (`@google/genai` with `gemini-3.6-flash`) |
| Parsing | Multer, pdf-parse |

---

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Google Gemini API key

### 1. Clone Repository

```bash
git clone https://github.com/RohiVK/hirely.git
cd hirely
```

### 2. Configure Environment

Create a `.env` file in the `backend` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname (Optional)
```

### 3. Run the Application

#### Windows Batch File
Double-click or execute `startup.bat` from the project root:
```cmd
startup.bat
```

#### Manual Start

1. Start the Backend API:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Start the Frontend Application:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Access the frontend application in your browser at `http://localhost:5173`.

---

## API Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Server, database, and AI service health status |
| POST | `/api/resumes` | Upload and parse resumes |
| GET | `/api/resumes` | Get all candidates |
| GET | `/api/resumes/:id` | Get specific candidate by ID |
| POST | `/api/job-descriptions` | Parse and create job description |
| GET | `/api/job-descriptions` | Get all active job descriptions |
| POST | `/api/screenings` | Run candidate screening for a job |
| GET | `/api/screenings` | Get screening results |

---

## License

This project is licensed under the MIT License.