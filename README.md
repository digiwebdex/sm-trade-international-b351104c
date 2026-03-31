# S. M. Trade International

> Corporate B2B website for promotional products, corporate gifts & industrial supplies.

**Live:** [smtradeint.com](https://smtradeint.com)  
**Server:** Hostinger KVM VPS — 187.77.144.38  
**Stack:** React 18 + Express.js + PostgreSQL

---

## Quick Start

```bash
# Clone & install
git clone https://github.com/digiwebdex/sm-trade-international-bc54e3bd.git
cd sm-trade-international-bc54e3bd
npm install
cd backend && npm install && cd ..

# Start development
npm run dev          # Frontend → http://localhost:5173
cd backend && npm run dev  # Backend → http://localhost:4000
```

## Deploy to Production

```bash
ssh root@187.77.144.38
cd /var/www/sm-trade-international && bash deploy.sh
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Complete A-to-Z development documentation |
| [Architecture](docs/ARCHITECTURE.md) | System design & data flow diagrams |
| [API Reference](docs/API_REFERENCE.md) | All API endpoints with examples |
| [Database Schema](docs/DATABASE_SCHEMA.md) | Tables, relationships & indexes |
| [Deployment Commands](docs/DEPLOYMENT_COMMANDS.md) | All server management commands |
| [Deployment History](docs/DEPLOYMENT_HISTORY.md) | Chronological deployment log |
| [Changelog](docs/CHANGELOG.md) | Feature & change history |
| [Migration Report](docs/MIGRATION_REPORT.md) | Supabase → VPS migration details |
| [Security](docs/SECURITY.md) | Auth, API security & infrastructure |

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query, Three.js  
**Backend:** Node.js 20, Express.js, PostgreSQL 16, JWT, Multer  
**Infrastructure:** Nginx, PM2, Certbot SSL, Git-based deployment

---

## Project Structure

```
├── src/                  # React frontend
│   ├── components/       # UI components (public + admin)
│   ├── contexts/         # Auth, Language, QuoteBasket
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # API client & utilities
│   └── pages/            # Route pages (public + admin)
├── backend/              # Express.js API server
├── database/             # SQL schema & migrations
├── docs/                 # Project documentation
├── nginx/                # Nginx config
├── migration/            # Migration scripts
└── deploy.sh             # Production deploy script
```
