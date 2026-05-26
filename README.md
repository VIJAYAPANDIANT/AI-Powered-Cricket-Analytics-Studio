# 🏏 IPL InsightX – AI Powered Cricket Analytics Studio

> A premium full-stack AI-powered cricket analytics platform for IPL data analysis, visualization, and tactical insights.

![IPL InsightX Banner](https://img.shields.io/badge/IPL-InsightX-emerald?style=for-the-badge&logo=cricket&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

---

## 🌐 Live Deployments

- **Frontend Application:** [https://ai-powered-cricket-analytics-studio.vercel.app](https://ai-powered-cricket-analytics-studio.vercel.app)
- **Backend REST API:** [https://ai-powered-cricket-analytics-studio-phi.vercel.app](https://ai-powered-cricket-analytics-studio-phi.vercel.app)

---

## 📸 Overview

**IPL InsightX** is an advanced AI-powered cricket analytics studio that transforms raw ball-by-ball delivery logs and match scoreboards into actionable, tactical summaries. Built for coaches, analysts, and cricket enthusiasts.

---

## 🚀 Features

### 📊 Dashboard
- Total Matches, Teams, Runs, Wickets KPI cards
- Highest Team Score & Average Match Score
- Season Run Trends, Team Win Distribution, Toss Impact charts

### 📈 Analytics Studio
- Top 10 Batters & Bowlers charts
- Strike Rate Scatter Analysis
- Match Phase (Powerplay / Middle / Death Overs) run rate chart
- Dismissal Methods Distribution
- Venue Performance Analysis

### 🤖 AI Insights
- Auto-generated cricket insights from data
- Hidden pattern detection
- Tactical co-pilot summaries

### 📄 Reports
- Analytical Match Ledger with pagination
- Exportable PDF reports (PDFKit)
- CSV data export
- PNG chart exports

### 🔒 Security
- JWT Authentication (Register / Login / Logout)
- bcrypt password hashing
- File validation middleware
- Rate limiting

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 19 |
| Next.js | 16 (Turbopack) |
| Tailwind CSS | v4 |
| Recharts | v3 |
| Framer Motion | v12 |
| TypeScript | v5 |

### Backend
| Technology | Version |
|---|---|
| Node.js | LTS |
| Express.js | v4 |
| JWT (jsonwebtoken) | v9 |
| Multer | v1 |
| PDFKit | v0.15 |
| csv-parser | v3 |
| TypeScript | v5 |

### Python Engine
- Pandas, NumPy, Matplotlib
- Data cleaning, feature engineering, visualizations

---

## 📁 Project Structure

```
AI-Powered Cricket Analytics Studio/
├── frontend/                   # Next.js React App
│   ├── src/
│   │   ├── app/                # Pages (Home, Dashboard, Analytics, Reports, About, Profile)
│   │   ├── components/         # Navbar, Sidebar, Charts, Filters, Footer, etc.
│   │   ├── context/            # Auth, Analytics, Toast contexts
│   │   └── utils/              # Mock data, helpers
│   └── package.json
│
├── backend/                    # Express.js REST API
│   ├── src/
│   │   ├── controllers/        # Auth, Analytics, Dataset, Report controllers
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Auth, logging, rate limiter, cache, upload
│   │   ├── services/           # analyticsService, pdfService
│   │   └── server.ts           # Express app entry point
│   └── package.json
│
└── python_engine/              # Python Data Processing
    ├── data_cleaning/
    ├── feature_engineering/
    ├── analytics/
    └── visualizations/
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9
- Python 3.10+ (for python_engine)

### 1. Clone the Repository
```bash
git clone https://github.com/VIJAYAPANDIANT/AI-Powered-Cricket-Analytics-Studio.git
cd AI-Powered-Cricket-Analytics-Studio
```

### 2. Start the Backend (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### 3. Start the Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
```
http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| POST | `/api/auth/logout` | Logout session |
| POST | `/api/dataset/upload/matches` | Upload matches.csv |
| POST | `/api/dataset/upload/deliveries` | Upload deliveries.csv |
| GET | `/api/analytics/metrics` | Dashboard KPI metrics |
| GET | `/api/analytics/charts` | All chart datasets |
| GET | `/api/analytics/insights` | AI-generated insights |
| GET | `/api/analytics/filters` | Filter options |
| GET | `/api/reports/pdf` | Download PDF report |
| GET | `/api/reports/export/csv` | Export CSV data |

---

## 👤 Administrator

| Field | Value |
|---|---|
| **Name** | Vijayapandian T |
| **Email** | vijayapandian112007@gmail.com |
| **Role** | Platform Administrator |

---

## 📄 License

© 2026 IPL InsightX – AI Powered Cricket Analytics Studio. All Rights Reserved.
