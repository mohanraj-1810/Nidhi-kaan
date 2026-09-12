# Nidhi Kaan Backend API

Node.js/Express backend for Nidhi Kaan compliance verification system.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SECRET_KEY=your_service_role_key
   DATABASE_URL=your_postgres_connection_string
   PORT=3001
   ```

3. Run database migration in Supabase SQL Editor (see `spec/plan.md`)

## Development

```bash
npm run dev    # Start dev server with hot reload
npm run build  # Build for production
npm start      # Run production build
```

## API Endpoints

### Case Management
- `POST /api/v1/cases/submit` - Submit a new case
- `POST /api/v1/cases/:id/verify-gst` - Verify GST/invoice
- `POST /api/v1/cases/:id/fast-forward` - Escalate case to next authority level

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### Health Check
- `GET /health` - Service health check

## Test Scenarios

1. **Genuine case**: Submit with valid lat/long and stage → `APPROVED`
2. **Fraudulent invoice**: Submit with `INV-FAKE-XX` → `FRAUD_FLAGGED`
3. **Escalation**: Call `/fast-forward` 3 times → `CM_DASHBOARD`