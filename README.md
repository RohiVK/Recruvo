# ✦ Hirely — AI Hiring Intelligence

> **Hire smarter. Hire better.**

Hirely is a premium, AI-powered recruitment and candidate intelligence SaaS platform. It transforms raw candidate resumes and job requirements into structured, actionable hiring signals using Google Gemini AI (`gemini-3.6-flash`) and PostgreSQL.

---

## ✨ Features

- **✦ Modern Executive Dashboard:** Real-time KPI metrics, AI activity feeds, and recruitment analytics.
- **📄 Resume Extraction & Intelligence:** Bulk upload PDF and TXT resumes. AI automatically parses candidates into structured JSON schemas.
- **💼 Job Role Parsing:** Parse raw job descriptions into structured qualifications, technical skills, and candidate expectations.
- **⚡ AI Screening Engine:** Automated candidate-to-job match scoring (1–10 scale) complete with explainable AI rationale.
- **🔄 Local Zero-Config Database:** Runs seamlessly with embedded **PGlite** (local PostgreSQL in JS) out of the box, with seamless fallback to external PostgreSQL/Neon DB.
- **🔍 Quick Navigation & Search:** Integrated command palette (`Ctrl + K`), search filters, and fast workspace navigation.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, React Router v7, Vite 8, Lucide Icons, Tailwind CSS v4 |
| **Backend** | Node.js, Express 5 |
| **Database** | Embedded PGlite (Zero-config PostgreSQL) / External PostgreSQL |
| **AI Intelligence** | Google Gemini SDK (`@google/genai` with `gemini-3.6-flash`) |
| **Document Processing** | Multer memory storage, `pdf-parse` |

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/RohiVK/hirely.git
cd hirely
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
# DATABASE_URL=optional_external_postgres_url
```

### 3. Run the Platform

#### Easy Startup (Windows)
Run the included batch script from the root directory:
```cmd
startup.bat
```

#### Manual Startup
In separate terminal windows:

* **Backend:**
  ```bash
  cd backend
  npm install
  npm run dev
  ```

* **Frontend:**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

Open your browser and visit **`http://localhost:5173`**.

---

## 🛰️ API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Application, Database & Gemini status check |
| `POST` | `/api/resumes` | Parse & store candidate resumes |
| `GET` | `/api/resumes` | Fetch candidate list |
| `GET` | `/api/resumes/:id` | Get specific candidate details |
| `POST` | `/api/job-descriptions` | Parse & store job role requirement |
| `GET` | `/api/job-descriptions` | List active job roles |
| `POST` | `/api/screenings` | Run AI screening match evaluation |
| `GET` | `/api/screenings` | List match evaluations & scores |

---

## 🔐 License

Distributed under the MIT License.