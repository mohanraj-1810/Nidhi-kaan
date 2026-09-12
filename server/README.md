# Nidhi Kaan Backend API

Node.js/Express backend for the **Nidhi Kaan** compliance verification system — automating project verification, GST fraud detection, and multi-level escalation workflows for government infrastructure projects.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Nidhi Kaan Backend                       │
├─────────────────────────────────────────────────────────────────┤
│  Express.js (TypeScript)                                        │
│  ├── /api/v1/cases          → Case intake & verification       │
│  ├── /api/v1/dashboard      → Analytics & reporting            │
│  ├── /api-docs              → Swagger UI documentation         │
│  └── /health                → Health checks                    │
├─────────────────────────────────────────────────────────────────┤
│  Services                                                     │
│  ├── caseService.ts         → Business logic & Supabase ops   │
│  └── mock verification      → System 1 (geo) + System 2 (stage)│
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                   │
│  ├── Supabase (PostgreSQL)  → Primary database                │
│  └── @supabase/supabase-js  → Client SDK                      │
├─────────────────────────────────────────────────────────────────┤
│  Validation & Docs                                            │
│  ├── Zod schemas            → Request/response validation     │
│  └── swagger-jsdoc + UI     → OpenAPI 3.0 documentation       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20+ |
| Framework | Express.js | 4.18+ |
| Language | TypeScript | 5.3+ |
| Database | Supabase (PostgreSQL) | Latest |
| ORM/Client | @supabase/supabase-js | 2.39+ |
| Validation | Zod | 3.22+ |
| API Docs | swagger-jsdoc + swagger-ui-express | 5.0+ |
| Dev Tools | tsx, tsc | Latest |

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── supabase.ts      # Supabase client initialization
│   │   └── swagger.ts       # OpenAPI 3.0 specification
│   ├── middleware/
│   │   └── requestLogger.ts # HTTP request logging
│   ├── routes/
│   │   ├── api.ts           # Main router (v1)
│   │   ├── cases/
│   │   │   └── index.ts     # Case endpoints
│   │   └── dashboard/
│   │       └── index.ts     # Dashboard endpoints
│   ├── schemas/
│   │   └── index.ts         # Zod schemas (request/response)
│   ├── services/
│   │   └── caseService.ts   # Business logic + Supabase ops
│   ├── utils/
│   │   └── errors.ts        # Custom AppError class
│   └── index.ts             # Application entry point
├── dist/                    # Compiled output (gitignored)
├── .env                     # Environment variables (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- Supabase project with database schema applied

### Installation

```bash
cd server
npm install
```

### Environment Configuration

Create `.env` in `server/`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
PORT=3001
```

### Database Schema

Run in **Supabase SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_type VARCHAR(50) NOT NULL,          -- 'Housing', 'Road', 'Bus Stand'
    beneficiary_contractor_id VARCHAR(50) NOT NULL,
    claimed_stage VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    authenticity_status VARCHAR(20) DEFAULT 'PENDING',  -- 'PASSED', 'FAILED'
    progress_status VARCHAR(20) DEFAULT 'PENDING',      -- 'APPROVED', 'REJECTED'
    invoice_number VARCHAR(50),
    gst_status VARCHAR(20) DEFAULT 'PENDING',           -- 'VALID', 'FRAUD_FLAGGED'
    escalation_level VARCHAR(50) DEFAULT 'LOCAL_STAFF', -- 'LOCAL_STAFF', 'DISTRICT', 'STATE', 'CM_DASHBOARD'
    sla_timer_hours INT DEFAULT 48,
    is_escalated BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Development

```bash
npm run dev      # Hot reload on http://localhost:3001
npm run build    # TypeScript compilation to dist/
npm start        # Run production build
```

---

## API Documentation

### Swagger UI
Interactive documentation at: **http://localhost:3001/api-docs/**

### OpenAPI Spec
Raw JSON at: **http://localhost:3001/api-docs/swagger.json**

---

## API Endpoints

### Case Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/cases/submit` | Submit new case with auto-verification |
| `POST` | `/api/v1/cases/:id/verify-gst` | Verify GST invoice (fraud detection) |
| `POST` | `/api/v1/cases/:id/fast-forward` | Escalate to next authority level |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard/stats` | Aggregate statistics |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |

---

## Request/Response Examples

### Submit Case

```bash
curl -X POST http://localhost:3001/api/v1/cases/submit \
  -H "Content-Type: application/json" \
  -d '{
    "project_type": "Housing",
    "beneficiary_contractor_id": "CONT-001",
    "claimed_stage": "Foundation",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "invoice_number": "INV-001"
  }'
```

**Response (201):**
```json
{
  "id": "3a3edb1a-23d9-4a7e-b2b2-5ae68a59d5b7",
  "project_type": "Housing",
  "beneficiary_contractor_id": "CONT-001",
  "claimed_stage": "Foundation",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "authenticity_status": "PASSED",
  "progress_status": "APPROVED",
  "invoice_number": "INV-001",
  "gst_status": "VALID",
  "escalation_level": "LOCAL_STAFF",
  "sla_timer_hours": 48,
  "is_escalated": false,
  "rejection_reason": null,
  "created_at": "2026-09-12T04:38:28.198+00:00",
  "updated_at": "2026-09-12T04:38:28.198+00:00"
}
```

### Verify GST

```bash
curl -X POST http://localhost:3001/api/v1/cases/3a3edb1a-23d9-4a7e-b2b2-5ae68a59d5b7/verify-gst
```

**Response (200):**
```json
{
  "id": "3a3edb1a-23d9-4a7e-b2b2-5ae68a59d5b7",
  "invoice_number": "INV-001",
  "gst_status": "VALID",
  "message": "GST verification passed"
}
```

### Fast-Forward (Escalate)

```bash
curl -X POST http://localhost:3001/api/v1/cases/3a3edb1a-23d9-4a7e-b2b2-5ae68a59d5b7/fast-forward \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (200):**
```json
{
  "id": "3a3edb1a-23d9-4a7e-b2b2-5ae68a59d5b7",
  "previous_escalation_level": "LOCAL_STAFF",
  "new_escalation_level": "DISTRICT",
  "is_escalated": true,
  "updated_at": "2026-09-12T04:39:27.896+00:00"
}
```

### Dashboard Stats

```bash
curl http://localhost:3001/api/v1/dashboard/stats
```

**Response (200):**
```json
{
  "total_cases": 5,
  "pending_inspections": 0,
  "fraud_flagged_count": 1,
  "escalated_count": 2,
  "cases_by_escalation_level": {
    "LOCAL_STAFF": 3,
    "DISTRICT": 1,
    "STATE": 0,
    "CM_DASHBOARD": 1
  }
}
```

---

## Verification Logic

### System 1: Geographic Authenticity
```typescript
// Mock: Fails if coordinates are (0, 0)
if (latitude === 0 && longitude === 0) return 'FAILED';
return 'PASSED';
```

### System 2: Stage Validation
```typescript
// Mock: Valid stages only
const validStages = ['Foundation', 'Plinth', 'Roof', 'Finishing', 'Complete'];
return validStages.includes(claimedStage) ? 'APPROVED' : 'REJECTED';
```

### GST Fraud Detection
```typescript
// Flags invoices containing "FAKE" (case-insensitive)
return invoiceNumber?.toUpperCase().includes('FAKE') 
  ? 'FRAUD_FLAGGED' 
  : 'VALID';
```

---

## Escalation Flow

```
LOCAL_STAFF → DISTRICT → STATE → CM_DASHBOARD
     │           │         │           │
     ▼           ▼         ▼           ▼
  Initial    District   State       Chief Minister
  Review     Authority  Authority   Dashboard
```

- Each `/fast-forward` call advances one level
- `is_escalated` flag set to `true` on first escalation
- Optional `rejection_reason` sets `progress_status: 'REJECTED'`

---

## Error Handling

| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Zod schema validation failed |
| 404 | `NOT_FOUND` | Case not found |
| 500 | `INTERNAL_ERROR` | Server/Database error |

**Error Response Format:**
```json
{
  "error": "Case not found"
}
```

**Validation Error Format:**
```json
{
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

---

## Test Scenarios

| Scenario | Input | Expected Result |
|----------|-------|-----------------|
| **Genuine Case** | Valid lat/long, valid stage | `authenticity_status: PASSED`, `progress_status: APPROVED` |
| **Fake Location** | lat: 0, long: 0 | `authenticity_status: FAILED` |
| **Invalid Stage** | claimed_stage: "InvalidStage" | `progress_status: REJECTED` |
| **Fraud Invoice** | invoice_number: "INV-FAKE-01" | `gst_status: FRAUD_FLAGGED` |
| **Full Escalation** | 3× fast-forward | `escalation_level: CM_DASHBOARD` |

---

## Scripts

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "lint": "eslint src --ext .ts"
}
```

---

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
DATABASE_URL=...
```

### Docker (Optional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

---

## Contributing

1. Follow TypeScript strict mode
2. Validate all inputs with Zod schemas
3. Use `AppError` for operational errors
4. Add Swagger annotations for new endpoints
5. Run `npm run build` before committing

---

## License

Internal use only — Nidhi Kaan Project